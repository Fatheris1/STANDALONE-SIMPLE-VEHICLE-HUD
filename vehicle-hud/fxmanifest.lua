fx_version 'cerulean'
game 'gta5'

name 'vehicle-hud'
description 'Vehicle HUD'
version '1.0.0'

shared_scripts {
    '@es_extended/imports.lua'
}

client_scripts {
    'client.lua'
}

server_scripts {
    'server.lua'
}

ui_page 'ui/index.html'

files {
    'ui/index.html',
    'ui/style.css',
    'ui/script.js'
}
