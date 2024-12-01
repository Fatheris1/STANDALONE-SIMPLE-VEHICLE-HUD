fx_version 'cerulean'
game 'gta5'

name 'Modern Vehicle HUD'
description 'A modern, minimalist vehicle HUD for FiveM ESX servers'
author 'Fatheris'
version '1.0.0'

shared_scripts {
    '@es_extended/imports.lua'
}

client_scripts {
    'client.lua'
}

ui_page 'ui/index.html'

files {
    'ui/index.html',
    'ui/style.css',
    'ui/script.js'
}
