local cjson = require "cjson"
local redis_client = require "resty.redis"
local tus_server = require "tus.server"
local uuid = require "resty.jit-uuid"

-- TUS init and configs
local tus = tus_server:new()

tus.config.storage_backend = "tus.storage_file"
tus.config.storage_backend_config.storage_path = "/share/sound"
tus.config.storage_backend_config.lock_zone = ngx.shared.tuslock
tus.config.upload_url = "/upload"
tus.config.expire_timeout = 1209600

tus:process_request()

if tus.resource.name and tus.resource.state == "completed" then
  local filename = tus.resource.info.metadata.filename
  local path = tus.sb:get_path(tus.resource.name)
  local uploaded = "/share/sound/" .. filename

  -- rename and delete temprorary file
  os.rename(path, uploaded)
  tus.sb:delete(tus.resource.name)

  local id = uuid.generate_v4()

  -- Redis connection and transaction proceed
  local redis = redis_client:new()
  redis:set_timeouts(1000, 1000, 1000)

  -- FIXME: connection return resolve error for m1-redis
  local ok, err = redis:connect("172.20.0.2", 6379)
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
  redis:hset(fileKey, "id", id, "name", filename, "originalname", filename)
  redis:rpush("tracks:all", fileKey)
  redis:exec()

  -- ok now we can try to create manifest for dash
  -- local command = "/etc/nginx/switcher.sh " .. filename .. " " .. id
  -- local handle = io.popen(command)
end
