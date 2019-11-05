markdown-cv
===========

A curriculum vitae maintained in plain text and rendered to html and pdf using CSS.

For more details see the [project page](http://elipapa.github.io/markdown-cv) or the blog post on [why I switched to markdown for my CV](http://elipapa.github.io/blog/why-i-switched-to-markdown-for-my-cv.html).

## Usage

A local instance can be started. You need Ruby >= 2.4.0 and Bundler.

```bash
bundle install
bundle exec jekyll serve > jekyll.log 2>&1 &
```

You can access the CV via http://127.0.0.1:4000/ and generate a PDF through your OS PDF printer.
