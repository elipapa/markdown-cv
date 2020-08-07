local options = {} -- where we store pandoc Meta

-- This function tests the pandoc version againt a target version
-- The target version has to be of the form {2, 3} or {2, 3, 1}
local function pandocAvailable(target)
 -- use a shallow copy of PANDOC_VERSION
 -- this is required since pandoc 2.7.3, see https://github.com/rstudio/pagedown/issues/111
  local pandocVersion = {}
  for i = 1,3 do
    table.insert(pandocVersion, PANDOC_VERSION[i])
  end
  pandocVersion[3] = pandocVersion[3] or 0 -- because there is not always a patch number
  target[3] = target[3] or 0

  for i = 1,3 do
    if pandocVersion[i] > target[i] then return true end
    if pandocVersion[i] < target[i] then return false end
  end
  return true
end

local function getMeta(meta)
  options = meta
  return nil -- Do not modify Meta
end

local function uriToFootnote(link)
  local target = link.target
  local content = link.content
  local contentString = pandoc.utils.stringify(content)
  local footnoteContent
  local classes = {}
  local attr

  if not options["links-to-footnotes"] then return nil end
  if target == contentString then return nil end
  if target == "mailto:" .. contentString then return nil end

  if string.find(target, "://") then
    if pandocAvailable({2, 3, 1}) then classes = {"uri"} end
    attr = pandoc.Attr("", classes, {})
    footnoteContent = {pandoc.Para({pandoc.Link(target, target, "", attr)})}
    table.insert(content, pandoc.Note(footnoteContent))
    return content
  end

  if string.find(target, "^mailto:") then
    if pandocAvailable({2, 3, 1}) then classes = {"email"} end
    attr = pandoc.Attr("", classes, {})
    footnoteContent = {pandoc.Para({
      pandoc.Link(string.gsub(target, "^mailto:", ""), target, "", attr)
    })}
    table.insert(content, pandoc.Note(footnoteContent))
    return content
  end

end

return {{Meta = getMeta}, {Link = uriToFootnote}}
