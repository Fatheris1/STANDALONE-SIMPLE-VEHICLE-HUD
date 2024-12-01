# Modern Vehicle HUD for FiveM ESX

A sleek, modern vehicle heads-up display (HUD) for FiveM ESX servers. Features a minimalist design with real-time speed, gear, and fuel indicators.

## Features

- Real-time speedometer with circular progress indicator
- Current gear display (including Reverse and Neutral)
- Fuel level indicator with low fuel warning
- Smooth animations and transitions
- Modern, minimalist design with glassmorphism effects
- Performance optimized with minimal resource usage
- Fully responsive layout

## Dependencies

- ESX Framework
- FiveM Server

## Installation

1. Download or clone this repository
2. Place the folder in your FiveM server's `resources` directory
3. Add `ensure modern-vehicle-hud` to your `server.cfg`
4. Restart your FiveM server

## Configuration

You can modify the following settings in `client.lua`:

```lua
local CONFIG = {
    updateInterval = 200, -- How often to update HUD (ms)
    maxSpeed = 220,      -- Maximum speed for the speedometer
    fuelWarning = 20,    -- Fuel percentage to start warning
}
```

## Customization

The HUD's appearance can be customized by modifying the CSS variables in `ui/style.css`:

```css
:root {
    --primary-color: #00ff9d;
    --secondary-color: #00ffcc;
    --danger-color: #ff3e3e;
    --warning-color: #ff9f1a;
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the author.

## Credits

- Font: Orbitron (Google Fonts)
- ESX Framework Team
- FiveM Community
