local cjson = require "cjson"
local redis_client = require "resty.redis"
local tus_server = require "tus.server"
local uuid = require "resty.jit-uuid"

-- TUS init and configs
local tus = tus_server:new()

tus.config.storage_backend = "tus.storage_file"
tus.config.storage_backend_config.storage_path = "/share/sound"
tus.config.storage_backend_config.lock_zone = ngx.shared.tuslock
tus.config.upload_url = "/api/upload"
tus.config.expire_timeout = 1209600

tus:process_request()

-- available default formats of m1 transcoder
local formats = {
  Stereo = "Stereo", -- L & R spatialized
  Stereo_Cinema = "Stereo_Cinema", -- L & R spatialized, forward focus
  LCR = "LCR", -- L & R spatialized with C mono
  M1Horizon = "M1Horizon",-- (Mach1 Horizon / Quad) - L R Ls Rs
  M1HorizonS = "M1Horizon+S", -- (Mach1 Horizon / Quad) - L R Ls Rs StereoL StereoR
  M1HorizonPairs = "M1HorizonPairs", -- (Mach1 Horizon / Quad-Binaural) - FrontPair, LeftPair, RearPair, RightPair
  M1Spatial = "M1Spatial", -- (Mach1 Spatial) - Upper L R Ls Rs, Lower L R Ls Rs
  M1SpatialS = "M1Spatial+S", -- (Mach1 Spatial) - Upper L R Ls Rs, Lower L R Ls Rs, StereoL StereoR
  M1SpatialPairs = "M1SpatialPairs", -- (Mach1 Spatial Pairs) - Upper front, left, rear, right, pairs, then lower same
  M1SpatialFaces = "M1SpatialFaces", -- Fc, Lc, Rc, Bc, Tc, Bc
  FiveOh ="FiveOh", -- L C R Ls Rs
  FiveOneFilm = "FiveOneFilm", -- (Pro Tools default / C|24)  - L C R Ls Rs LFE
  FiveOneFilm_Cinema = "FiveOneFilm_Cinema", -- (Pro Tools default / C|24)  - L C R Ls Rs LFE, forward focus
  FiveOneSmpte = "FiveOneSmpte", -- (SMPTE/ITU for Dolby Digital - (AC3) - L R C LFE Ls Rs
  FiveOneDts = "FiveOneDts", -- (DTS) - L R Ls Rs C LFE
  SixOh = "SixOh", -- [INCOMPLETE]
  SevenOnePt = "SevenOnePt", -- (Pro Tools default) - L C R Lss Rss Lsr Rsr LFE
  SevenOnePt_Cinema = "SevenOnePt_Cinema", -- (Pro Tools default) - L C R Lss Rss Lsr Rsr LFE, forward focus
  SevenZero_Cinema = "SevenZero_Cinema", -- (Pro Tools default) - L C R Lss Rss Lsr Rsr, forward focus
  SevenOneSDDS = "SevenOneSDDS", -- (Sony SDDS) - L Lc C Rc R Ls Rs LFE
  SevenZeroSDDS = "SevenZeroSDDS", -- (Sony SDDS) - L Lc C Rc R Ls Rs
  FiveOneTwo = "FiveOneTwo", -- (Film / Pro Tools default) - L C R Lss Rss Lsr Rsr FLts FRts BLts BRts
  FiveZeroTwo = "FiveZeroTwo", -- (Film / Pro Tools default) - L C R Lss Rss Lsr Rsr FLts FRts BLts BRts
  FiveOneFour = "FiveOneFour", -- (Film / Pro Tools default) - L C R Lss Rss Lsr Rsr FLts FRts BLts BRts
  FiveZeroFour = "FiveZeroFour", -- (Film / Pro Tools default) - L C R Lss Rss Lsr Rsr FLts FRts BLts BRts
  SevenOneTwo = "SevenOneTwo", -- (Film / Pro Tools default) - L C R Lss Rss Lsr Rsr LFE Lts Rts
  SevenZeroTwo = "SevenZeroTwo", -- (Film / Pro Tools default) - L C R Lss Rss Lsr Rsr Lts Rts
  SevenOneFour = "SevenOneFour", -- (Film / Pro Tools default) - L C R Lss Rss Lsr Rsr LFE FLts FRts BLts BRts
  SevenZeroFour = "SevenZeroFour", -- (Film / Pro Tools default) - L C R Lss Rss Lsr Rsr FLts FRts BLts BRts
  SevenOneTwo = "SevenOneTwo", -- (SMPTE) - L R C LFE Lss Rss Lsr Rsr Lts Rts [INCOMPLETE]
  SevenZeroTwo = "SevenZeroTwo", -- (SMPTE) - L R C Lss Rss Lsr Rsr Lts Rts [INCOMPLETE]
  DolbyAtmosSevenOneTwo = "DolbyAtmosSevenOneTwo", -- L R C LFE Lss Rss Lsr Rsr Lts Rts [ADM Metadata]
  NineOne = "NineOne", -- [INCOMPLETE]
  NineZero = "NineZero", -- [INCOMPLETE]
  ACNSN3D = "ACNSN3D", -- 1st order B-format, ACN order and SN3D weighting
  FuMa = "FuMa", -- 1st order B-format, Furse-Malham order and weighting
  TBE = "TBE", -- W, X, Y, Z, U, V, T, S
  ACNSN3DO2A = "ACNSN3DO2A", -- 2nd order B-format, AmbiX ACN order and SN3D weighting
  FuMaO2A = "FuMaO2A", -- 2nd order B-format, Furse-Malham order and weighting, W, Y, Z, X, V, T, R, S, U
  ACNSN3DO3A = "ACNSN3DO3A", -- 16 channel AmbiX
  FuMaO3A = "FuMaO3A", -- 3rd order B-format, W, Y, Z, X, V, T, R, S, U, Q, O, M, K, L, N, P
  ACNSN3DmaxRE1oa = "ACNSN3DmaxRE1oa", -- 1st order, AmbiX ACN order and SN3D-maxRE from IEM AllRAD
  ACNSN3DmaxRE2oa = "ACNSN3DmaxRE2oa", -- 2nd order, AmbiX ACN order and SN3D-maxRE from IEM AllRAD
  ACNSN3DmaxRE3oa = "ACNSN3DmaxRE3oa", -- 3rd order, AmbiX ACN order and SN3D-maxRE from IEM AllRAD
  ACNSN3DmaxRE4oa = "ACNSN3DmaxRE4oa", -- 4th order, AmbiX ACN order and SN3D-maxRE from IEM AllRAD
  ACNSN3DmaxRE5oa = "ACNSN3DmaxRE5oa", -- 5th order, AmbiX ACN order and SN3D-maxRE from IEM AllRAD
  ACNSN3DmaxRE6oa = "ACNSN3DmaxRE6oa", -- 6th order, AmbiX ACN order and SN3D-maxRE from IEM AllRAD
  ACNSN3DmaxRE7oa = "ACNSN3DmaxRE7oa", -- 7th order, AmbiX ACN order and SN3D-maxRE from IEM AllRAD
  CH_16 = "16.0", -- 16 channel Surround 3D layout
}

local m1_formats = {
  M1Horizon = "M1Horizon",-- (Mach1 Horizon / Quad) - L R Ls Rs
  M1HorizonS = "M1Horizon+S", -- (Mach1 Horizon / Quad) - L R Ls Rs StereoL StereoR
  M1HorizonPairs = "M1HorizonPairs", -- (Mach1 Horizon / Quad-Binaural) - FrontPair, LeftPair, RearPair, RightPair
  M1Spatial = "M1Spatial", -- (Mach1 Spatial) - Upper L R Ls Rs, Lower L R Ls Rs
  M1SpatialS = "M1Spatial+S", -- (Mach1 Spatial) - Upper L R Ls Rs, Lower L R Ls Rs, StereoL StereoR
  M1SpatialPairs = "M1SpatialPairs", -- (Mach1 Spatial Pairs) - Upper front, left, rear, right, pairs, then lower same
  M1SpatialFaces = "M1SpatialFaces", -- Fc, Lc, Rc, Bc, Tc, Bc
}

------
-- helper local function to check if a value is in a collection
-- @param collection the table based variable (the associative array to inspect)
-- @param value the value to search for
-- @return returns true if value is exist in collection, else false.
local function includes(collection, value)
  return collection[value] ~= nil
end

------
-- helper local function for creating and processing bad requests for nginx in JSON format
-- @param message provided error message
-- @return terminates the processing of the current request with error [for nginx]
local function exeption(message)
  local json = cjson.encode({ message = message })
  ngx.header["Content-Length"] = #json
  ngx.status = ngx.HTTP_BAD_REQUEST
  ngx.say(json)
  return ngx.exit(ngx.HTTP_BAD_REQUEST)
end

------
-- helper local function for decoding TUS metadata from request header
-- @param metadata
-- @return metadata dictionary [the associative array]
local function decode_metadata(metadata)
  local function split(s, delimiter)
    local result = {};

    for match in (s..delimiter):gmatch("(.-)"..delimiter) do
      table.insert(result, match);
    end

    return result;
  end

  local function decode_base64_pair(text)
    if not text then
      return nil
    end
    local p = split(text, " ")
    if p[1] == nil or p[2] == nil or p[3] ~= nil then
      return nil
    end
    local key = p[1]
    local val = ngx.decode_base64(p[2])
    if val == nil then
      return nil
    end
    return {key=key,val=val}
  end

  local dict = {}
  local q = split(metadata, ",")
  if not q then
    q = {}
    table.insert(q, metadata)
  end

  for _, v in pairs(q) do
    local p = decode_base64_pair(v)
    if not p then
      return nil
    end
    dict[p.key] = p.val
  end

  return dict
end

-- payload validation of the first to request; checking available metadata information from header
if tus.resource.state == "created" then
  local headers = ngx.req.get_headers()
  local umeta = headers["upload-metadata"]

  local metadata = decode_metadata(umeta)

  local filename = metadata.filename
  local filetype = metadata.filetype
  local input_format = metadata.input_format
  local output_format = metadata.output_format

  if filename == nil or filetype == nil then
    exeption("Bad payload: missing file name and type metadata")
  end

  if input_format then
    if output_format == nil then
      exeption("Bad payload: there is no track output format for the provided input")
    end

    if not includes(formats, input_format) then
      exeption("Bad payload: invalid type of input format parameter, type '" .. input_format .."' doesn't exist")
    end
    if not includes(m1_formats, output_format) then
      exeption("Bad payload: invalid type of output format parameter, type '" .. output_format .."' doesn't exist")
    end

    if input_format == output_format then
      exeption("Bad payload: input and output formats mustn't match")
    end
  end
end

-- processing uploaded track in the last request
if tus.resource.name and tus.resource.state == "completed" then
  local filename = tus.resource.info.metadata.filename
  local filetype = tus.resource.info.metadata.filetype
  local input_format = tus.resource.info.metadata.input_format
  local output_format = tus.resource.info.metadata.output_format
  local size = tus.resource.info.size
  local timestamp = os.date("!%Y-%m-%dT%TZ")

  local path = tus.sb:get_path(tus.resource.name)
  local uploaded = "/share/sound/" .. filename

  -- execute transcode binary if the input format is present
  if input_format and input_format ~= "M1Spatial" then
    local transcode_command = "/etc/nginx/m1-transcode -in-file "
      .. path .. " -in-fmt "
      .. input_format .. " -out-file "
      .. uploaded .." -out-fmt "
      .. output_format .. " -out-file-chans 0"
    local transcode = io.popen(transcode_command, "r")

    transcode:read('*a')
    transcode:close()
  else
    os.rename(path, uploaded)
  end

  local id = uuid.generate_v4()

  -- Redis connection and transaction proceed
  local redis = redis_client:new()
  redis:set_timeouts(1000, 1000, 1000)

  -- FIXME: connection return resolve error for m1-redis
  local ok, err = redis:connect("172.20.0.3", 6379)
  if not ok then
    ngx.say("Failed to connect: ", err)
    return
  end

  local ok, err = redis:multi()
  if not ok then
    ngx.say("failed to run multi: ", err)
    return
  end

  local fileKey = "track:" .. id
  redis:hset(fileKey,
    "id", id,
    "name", filename,
    "originalname", filename,
    "mimetype", filetype,
    "size", size,
    "prepared", "true",
    -- creation time in ISO 8601 format
    "created", timestamp,
    "updated", timestamp,
    -- just initial value
    "listened", 0
  )
  redis:rpush("tracks:all", fileKey)
  redis:exec()

  -- ok now we can try to create manifest for dash
  local command = "/etc/nginx/switcher.sh " .. filename .. " " .. id
  local handle = io.popen(command, "r")

  local output = handle:read('*a')
  local _, exit, status = handle:close()

  -- delete temprorary files
  tus.sb:delete(tus.resource.name)
end
