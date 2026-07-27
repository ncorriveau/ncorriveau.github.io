# ncorriveau.github.io

My personal site — bio, blog, and learning resources. Built with [Jekyll](https://jekyllrb.com/)
and served by GitHub Pages at <https://ncorriveau.github.io>.

GitHub Pages builds this server-side on every push to `master`. There is no CI
workflow and no build step you have to run.

## Adding a blog post

Create a file in `_posts/` named `YYYY-MM-DD-some-slug.md`:

```markdown
---
layout: post
title: "Your title here"
date: 2026-08-01 09:00:00 +0000
tags: [AI, Essay]
excerpt: "One or two sentences shown on the home page and blog index."
---

Your post, in markdown.
```

Then `git push`. It goes live at `/blog/some-slug/` within a minute or two.

Tags are free-form — the filter chips on `/blog/` are generated from whatever
tags exist across all posts, so a new tag shows up automatically.

Post images go in `assets/img/posts/` and are referenced with:

```liquid
{% raw %}<figure class="figure">
  <img src="{{ '/assets/img/posts/my-image.webp' | relative_url }}" alt="Describe the image">
  <figcaption>Optional caption</figcaption>
</figure>{% endraw %}
```

Add `figure--narrow` (300px) or `figure--medium` (480px) to constrain the width.
For a highlighted aside, use `<aside class="callout">` — see the trading post
for an example.

## Local preview (optional)

You don't need this — GitHub builds the site server-side on push. But to preview
locally:

```bash
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>.

On this Mac that path currently fails: macOS system Ruby is 2.6 (too old), and
the Xcode Command Line Tools install is missing the C++ standard library headers,
so gems with native extensions won't compile. The working setup here is Homebrew
Ruby with Jekyll installed directly, skipping the Gemfile:

```bash
export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:$PATH"
JEKYLL_NO_BUNDLER_REQUIRE=true jekyll serve
```

To fix the toolchain properly, reinstall the Command Line Tools:
`sudo rm -rf /Library/Developer/CommandLineTools && xcode-select --install`.

## Layout

```
_config.yml       site config, nav, social links
_layouts/         default, home, page, post
_includes/        head, nav, social
_posts/           blog posts (markdown)
index.md          home page — bio + socials
blog.html         post index with tag filtering
learning.md       books and courses
assets/css/       stylesheet (light + dark, driven by CSS custom properties)
assets/img/       images
```

Social links are defined once in `_config.yml` under `socials:` and rendered by
`_includes/social.html`.
