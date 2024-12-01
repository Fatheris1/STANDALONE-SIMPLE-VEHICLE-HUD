let isVehicleHudVisible = false;

$(document).ready(function() {
    window.addEventListener('message', function(event) {
        let data = event.data;

        if (data.type === 'updateVehicleHud') {
            if (data.show) {
                $('.vehicle-hud').fadeIn();
                updateHud(data);
            } else {
                $('.vehicle-hud').fadeOut();
            }
        }
    });
});

function updateHud(data) {
    // Update speed
    $('#speed').text(Math.round(data.speed));
    
    // Update speedometer circle (max speed 220 km/h)
    const maxSpeed = 220;
    const speedPercent = Math.min(data.speed / maxSpeed, 1);
    const circumference = 2 * Math.PI * 70; // radius is 70
    const offset = circumference - (circumference * speedPercent);
    $('.speed-progress').css('stroke-dashoffset', offset);
    
    // Update gear
    $('#gear').text(data.gear);
    
    // Update fuel level (0-100)
    const fuelPercent = Math.round(data.fuel);
    $('#fuel-level').css('width', `${fuelPercent}%`);
    $('.fuel-percent').text(`${fuelPercent}%`);
}
