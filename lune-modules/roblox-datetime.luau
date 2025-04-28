local LuneDateTime = require("@lune/datetime")

local RobloxDateTime = {}
RobloxDateTime.__index = RobloxDateTime

function newDateTime(unixTimestampMillis: number)
    local self = {}
    setmetatable(self, RobloxDateTime)

    self.UnixTimestampMillis = unixTimestampMillis

    table.freeze(self)

    return self
end

return {
    fromUnixTimestampMillis = function(unixTimestampMillis)
        return newDateTime(unixTimestampMillis)
    end,
    now = function()
        return newDateTime(0) -- just always the epoch for "now"
    end
}