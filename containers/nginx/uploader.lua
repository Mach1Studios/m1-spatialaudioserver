local tus_server = require "tus.server"

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
end
