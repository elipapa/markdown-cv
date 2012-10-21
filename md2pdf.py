#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
md2pdf
converts markdown file to PDF using a given CSS style sheet

usage:
Outputs a PDF file, using the given CSS style sheet
> md2pdf input.md --css input.css
"""

import markdown
import codecs
from subprocess import call

import argparse
parser = argparse.ArgumentParser(description='converts markdown file to PDF using a given CSS style sheet')

parser.add_argument('mdsource')
parser.add_argument('--css', dest="css")

args = parser.parse_args()
filename = args.mdsource.split('.')[0]


if args.css:
    head = """<!doctype html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link href="%s" type="text/css" rel="stylesheet">
</head>
""" % args.css
else:
    head = """<!doctype html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
"""

# convert the markdown file to html
mdsourcef = codecs.open(args.mdsource, mode="r", encoding="utf8")
body = markdown.markdown(mdsourcef.read(),['def_list'])
html = ''.join([head, body])

output_file = codecs.open("%s.html" % filename, "w", encoding="utf8")
output_file.write(html)
print ">>> first writing out %s.html" % filename
print ">>> calling wkthmltopdf"
call(["wkhtmltopdf", "%s.html" % filename, "%s.pdf" % filename])
