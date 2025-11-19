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
-- TODO: have the formats set from the return of `m1-transcode -formats`
local formats = {
  ['1.0'] = "1.0",
  ['M1Spatial-4'] = "M1Spatial-4",
  ['M1HorizonPairs'] = "M1HorizonPairs",
  ['M1Spatial-8'] = "M1Spatial-8",
  ['M1Spatial-8_2'] = "M1Spatial-8_2",
  ['M1Spatial-14'] = "M1Spatial-14",
  ['2.0_M'] = "2.0_M",
  ['2.0_C'] = "2.0_C",
  ['3.0_LCR'] = "3.0_LCR",
  ['3.0_LCR'] = "4.0_LCRS",
  ['4.0_AFormat'] = "4.0_AFormat",
  ['5.0_M'] = "5.0_M",
  ['5.0_C'] = "5.0_C",
  ['5.0_S'] = "5.0_S",
  ['5.0_R'] = "5.0_R",
  ['5.0_C_SIM'] = "5.0_C_SIM",
  ['5.1_M'] = "5.1_M",
  ['5.1_C'] = "5.1_C",
  ['5.1_S'] = "5.1_S",
  ['5.1_R'] = "5.1_R",
  ['5.1_M_SMPTE'] = "5.1_M_SMPTE",
  ['5.1_C_SMPTE'] = "5.1_C_SMPTE",
  ['5.1_S_SMPTE'] = "5.1_S_SMPTE",
  ['5.1_R_SMPTE'] = "5.1_R_SMPTE",
  ['5.1_M_Dts'] = "5.1_M_Dts",
  ['5.1_C_Dts'] = "5.1_C_Dts",
  ['5.1_S_Dts'] = "5.1_S_Dts",
  ['5.1_R_Dts'] = "5.1_R_Dts",
  ['5.1_C_SIM'] = "5.1_C_SIM",
  ['5.0.2_M'] = "5.0.2_M",
  ['5.0.2_C'] = "5.0.2_C",
  ['5.0.2_S'] = "5.0.2_S",
  ['5.1.2_M'] = "5.1.2_M",
  ['5.1.2_C'] = "5.1.2_C",
  ['5.1.2_S'] = "5.1.2_S",
  ['5.0.4_M'] = "5.0.4_M",
  ['5.0.4_C'] = "5.0.4_C",
  ['5.0.4_S'] = "5.0.4_S",
  ['5.1.4_M'] = "5.1.4_M",
  ['5.1.4_C'] = "5.1.4_C",
  ['5.1.4_S'] = "5.1.4_S",
  ['5.0.5_C'] = "5.0.5_C",
  ['5.0.6_C'] = "5.0.6_C",
  ['Octahedron_M'] = "Octahedron_M",
  ['6.0_M'] = "6.0_M",
  ['7.0_M'] = "7.0_M",
  ['7.0_C'] = "7.0_C",
  ['7.0_S'] = "7.0_S",
  ['7.0_M_SDDS'] = "7.0_M_SDDS",
  ['7.0_C_SDDS'] = "7.0_C_SDDS",
  ['7.0_M_SMPTE'] = "7.0_M_SMPTE",
  ['7.0_C_SMPTE'] = "7.0_C_SMPTE",
  ['7.0_S_SMPTE'] = "7.0_S_SMPTE",
  ['7.0_C_3D'] = "7.0_C_3D",
  ['7.0_C_SIM'] = "7.0_C_SIM",
  ['7.1_M'] = "7.1_M",
  ['7.1_C'] = "7.1_C",
  ['7.1_S'] = "7.1_S",
  ['7.1_M_SDDS'] = "7.1_M_SDDS",
  ['7.1_C_SDDS'] = "7.1_C_SDDS",
  ['7.1_M_SMPTE'] = "7.1_M_SMPTE",
  ['7.1_C_SMPTE'] = "7.1_C_SMPTE",
  ['7.1_S_SMPTE'] = "7.1_S_SMPTE",
  ['7.1_C_SIM'] = "7.1_C_SIM",
  ['7.0.2_M'] = "7.0.2_M",
  ['7.0.2_C'] = "7.0.2_C",
  ['7.0.2_S'] = "7.0.2_S",
  ['7.0.2_M_SDDS'] = "7.0.2_M_SDDS",
  ['7.0.2_C_SDDS'] = "7.0.2_C_SDDS",
  ['7.0.2_M_SMPTE'] = "7.0.2_M_SMPTE",
  ['7.0.2_C_SMPTE'] = "7.0.2_C_SMPTE",
  ['7.0.2_S_SMPTE'] = "7.0.2_S_SMPTE",
  ['7.1.2_M'] = "7.1.2_M",
  ['7.1.2_C'] = "7.1.2_C",
  ['7.1.2_C_SIM'] = "7.1.2_C_SIM",
  ['7.1.2_S'] = "7.1.2_S",
  ['7.1.2_M_SDDS'] = "7.1.2_M_SDDS",
  ['7.1.2_C_SDDS'] = "7.1.2_C_SDDS",
  ['7.1.2_M_SMPTE'] = "7.1.2_M_SMPTE",
  ['7.1.2_C_SMPTE'] = "7.1.2_C_SMPTE",
  ['7.1.2_S_SMPTE'] = "7.1.2_S_SMPTE",
  ['7.0.4_M'] = "7.0.4_M",
  ['7.0.4_C'] = "7.0.4_C",
  ['7.0.4_S'] = "7.0.4_S",
  ['7.1.4_M'] = "7.1.4_M",
  ['7.1.4_C'] = "7.1.4_C",
  ['7.1.4_C_SIM'] = "7.1.4_C_SIM",
  ['7.1.4_S'] = "7.1.4_S",
  ['7.0.6_C'] = "7.0.6_C",
  ['8.0.2_C_THX'] = "8.0.2_C_THX",
  ['9.0_M'] = "9.0_M",
  ['9.0_C'] = "9.0_C",
  ['9.1_M'] = "9.1_M",
  ['9.1_C'] = "9.1_C",
  ['9.1.6_M'] = "9.1.6_M",
  ['9.1.6_C'] = "9.1.6_C",
  ['10.0.2_C_THX'] = "10.0.2_C_THX",
  ['16.0_M'] = "16.0_M",
  ['22.0_C'] = "22.0_C",
  ['FOA-Ambix'] = "FOA-Ambix",
  ['FOA-FuMa'] = "FOA-FuMa",
  ['FuMa'] = "FuMa",
  ['ACNSN3D'] = "ACNSN3D",
  ['TBE'] = "TBE",
  ['TBE_2'] = "TBE_2",
  ['ACNSN3DO2A'] = "ACNSN3DO2A",
  ['FuMaO2A'] = "FuMaO2A",
  ['ACNSN3DO3A'] = "ACNSN3DO3A",
  ['FuMaO3A'] = "FuMaO3A",
  ['ACNSN3DYorkBasic1oa'] = "ACNSN3DYorkBasic1oa",
  ['ACNSN3DYorkmaxRE1oa'] = "ACNSN3DYorkmaxRE1oa",
  ['ACNSN3DmaxRE1oa'] = "ACNSN3DmaxRE1oa",
  ['ACNSN3DmaxRE2oa'] = "ACNSN3DmaxRE2oa",
  ['ACNSN3DmaxRE3oa'] = "ACNSN3DmaxRE3oa",
  ['ACNSN3DmaxRE4oa'] = "ACNSN3DmaxRE4oa",
  ['ACNSN3DmaxRE5oa'] = "ACNSN3DmaxRE5oa",
  ['ACNSN3DmaxRE6oa'] = "ACNSN3DmaxRE6oa",
  ['ACNSN3DmaxRE7oa'] = "ACNSN3DmaxRE7oa",
  ['Ambeo'] = "Ambeo",
  ['TetraMic'] = "TetraMic",
  ['SPS-200'] = "SPS-200",
  ['NT-SF1'] = "NT-SF1",
  ['ORTF3D'] = "ORTF3D"
}

