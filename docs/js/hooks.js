// Hooks for paged.js
{
  // Utils
  let pandocMeta, pandocMetaToString;
  {
    let el = document.getElementById('pandoc-meta');
    pandocMeta = el ? JSON.parse(el.firstChild.data) : {};
  }

  pandocMetaToString = meta => {
    let el = document.createElement('div');
    el.innerHTML = meta;
    return el.innerText;
  };

  let isString = value => {
    return typeof value === 'string' || value instanceof String;
  };

  let isArray = value => {
    return value && typeof value === 'object' && value.constructor === Array;
  };

  // This hook is an attempt to fix https://github.com/rstudio/pagedown/issues/131
  // Sometimes, the {break-after: avoid;} declaration applied on headers
  // lead to duplicated headers. I hate this bug.
  // This is linked to the way the HTML source is written
  // When we have the \n character like this: <div>\n<h1>...</h1>
  // the header may be duplicated.
  // But, if we have <div><h1>...</h1> without any \n, the problem disappear
  // I think this handler can fix most of cases
  // Obviously, we cannot suppress all the \n in the HTML document
  // because carriage returns are important in <pre> elements.
  // Tested with Chrome 76.0.3809.100/Windows
  Paged.registerHandlers(class extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
      this.carriageReturn = String.fromCharCode(10);
    }

    checkNode(node) {
      if (!node) return;
      if (node.nodeType !== 3) return;
      if (node.textContent === this.carriageReturn) {
        node.remove();
      }
    }

    afterParsed(parsed) {
      let template = document.querySelector('template').content;
      const breakAfterAvoidElements = template.querySelectorAll('[data-break-after="avoid"], [data-break-before="avoid"]');
      for (let el of breakAfterAvoidElements) {
        this.checkNode(el.previousSibling);
        this.checkNode(el.nextSibling);
      }
    }
  });

  // This hook creates a list of abbreviations
  // Note: we also could implement this feature using a Pandoc filter
  Paged.registerHandlers(class extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
    }
    beforeParsed(content) {
      const abbreviations = content.querySelectorAll('abbr');
      if(abbreviations.length === 0) return;
      const loaTitle = 'List of Abbreviations';
      const loaId = 'LOA';
      const tocList = content.querySelector('.toc ul');
      let listOfAbbreviations = document.createElement('div');
      let descriptionList = document.createElement('dl');
      content.appendChild(listOfAbbreviations);
      listOfAbbreviations.id = loaId;
      listOfAbbreviations.classList.add('section', 'front-matter', 'level1', 'loa');
      listOfAbbreviations.innerHTML = '<h1>' + loaTitle + '</h1>';
      listOfAbbreviations.appendChild(descriptionList);
      for(let abbr of abbreviations) {
        if(!abbr.title) continue;
        let term = document.createElement('dt');
        let definition = document.createElement('dd');
        descriptionList.appendChild(term);
        descriptionList.appendChild(definition);
        term.innerHTML = abbr.innerHTML;
        definition.innerText = abbr.title;
      }
      if (tocList) {
        const loaTOCItem = document.createElement('li');
        loaTOCItem.innerHTML = '<a href="#' + loaId + '">' + loaTitle + '</a>';
        tocList.appendChild(loaTOCItem);
      }
    }
  });

  // This hook moves the sections of class front-matter in the div.front-matter-container
  Paged.registerHandlers(class extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
    }

    beforeParsed(content) {
      const frontMatter = content.querySelector('.front-matter-container');
      if (!frontMatter) return;

      // move front matter sections in the front matter container
      const frontMatterSections = content.querySelectorAll('.level1.front-matter');
      for (const section of frontMatterSections) {
        frontMatter.appendChild(section);
      }

      // add the class front-matter-ref to any <a></a> element
      // referring to an entry in the front matter
      const anchors = content.querySelectorAll('a[href^="#"]:not([href*=":"])');
      for (const a of anchors) {
        const ref = a.getAttribute('href').replace(/^#/, '');
        const element = content.getElementById(ref);
        if (frontMatter.contains(element)) a.classList.add('front-matter-ref');
      }

      // update the toc, lof and lot for front matter sections
      const frontMatterSectionsLinks = content.querySelectorAll('.toc .front-matter-ref, .lof .front-matter-ref, .lot .front-matter-ref');
      for (let i = frontMatterSectionsLinks.length - 1; i >= 0; i--) {
        const listItem = frontMatterSectionsLinks[i].parentNode;
        const list = listItem.parentNode;
        list.insertBefore(listItem, list.firstChild);
      }
    }
  });

  // This hook expands the links in the lists of figures and tables
  Paged.registerHandlers(class extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
    }

    beforeParsed(content) {
      const items = content.querySelectorAll('.lof li, .lot li');
      for (const item of items) {
        const anchor = item.firstChild;
        anchor.innerText = item.innerText;
        item.innerText = '';
        item.append(anchor);
      }
    }
  });

  // This hook adds spans for leading symbols
  Paged.registerHandlers(class extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
    }

    beforeParsed(content) {
      const anchors = content.querySelectorAll('.toc a, .lof a, .lot a');
      for (const a of anchors) {
        a.innerHTML = a.innerHTML + '<span class="leaders"></span>';
      }
    }
  });

  // This hook appends short titles spans
  Paged.registerHandlers(class extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
    }

    beforeParsed(content) {
    /* A factory returning a function that appends short titles spans.
       The text content of these spans are reused for running titles (see default.css).
       Argument: level - An integer between 1 and 6.
    */
    function appendShortTitleSpans(level) {
      return () => {
        const divs = Array.from(content.querySelectorAll('.level' + level));

        function addSpan(div) {
          const mainHeader = div.getElementsByTagName('h' + level)[0];
          if (!mainHeader) return;
          const mainTitle = mainHeader.textContent;
          const spanSectionNumber = mainHeader.getElementsByClassName('header-section-number')[0];
          const mainNumber = !!spanSectionNumber ? spanSectionNumber.textContent : '';
          const runningTitle = 'shortTitle' in div.dataset ? mainNumber + ' ' + div.dataset.shortTitle : mainTitle;
          const span = document.createElement('span');
          span.className = 'shorttitle' + level;
          span.innerText = runningTitle;
          span.style.display = "none";
          mainHeader.appendChild(span);
          if (level == 1 && div.querySelector('.level2') === null) {
            let span2 = document.createElement('span');
            span2.className = 'shorttitle2';
            span2.innerText = ' ';
            span2.style.display = "none";
            span.insertAdjacentElement('afterend', span2);
          }
        }

        for (const div of divs) {
          addSpan(div);
        }
      };
    }

    appendShortTitleSpans(1)();
    appendShortTitleSpans(2)();
    }
  });

  // Footnotes support
  Paged.registerHandlers(class extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);

      this.splittedParagraphRefs = [];
    }

    beforeParsed(content) {
      // remove footnotes in toc, lof, lot
      // see https://github.com/rstudio/pagedown/issues/54
      let removeThese = content.querySelectorAll('.toc .footnote, .lof .footnote, .lot .footnote');
      for (const el of removeThese) {
        el.remove();
      }

      let footnotes = content.querySelectorAll('.footnote');

      for (let footnote of footnotes) {
        let parentElement = footnote.parentElement;
        let footnoteCall = document.createElement('a');
        let footnoteNumber = footnote.dataset.pagedownFootnoteNumber;

        footnoteCall.className = 'footnote-ref'; // same class as Pandoc
        footnoteCall.setAttribute('id', 'fnref' + footnoteNumber); // same notation as Pandoc
        footnoteCall.setAttribute('href', '#' + footnote.id);
        footnoteCall.innerHTML = '<sup>' + footnoteNumber +'</sup>';
        parentElement.insertBefore(footnoteCall, footnote);

        // Here comes a hack. Fortunately, it works with Chrome and FF.
        let handler = document.createElement('p');
        handler.className = 'footnoteHandler';
        parentElement.insertBefore(handler, footnote);
        handler.appendChild(footnote);
        handler.style.display = 'inline-block';
        handler.style.width = '100%';
        handler.style.float = 'right';
        handler.style.pageBreakInside = 'avoid';
      }
    }

    afterPageLayout(pageFragment, page, breakToken) {
      function hasItemParent(node) {
        if (node.parentElement === null) {
          return false;
        } else {
          if (node.parentElement.tagName === 'LI') {
            return true;
          } else {
            return hasItemParent(node.parentElement);
          }
        }
      }
      // If a li item is broken, we store the reference of the p child element
      // see https://github.com/rstudio/pagedown/issues/23#issue-376548000
      if (breakToken !== undefined) {
        if (breakToken.node.nodeName === "#text" && hasItemParent(breakToken.node)) {
          this.splittedParagraphRefs.push(breakToken.node.parentElement.dataset.ref);
        }
      }
    }

    afterRendered(pages) {
      for (let page of pages) {
        const footnotes = page.element.querySelectorAll('.footnote');
        if (footnotes.length === 0) {
          continue;
        }

        const pageContent = page.element.querySelector('.pagedjs_page_content');
        let hr = document.createElement('hr');
        let footnoteArea = document.createElement('div');

        pageContent.style.display = 'flex';
        pageContent.style.flexDirection = 'column';

        hr.className = 'footnote-break';
        hr.style.marginTop = 'auto';
        hr.style.marginBottom = 0;
        hr.style.marginLeft = 0;
        hr.style.marginRight = 'auto';
        pageContent.appendChild(hr);

        footnoteArea.className = 'footnote-area';
        pageContent.appendChild(footnoteArea);

        for (let footnote of footnotes) {
          let handler = footnote.parentElement;

          footnoteArea.appendChild(footnote);
          handler.parentNode.removeChild(handler);

          footnote.innerHTML = '<sup>' + footnote.dataset.pagedownFootnoteNumber + '</sup>' + footnote.innerHTML;
          footnote.style.fontSize = 'x-small';
          footnote.style.marginTop = 0;
          footnote.style.marginBottom = 0;
          footnote.style.paddingTop = 0;
          footnote.style.paddingBottom = 0;
          footnote.style.display = 'block';
        }
      }

      for (let ref of this.splittedParagraphRefs) {
        let paragraphFirstPage = document.querySelector('[data-split-to="' + ref + '"]');
        // We test whether the paragraph is empty
        // see https://github.com/rstudio/pagedown/issues/23#issue-376548000
        if (paragraphFirstPage.innerText === "") {
          paragraphFirstPage.parentElement.style.display = "none";
          let paragraphSecondPage = document.querySelector('[data-split-from="' + ref + '"]');
          paragraphSecondPage.parentElement.style.setProperty('list-style', 'inherit', 'important');
        }
      }
    }
  });

  // Support for "Chapter " label on section with class `.chapter`
  Paged.registerHandlers(class extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);

      this.options = pandocMeta['chapter_name'];

      let styles;
      if (isString(this.options)) {
        this.options = pandocMetaToString(this.options);
        styles = `
        :root {
          --chapter-name-before: "${this.options}";
        }
        `;
      }
      if (isArray(this.options)) {
        this.options = this.options.map(pandocMetaToString);
        styles = `
        :root {
          --chapter-name-before: "${this.options[0]}";
          --chapter-name-after: "${this.options[1]}";
        }
        `;
      }
      if (styles) polisher.insert(styles);
    }

    beforeParsed(content) {
      const tocAnchors = content.querySelectorAll('.toc a[href^="#"]:not([href*=":"]');
      for (const anchor of tocAnchors) {
        const ref = anchor.getAttribute('href').replace(/^#/, '');
        const element = content.getElementById(ref);
        if (element.classList.contains('chapter')) {
          anchor.classList.add('chapter-ref');
        }
      }
    }
  });

  // Main text line numbering,
  // see https://github.com/rstudio/pagedown/issues/115
  // Original idea: Julien Taquet, thanks!
  Paged.registerHandlers(class extends Paged.Handler {
    constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);

      // get the number-lines option from Pandoc metavariables
      this.options = pandocMeta['number-lines'];
      // quit early if the "number-lines" option is false or missing
      if (!this.options) return;
      // retrieve the selector if provided, otherwise use the default selector
      this.selector = this.options.selector ? pandocMetaToString(this.options.selector) : '.level1:not(.front-matter) h1, .level1 h2, .level1 h3, .level1 p';

      const styles = `
      :root {
        --line-numbers-padding-right: 10px;
        --line-numbers-font-size: 8pt;
      }
      .pagedown-linenumbers-container {
        position: absolute;
        margin-top: var(--pagedjs-margin-top);
        right: calc(var(--pagedjs-width) - var(--pagedjs-margin-left));
      }
      .maintextlinenumbers {
        position: absolute;
        right: 0;
        text-align: right;
        padding-right: var(--line-numbers-padding-right);
        font-size: var(--line-numbers-font-size);
      }
      `;
      polisher.insert(styles);

      this.resetLinesCounter();
    }

    appendLineNumbersContainer(page) {
      const pagebox = page.element.querySelector('.pagedjs_pagebox');
      const lineNumbersContainer = document.createElement('div');
      lineNumbersContainer.classList.add('pagedown-linenumbers-container');

      return pagebox.appendChild(lineNumbersContainer);
    }

    lineHeight(element) {
      // If the document stylesheet does not define a value for line-height,
      // Blink returns "normal". Therefore, parseInt may return NaN.
      return parseInt(getComputedStyle(element).lineHeight);
    }

    innerHeight(element) {
      let outerHeight = element.getBoundingClientRect().height;
      let {borderTopWidth,
           borderBottomWidth,
           paddingTop,
           paddingBottom} = getComputedStyle(element);

      borderTopWidth = parseFloat(borderTopWidth);
      borderBottomWidth = parseFloat(borderBottomWidth);
      paddingTop = parseFloat(paddingTop);
      paddingBottom = parseFloat(paddingBottom);

      return Math.round(outerHeight - borderTopWidth - borderBottomWidth - paddingTop - paddingBottom);
    }

    arrayOfInt(from, length) {
      // adapted from https://stackoverflow.com/a/50234108/6500804
      return Array.from(Array(length).keys(), n => n + from);
    }

    incrementLinesCounter(value) {
      this.linesCounter = this.linesCounter + value;
    }

    resetLinesCounter() {
      this.linesCounter = 0;
    }

    isDisplayMath(element) {
      const nodes = element.childNodes;
      if (nodes.length != 1) return false;
      return (nodes[0].nodeName === 'SPAN') && (nodes[0].classList.value === 'math display');
    }

    afterRendered(pages) {
      if (!this.options) return;

      for (let page of pages) {
        const lineNumbersContainer = this.appendLineNumbersContainer(page);
        const pageAreaY = page.area.getBoundingClientRect().y;
        let elementsToNumber = page.area.querySelectorAll(this.selector);

        for (let element of elementsToNumber) {
          // Do not add line numbers for display math environment
          if (this.isDisplayMath(element)) continue;

          // Try to retrieve line height
          const lineHeight = this.lineHeight(element);
          // Test against lineHeight method returns NaN
          if (!lineHeight) {
            console.warn('Failed to compute line height value on "' + page.id + '".');
            continue;
          }

          const innerHeight = this.innerHeight(element);

          // Number of lines estimation
          // There is no built-in method to detect the number of lines in a block.
          // The main caveat is that an actual line height can differ from
          // the line-height CSS property.
          // Mixed fonts, subscripts, superscripts, inline math... can increase
          // the actual line height.
          // Here, we divide the inner height of the block by the line-height
          // computed property and round to the floor to take into account that
          // sometimes the actual line height is greater than its property value.
          // This is far from perfect and can be easily broken especially by
          // inline math.
          const nLines = Math.floor(innerHeight / lineHeight);

          // do not add line numbers for void paragraphs
          if (nLines <= 0) continue;

          const linenumbers = document.createElement('div');
          lineNumbersContainer.appendChild(linenumbers);
          linenumbers.classList.add('maintextlinenumbers');

          const elementY = element.getBoundingClientRect().y;
          linenumbers.style.top = (elementY - pageAreaY) + 'px';

          const cs = getComputedStyle(element);
          const paddingTop = parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth);
          linenumbers.style.paddingTop = paddingTop + 'px';

          linenumbers.style.lineHeight = cs.lineHeight;

          linenumbers.innerHTML = this.arrayOfInt(this.linesCounter + 1, nLines)
                                      .reduce((t, v) => t + '<br />' + v);
          this.incrementLinesCounter(nLines);
        }

        if (this.options['reset-page']) {
          this.resetLinesCounter();
        }
      }
    }
  });
}
