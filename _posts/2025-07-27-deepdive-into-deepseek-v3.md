---
layout: post
title: "Deep-dive into DeepSeek V3"
date: 2025-07-27 21:10:00 +0000
tags: [AI, Deep Learning, Paper Review]
excerpt: "A walk through the DeepSeek v3 technical report — a 40 page engineering master class covering FP8 mixed precision training, Multi Latent Attention, Multi-Token Prediction, and auxiliary-loss-free MoE load balancing."
---

I know I'm a little late to the party here, but I figured I'd kick off my first blog post diving into one of the best papers of the last year, the [DeepSeek v3 technical report](https://arxiv.org/pdf/2412.19437). It's a 40 page engineering master class so there's a lot to unpack. I'll start with some background / overview and then dive into some of the more interesting techniques this paper introduced.

<figure class="figure figure--narrow">
  <img src="{{ '/assets/img/posts/deepseek-whale.webp' | relative_url }}" alt="A whale coding at a desk, in Ghibli style">
</figure>

## 🐳 Who, What, Where, Why?

DeepSeek is a Chinese frontier lab (also quant fund?) and a core contributor to the open source AI community. This model, at the time of release, was the best open source model for it's size and was competitive with leading closed source labs. Even more notable for this release, is that the lab claims to have achieved all of this with 2.79M H800 GPU hours (for context, a comparable open source model, Llama 3.1 405B, reportedly used [~39M GPU hrs](https://huggingface.co/meta-llama/Llama-3.1-405B)). To make the feat more impressive, DeepSeek is working with nerfed GPUs that have significantly reduced compute capability due to chip restrictions vs what US companies are working with. If you recall, this model [sent the market into a tizzy](https://www.reuters.com/technology/chinas-deepseek-sets-off-ai-market-rout-2025-01-27/) with hundreds of billions of market cap wiped off compute providers like Nvidia in fears that these large training clusters are unnecessary (yeah looking back on that, prob a good time to buy lol). It's helpful to keep this in the back of your mind as we go through some of the details of the paper - you can see that a lot of their innovations are a direct result of working with constrained resources.

## 📝 TLDR

Unsurprisingly, it's a transformer based LLM structure with MoE for efficiency. Some highlights:

- 671B parameters, while only 37B are active for any given token.
- 61 Transformer layers, with hidden dim = 7168, and num_heads = 128.
- All FFNs are MoE layers except the first three transformer blocks.
- each MoE has 1 shared expert and 256 routed experts - for any token 8 experts are activated and ensured it will only be sent to 4 nodes for efficiency.
- Introduce a new memory efficient attention variant (specifically for inference) they call '**Multi Latent Attention**'
- Include experimental '**Multi Token Prediction**' modules during training to improve model efficiency
- A bunch of gnarly engineering work to get FP8 mixed precision training to work at scale with MoE structure.
- Introduce a new loss free architecture for load balancing amongst the expert heads.

Cool...so now we have an idea of the overall structure, let's get into the details!

## 🤿 Deep Dive

A constant theme across the paper - **DeepSeek goes to great lengths to save memory**. There are honestly so many gemms (lol) in the paper, but below are some I'd like to highlight.

### Mixed Precision Training

Historically, training in FP8 is difficult due to outliers across certain dimensions destroying the information for a quantization group. DeepSeek uses both tile-wise quantization (e.g. for each token, across the hidden dimension in groups of 128) and block-wise grouping elements (e.g. for weight matrices, 128x128 blocks) to employ a finer grained quantization group, and is able to take advantage of FP8 GEMM kernels for compute efficiency. They calculate the max values across quantization groups online rather than using delayed values to ensure accuracy.

<figure class="figure">
  <img src="{{ '/assets/img/posts/deepseek-mla.webp' | relative_url }}" alt="Diagram of DeepSeek's fine-grained quantization scheme">
  <figcaption>From Deep Seek Technical Report</figcaption>
</figure>

Perhaps the most interesting tidbit from the paper was how the low precision tensor core Matrix Multiply-Accumulate instructions (MMA) didn't actually use a full FP32 bit accumulate to support the overflow from large matrix mult (if you are unfamiliar with tensor cores, [this](https://semianalysis.com/2025/06/23/nvidia-tensor-core-evolution-from-volta-to-blackwell/) is a great read). Instead, they found that the H800s only retained 14bits - not nearly enough to deal with the large FP8 mat muls and keep high accuracy! As a result, they needed to 'promote' the matrix multiplications from the tensor cores to cuda cores every `N_c` elements (requires a copy to the cuda cores) where they can run full FP32 precision. DeepSeek took advantage of warp groups in newer Nvidia architectures for the tensor core instructions (using `WGMMA` instruction) so you can have one warp group copying while another performs the next group calculation. They set the num elements (`N_c`) = 128 = which is 4 warpgroups, so 4 WGMMAS were enough to mask the copy latency with the computation. It's unclear to me if the tensor core accumulation short-changing was widely known before this paper.

A couple more top hits on the engineering side:

- they use a special `E5M6` format for activations that are inputs to linear layers to keep higher precision required for backward pass.
- inputs to `SwiGLU` operator are cached and just recompute it's output in the backwards pass (also to save memory).
- activations before MoE dispatch are quantized into FP8 to increase communication bandwidth.
- some optimizer states are saved in BF16.

Like I said... a lot of bandwidth went into optimizing memory!

### Multi Latent Attention (MLA)

A new attention variant they introduced, specifically designed to help inference by reducing the KV cache size via low-rank compression. To be honest, the notation in the paper is a bit dizzying, and I found it hard to keep track of all the different dimensions for the matrix / vectors. So rather than display the equations I'll explain in plain English: basically, KV keys are projected to a much smaller dim (the paper notes 512 for the compressed size vs 7168 for the uncompressed hidden dimension), and the down-projection matrix is shared across keys and values, producing a smaller vector `c_t_KV`. They need to store an additional weight matrix to create the RoPE values, but the advantage is that these two vectors are the only values needed to store in the KV cache, since they can reproduce the k,v keys in the hidden dimension `h` via up-projection matrix (a separate one for keys and values).

<figure class="figure">
  <img src="{{ '/assets/img/posts/deepseek-mtp.webp' | relative_url }}" alt="Diagram of Multi Latent Attention low-rank KV compression">
  <figcaption>From Deep Seek Technical Report</figcaption>
</figure>

They do the same thing with different down/up projection matrices for query keys, and increase the compressed dimension size to 1536. All in all, they are sacrificing some information via the down / up projections, but as a result are able to significantly reduce KV cache size, which can be a monster during inference. I haven't heard of any other models using this technique yet, but worth keeping an eye out for future adoption and whether or not this becomes the standard.

### Multi-Token Prediction (MTP)

This is an attempt to improve training efficiency by moving the model to predict more than one token at a time in the forward pass, with the idea that it may allow the model to pre-plan its representations to better predict future tokens. The model head is structured so that every extra token you want to predict has it's own MTP module, which is basically a single transformer block that takes the output of the previous MTP module (or main model). The embedding layers / output heads are shared across main model and modules. Each module will produce it's own cross entropy loss and at the end it is averaged across the MTP heads and weighted in the total loss with the main model.

<figure class="figure">
  <img src="{{ '/assets/img/posts/deepseek-moe-loss.webp' | relative_url }}" alt="Diagram of the Multi-Token Prediction module structure">
  <figcaption>From Deep Seek Technical Report</figcaption>
</figure>

Interestingly, the MTP modules can be dropped at inference time and are just here to improve training efficiency. The MTP depth is set to 1 for training, e.g. each forward pass predicts two tokens. Once again, not sure I've heard anyone else doing this during training, but maybe something to keep an eye on!

### Auxiliary Loss Free MoE

Last but not least, a new loss-free MoE architecture is introduced to help load-balance across the expert heads which they deem '*Auxiliarly Free Load Balancing*'. Typically, each expert receives a gating value based on token-expert affinity and then the topK are chosen to route the token to. However, to fight against routing collapse / unbalanced loads, they added in a manual bias term to each gating value in the topK. So if a particular expert was getting too much love, they would lower the bias, and vice versa to increase underserved experts.

To note, they also include a sequence-wise loss term to make sure that tokens in a particular sequence don't overload to a single expert. Lastly, to reduce communication overhead you can restrict any token to at most M nodes (where each node holds 8 experts). They did this buy summing affinity scores across all the experts on a node, and choosing the M highest that way. This clever trick allows them to achieve nearly perfect computation-communication overlap.

## Conclusion

Ok there was a lot! If I'm being honest the paper is full of a lot more incredible engineering details (specialized communication warps for example) but for the sake of time, I tried to pluck out what I thought to be the most consequential / interesting. I'd highly encourage you to read it for yourself if you have the time! I plan on covering their reasoning paper, as well as a walk through of some of the more recent RL techniques used in fine tuning in case you are looking for more. Thanks for reading, hope you enjoyed 😀
