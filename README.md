markdown-cv
===========

A curriculum vitae maintained in plain text and rendered to html and pdf using CSS.

For more details see the [project page](http://elipapa.github.io/markdown-cv) or the blog post on [why I switched to markdown for my CV](http://elipapa.github.io/blog/why-i-switched-to-markdown-for-my-cv.html).

***

## Usage

To start, simply [fork the markdown-cv repo](https://github.com/elipapa/markdown-cv)

![](https://help.github.com/assets/images/help/repository/fork_button.jpg)

and then [edit directly in github](https://help.github.com/articles/editing-files-in-your-repository/) the `index.md` file

![](https://help.github.com/assets/images/help/repository/edit-file-edit-button.png)

adding your skills, jobs and education.

![](https://help.github.com/assets/images/help/repository/edit-readme-light.png)

To transform your plain text CV into a beautiful looking HTML page and share it you then have two options:

## Using Github Pages to publish it online

1. Delete the existing `gh-pages` branch from your fork. It will only contain this webpage. You can either use git or [the github web interface](https://help.github.com/articles/creating-and-deleting-branches-within-your-repository/#deleting-a-branch)
2. Create a new branch called `gh-pages` (which will then be a copy of master)
3. Head to *yourusername*.github.io/markdown-cv to see your CV live.

Any change you want to make to your CV from then on would have to be done on the `gh-pages` branch and will be immediately rendered by Github Pages.


## Build it locally and print a PDF
1. [install jekyll](https://jekyllrb.com/docs/installation/) on your computer. `gem install jekyll` will do for most users.
2. Clone your fork on your computer
3. Type `jekyll serve` and you'll be able to see your CV on your local host (the default address is http://localhost:4000).
4. You can edit the `index.md` file and see changes live in your browser.
5. To print a PDF, just press *Print*. Print and web CSS media queries should take care of the styling.


### is this the only style available?

For the moment, yes.
The included CSS renders CV in a style inspired by [kjhealy's vita template](https://github.com/kjhealy/kjh-vita), but any styling is possible. Contributions and forks are welcome!


### Author

Eliseo Papa ([Twitter](http://twitter.com/elipapa)/[GitHub](http://github.com/elipapa)/[website](https://elipapa.github.io)).

![Eliseo Papa](https://s.gravatar.com/avatar/eae1f0c01afda2bed9ce9cb88f6873f6?s=100)

### License

[MIT License](https://github.com/elipapa/markdown-cv/blob/master/LICENSE)
