os.execute("rm -rf " .. "/share/sound/" .. ngx.var.arg_id)

local command = "/etc/nginx/switcher.sh " .. ngx.var.arg_name .. " " .. ngx.var.arg_id
local handle = io.popen(command, "r")

local output = handle:read('*a')
local _, exit, status = handle:close()

ngx.status = ngx.HTTP_NO_CONTENT
