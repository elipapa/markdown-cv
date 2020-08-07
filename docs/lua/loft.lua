--[[
    A pandoc filter that generates Lists Of Figures and Tables (loft).
    This filter enables the lot and lof options as in LaTeX output formats.

    The user can also customise the titles with lot-title and lof-title:
    ---
    lof:
    lof-title: "Illustrations" # markdown styling is supported
    ---
--]]

local options = {}     -- where we store pandoc Meta
local tablesList = {}  -- where we store the list of tables
local figuresList = {} -- where we store the list of figures

-- The following function stores pandoc Meta in the options local variable
local function getMeta(meta)
  options = meta
  -- If there is no given titles, use default titles
  if not options["lot-title"] then
    options["lot-title"] = pandoc.MetaInlines("List of Tables")
  end
  if not options["lof-title"] then
    options["lof-title"] = pandoc.MetaInlines("List of Figures")
  end
  return nil -- Do not modify Meta
end

-- This function is called only for Div of class figure inserted by bookdown
local function getFigCaption(div)
  local listOfBlocks = div.content
  local found
  for i, block in ipairs(listOfBlocks) do
    if block.t == "RawBlock" then
      if block.c[2] == '<p class="caption">' then
        found = i + 1
        break
      end
    end
  end
  if found then
    return pandoc.utils.stringify(div.content[found])
  else
    return nil
  end
end

-- This function looks for div of class figure.
-- It builds and saves the items used by the list of figures.
local function addFigRef(div)
  local captionText
  local figref

  -- do not build the lof if not required
  if not options.lof then return nil end

  if div.classes:includes("figure") then
    captionText = getFigCaption(div)
    if not captionText then return nil end

    -- build figure reference from figure caption
    figref = "@ref" .. string.gsub(captionText, "#", "")
    figref = string.gsub(figref, "%)", ") ") -- add a space
    -- insert figure reference in figuresList
    table.insert(figuresList, {pandoc.Plain(pandoc.Str(figref))})
  end
  return nil -- Do not modify Div
end

-- This function inspects the tables captions.
-- When a bookdown id is found, it builds and saves the items used by
--  the list of tables.
local function addTabRef(tab)
  local caption
  local found
  local tabref

  -- do not build the lot if not required
  if not options.lot then return nil end

  caption = pandoc.utils.stringify(tab.caption)
  -- test the presence of a bookdown table id
  found = string.find(caption, "%(#tab:.*%)")
  if found then
    -- build table reference from table caption
    tabref = "@ref" .. string.gsub(caption, "#", "")
    tabref = string.gsub(tabref, "%)", ") ") -- add a space
    -- insert table reference in tablesList
    table.insert(tablesList, {pandoc.Plain(pandoc.Str(tabref))})
  end
  return nil -- Do not modify Table
end

local function appendLoft(doc)
  local lotHeader
  local lofHeader
  local idprefix = options.idprefix or ""

  if options.lof then
    table.insert(doc.blocks, 1, pandoc.BulletList(figuresList))
    lofHeader =
      pandoc.Header(1,
                    {table.unpack(options["lof-title"])},
                    pandoc.Attr(idprefix .. "LOF", {"lof", "unnumbered", "front-matter"}, {})
      )
    table.insert(doc.blocks, 1, lofHeader)
  end

  if options.lot then
    table.insert(doc.blocks, 1, pandoc.BulletList(tablesList))
    lotHeader =
      pandoc.Header(1,
                    {table.unpack(options["lot-title"])},
                    pandoc.Attr(idprefix .. "LOT", {"lot", "unnumbered", "front-matter"}, {})
      )
    table.insert(doc.blocks, 1, lotHeader)
  end
  return pandoc.Pandoc(doc.blocks, doc.meta)
end

return {{Meta = getMeta}, {Div = addFigRef, Table = addTabRef, Doc = appendLoft}}
