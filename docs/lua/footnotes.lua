--[[
    This filter transforms Pandoc's notes in spans.
    See https://stackoverflow.com/questions/51548827/pandoc-lua-filter-how-to-preserve-footnotes-formatting
    and https://github.com/jgm/pandoc/pull/4799

    Requires Pandoc >= 2.2.3
--]]

local options = {} -- where we store pandoc Meta
local noteId = 0 -- ids for notes

local function getMeta(meta)
  options = meta
  return nil -- Do not modify Meta
end

local function noteToSpan(note)
  if not options["paged-footnotes"] then return nil end
  noteId = noteId + 1
  local inlines = pandoc.utils.blocks_to_inlines(note.content, {pandoc.Str'\010'}) -- insert \n between Pandoc's blocks
  local attr = {}
  attr["data-pagedown-footnote-number"] = noteId
  attr["style"] = "white-space: pre-line;" -- use pre-line to render \n
  return pandoc.Span(inlines, pandoc.Attr("fn" .. noteId, {"footnote"}, attr))
end

return {{Meta = getMeta}, {Note = noteToSpan}}
