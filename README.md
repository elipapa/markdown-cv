markdown-cv
===========

A curriculum vitae maintained in plain text and rendered to pdf using CSS.

***

## Build it locally and print a PDF
1. [install jekyll](https://jekyllrb.com/docs/installation/) on your computer. `gem install jekyll` will do for most users.
2. Clone your fork on your computer
3. Type `jekyll serve` and you'll be able to see your CV on your local host (the default address is http://localhost:4000).
4. You can edit the `index.md` file and see changes live in your browser.
5. To print a PDF, just press *Print*. Print and web CSS media queries should take care of the styling.


### Change the style

The included CSS renders CV in different styles:

- `kjhealy` the original default, inspired by [kjhealy's vita
template](https://github.com/kjhealy/kjh-vita)
- `davewhipp` is a tweaked version of `kjhealy`, with bigger fonts and dates
  right aligned

To change the default style, one needs to simply change the variable in the
`_config.yml` file.


Forked from Eliseo Papa ([Twitter](http://twitter.com/elipapa)/[GitHub](http://github.com/elipapa)/[website](https://elipapa.github.io)).

### License

[MIT License](https://github.com/elipapa/markdown-cv/blob/master/LICENSE)