local m1_formats = {
  ['M1Spatial-4'] = "M1Spatial-4",
  ['M1HorizonPairs'] = "M1HorizonPairs",
  ['M1Spatial-8'] = "M1Spatial-8",
  ['M1Spatial-8_2'] = "M1Spatial-8_2",
  ['M1Spatial-14'] = "M1Spatial-14",
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

  -- Redis connection and transaction proceed
  local redis = redis_client:new()
  redis:set_timeouts(1000, 1000, 1000)

  -- FIXME: connection return resolve error for m1-redis
  local ok, err = redis:connect("172.20.0.3", 6379)
  if not ok then
    ngx.say("Failed to connect: ", err)
    return
  end

  -- Check if a file with the same name already exists
  local existing_track_id = nil
  local all_tracks = redis:lrange("tracks:all", 0, -1)
  
  for _, track_key in ipairs(all_tracks) do
    local track_data = redis:hgetall(track_key)
    local track_map = {}
    
    -- Convert array to map (Redis returns array of key-value pairs)
    for i = 1, #track_data, 2 do
      track_map[track_data[i]] = track_data[i + 1]
    end
    
    if track_map.originalname == filename then
      existing_track_id = track_map.id
      break
    end
  end

  -- Determine the ID to use (existing or new)
  local id = existing_track_id or uuid.generate_v4()

  -- If file exists, clean up old files
  if existing_track_id then
    ngx.log(ngx.INFO, "Replacing existing file: " .. filename .. " (ID: " .. existing_track_id .. ")")
    
    -- Delete old preload/hls directories
    os.execute("rm -rf /share/sound/preload/" .. existing_track_id)
    os.execute("rm -rf /share/sound/hls/" .. existing_track_id)
    
    -- Delete old audio file
    os.execute("rm -f " .. uploaded)
  else
    -- New file, generate new ID
    ngx.log(ngx.INFO, "Uploading new file: " .. filename)
  end

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

  -- Update or create the track record
  local fileKey = "track:" .. id
  
  if existing_track_id then
    -- Update existing track (preserve created timestamp, update other fields)
    local existing_data = redis:hgetall(fileKey)
    local existing_map = {}
    for i = 1, #existing_data, 2 do
      existing_map[existing_data[i]] = existing_data[i + 1]
    end
    
    redis:hset(fileKey,
      "name", filename,
      "originalname", filename,
      "mimetype", filetype,
      "size", size,
      "prepared", "true",
      "updated", timestamp,
      "listened", 0
    )
  else
    -- Create new track record
    redis:hset(fileKey,
      "id", id,
      "name", filename,
      "originalname", filename,
      "mimetype", filetype,
      "size", size,
      "prepared", "true",
      "created", timestamp,
      "updated", timestamp,
      "listened", 0
    )
    redis:rpush("tracks:all", fileKey)
  end

  -- ok now we can try to create manifest for dash
  local command = "/etc/nginx/switcher.sh " .. filename .. " " .. id
  local handle = io.popen(command, "r")

  local output = handle:read('*a')
  local _, exit, status = handle:close()

  -- delete temprorary files
  tus.sb:delete(tus.resource.name)
  
  redis:close()
end
