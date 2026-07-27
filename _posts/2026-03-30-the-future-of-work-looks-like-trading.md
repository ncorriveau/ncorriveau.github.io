---
layout: post
title: "The future of work looks like Trading"
date: 2026-03-30 01:22:00 +0000
tags: [AI, Agents, Essay]
excerpt: "Wall Street spent decades building systems to monitor and manage large stochastic environments. As knowledge work shifts toward agent swarms, our day-to-day is starting to look a lot more like a trading desk than traditional software engineering."
---

My first year working on the trading floor at Citigroup, the man who sat behind me seemed to have a peculiar job.

His typical day looked something like this:

1. Rolled in at 9 (dangerously late for trading jobs)
2. Fired up a few monitors showing hundreds of tickers, risk metrics, and his P&L
3. Made minimal adjustments throughout the day
4. Left at 5pm

At first glance, it didn't seem like much was happening.

It turned out he was running Citi's algorithmic retail equity book — small size, fully automated trading. His job wasn't to trade manually. It was to monitor the system, ensure nothing went haywire, and make small adjustments when needed.

<figure class="figure">
  <img src="{{ '/assets/img/posts/trading-industry.webp' | relative_url }}" alt="Trading monitor setup">
  <figcaption>Trading monitor setup as depicted in HBO's hit show Industry</figcaption>
</figure>

Since leaving trading, I've been working as a software engineer. But over the last six months, with the explosion of agentic systems, I keep thinking back to the guy who sat behind me.

Increasingly, that's what our jobs are starting to look like.

We are fast approaching a world where our day-to-day looks more like trading than traditional SWE.

You show up to work, monitor the state of your agent swarm (akin to watching live P&L and risk metrics), adjust parameters when needed, ensure nothing is going off the rails, set tasks for them to work on overnight, and check back in the next morning.

Let's break this down further.

<aside class="callout">
  <div class="callout__icon">💡</div>
  <div class="callout__body">
    <strong>Aside: What do I mean by "Trading"?</strong>
    <p>When you mention Wall Street and trading, people immediately think of stockbrokers a la Gordon Gekko or Jordan Belfort. This is not the right mental model — I am talking about broker-dealers, otherwise known as market-makers. This function is dramatized in HBO's <em>Industry</em> and written about in Michael Lewis's <em>Liar's Poker</em>. You provide markets (bid/ask) and manage risk — the best analogy is a bookie in sports betting. Investment banks traditionally provide this service for investors, such as hedge funds and asset managers. High-frequency trading firms like Jane Street, Hudson River Trading, and Citadel Securities have increasingly become prominent as market-makers.</p>
  </div>
</aside>

## 📝 The Trader's Workflow

A year later I had moved desks and was trading HY Credit at Citi with my own book of risk. Although people claim "no two days are the same" in trading, most days followed this structure:

1. Get up to speed on what happened overnight in Asia / Europe. Read relevant news related to what you trade and the broader market.
2. Think about what this means for your book and trading strategy for the day.
3. Create your opening markets and send them out — bid/ask levels on any instrument you trade for clients to transact on.
4. Wait for activity to come back to you (e.g., people transacting on your markets), or pick a couple of trades, coloquially known as "*axes*", you want to work on and try to make them happen.

All the while, you have four monitors up with different Bloomberg screens, monitoring live movements across markets, approximately 100 chats going simultaneously, and a risk / P&L system tracking your performance for the day.

This doesn't sound much like software engineering today, but let me rewrite the flow at a higher level of abstraction:

1. Get up to speed on what happened overnight
2. Think about what you should work on that day and how to structure it
3. Create tasks and send them out
4. Work on some things synchronously while waiting for results
5. Monitor your systems and ensure you are making progress

Now this starts to look more familiar — closer to how we work with coding agents like Claude or Codex.

<figure class="figure figure--medium">
  <img src="{{ '/assets/img/posts/trading-pods.webp' | relative_url }}" alt="Over-dramatized AI-generated image of a software engineer monitoring agents">
  <figcaption>Over-dramatized AI-generated image of SWE's future role 😀</figcaption>
</figure>

We are already here in March 2026, and the trend is accelerating. In the next year I expect this to move towards a more "trading-like" setup:

1. Managing ~5–10 agents to 100s in a swarm-like structure (~100 tickers)
2. Setting guidelines / system constraints (~ risk)
3. Monitoring and assess system outcomes (~ P&L)
4. Refine agent strategy based on outcomes (~ tweaking the algorithm)

## 🧩 Pods

We can take this analogy to trading one step further by looking at how organizations function overall.

Take the "pod" for example — a recent buzzword across tech organizations referring to small, flat teams of 4–5 people who can move quickly on a specific objective.

While the term pod may be new to tech, it's not new in finance. If you've heard of hedge funds like Citadel and Millennium, you might know they operate "multi-pod" strategies. They employ separate teams of investment pods running their own strategies, supported by centralized infrastructure for trading and risk management.

The hedge funds allocate capital to pods based on performance and can shut down pods that underperform or veer off desired risk metrics. Since pods are largely orthogonal in strategy, the overall system tends to perform well across different market conditions.

In our current world, tokens are relatively cheap and represent a small portion of company spend. This will not always be the case. I expect tokens to dominate company expenditure over the next five years and become much more thoughtfully allocated.

In that world, organizations may set up individual pods working on orthogonal products or projects. Those that perform well will receive larger token allocations, while underperforming pods will be shut down with their resources reallocated.

Companies will provide the brand and infrastructure, while small AI-native pods compete for resources based on output.

In short, company tokenomics will become increasingly sophisticated and begin to resemble how hedge funds allocate capital today.

## 🔍 What is currently missing

What exists in trading that does not yet exist in how we work with agents?

1. **Centralized Information Hub**: There is no "Bloomberg" equivalent today for managing and monitoring a fleet of agents in a streamlined fashion. As your agent systems go off an interact with the world on your behalf, it would be nice to have something to track all of this cleanly.
2. **Risk**: In financial markets, risk is typically well-defined (in dollar terms), even if imperfect. To my knowledge, such metrics do not exist for agentic-systems. How can we define measurable indicators, such as system entropy or other dispersion metrics, that track drift of the agentic-system off the given task before it's completed? As agents are granted greater autonomy, we should be able to quantify their confidence, and detect when they're pursuing low-probability or out-of-scope tasks.
3. **Profit and Loss (P&L)**: Trading benefits from an extremely tight feedback loop, that allows you to tweak your strategy accordingly. Most products and operational workflows do not have a feedback mechanism this immediate or unambiguous. As decision-making becomes more opaque, this lack of immediate feedback itself becomes a source of risk unless we design mechanisms that create tighter, closed loop systems for the agents.

I don't have the answers yet, but I'd bet in the not so distant future we'll see new tools emerge to measure risk and outcomes across large-scale agent systems.

## Conclusion

Wall Street has spent decades optimizing trading systems to monitor, manage, and operate within large stochastic environments.

As knowledge work shifts toward agent-based systems, the day-to-day of humans will look much less like traditional work and much more like managing the state of an agent system — with setups that closely resemble modern trading environments.

This shift will also reshape how companies are organized. At scale, token allocation across teams may begin to mirror how trading firms and hedge funds allocate capital today.
