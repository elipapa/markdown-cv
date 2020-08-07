--[[
    A Pandoc filter for the Journal of Statistical Software template
    This filter performs the following actions:
    - store plain keywords in a pandoc variable named keywords-plain
    - calculate the rank for each author
    - build the DOI from the volume and issue parameters and store it in a variable named doi
    - use fallback values for missing month, year, volume or issue
--]]
local isInteger = function(number)
  return math.floor(number) == number
end

local padVolume = function(volume)
  local volumeString = tostring(volume)
  if volume < 10 then return "00" .. volumeString end
  if volume < 100 then return "0" .. volumeString end
  return volumeString
end

local padIssue = function(issue)
  local issueString = tostring(issue)
  if issue < 10 then return "0" .. issueString end
  return issueString
end

local getDOI = function(volume, issue)
  -- store a fallback DOI
  local fallback = "10.18637/jss.v000.i00"

  -- if volume or issue is missing, return the fallback DOI
  if not volume or not issue then return fallback end

  local volumeNumber = tonumber(pandoc.utils.stringify(volume))
  local issueNumber = tonumber(pandoc.utils.stringify(issue))

  -- if volume or issue cannot be coerced to a number, return the fallback DOI
  if not volumeNumber or not issueNumber then return fallback end

  -- if volume or issue is a number lesser than 1, return the fallback DOI
  if volumeNumber < 1 or issueNumber < 1 then return fallback end

  -- if volume or issue is not an integer, return the fallback DOI
  if not isInteger(volumeNumber) or not isInteger(issueNumber) then return fallback end

  -- build the DOI
  return "10.18637/jss.v" .. padVolume(volumeNumber) .. ".i" .. padIssue(issueNumber)
end


Meta = function(meta)
  ---------------------------------------
  --           Keywords                --
  ---------------------------------------
  -- Test if there is one keyword:
  if not meta.keywords then error("At least one keyword must be supplied.") end
  -- Store plain keywords:
  local plainKeywords = {}

  if meta.keywords.t == "MetaList" then
    for i, v in ipairs(meta.keywords) do
      plainKeywords[i] = pandoc.utils.stringify(v)
    end
  else
    -- we have only one keyword
    plainKeywords = {pandoc.utils.stringify(meta.keywords)}
  end

  meta["keywords-plain"] = plainKeywords

  ---------------------------------------
  --              Author               --
  ---------------------------------------
  local author = meta.author

  if author.t == "MetaInlines" then
    meta.author = {data = author, rank = "1"}
  else
    for i, v in ipairs(author) do
      meta.author[i] = {data = v, rank = tostring(i)}
    end
  end

  ----------------------------------------
  --  Build DOI from volume and issue   --
  ----------------------------------------
  meta.doi = getDOI(meta.volume, meta.issue)

  ----------------------------------------
  -- Fallback values for missing params --
  ----------------------------------------
  if not meta.month then meta.month = "MMMMMM" end
  if not meta.year then meta.year = "YYYY" end
  if not meta.volume then meta.volume = "VV" end
  if not meta.issue then meta.issue = "II" end
  if not meta.submitdate then meta.submitdate = "yyyy-mm-dd" end
  if not meta.acceptdate then meta.acceptdate = "yyyy-mm-dd" end

  return meta
end
