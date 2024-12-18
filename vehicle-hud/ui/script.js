let isMetric = true; // Default to metric (km/h)

// Cache DOM elements
const hudElements = {
    hud: document.getElementById('vehicle-hud'),
    speedNumber: document.querySelector('.speed-value .number'),
    speedUnit: document.querySelector('.speed-value .unit'),
    gear: document.querySelector('.gear'),
    fuelBar: document.querySelector('.fuel .bar-fill'),
    fuelValue: document.querySelector('.fuel .value'),
    rpmFill: document.querySelector('.rpm-fill'),
    rpmSegments: document.querySelectorAll('.segment')
};

window.addEventListener('message', (event) => {
    if (event.data.type === 'updateVehicleHud') {
        const { show, speed, gear, fuel, rpm, unit, position } = event.data

        if (!hudElements.hud) return

        if (show) {
            hudElements.hud.classList.remove('hidden')
            // Update HUD position only if changed
            if (!hudElements.hud.classList.contains(`hud-${position}`)) {
                hudElements.hud.className = `hud-${position}`
            }
            updateSpeed(hudElements.hud, speed, unit)
            updateGear(hudElements.hud, gear, speed)
            updateFuel(hudElements.hud, fuel)
            updateRPM(hudElements.hud, rpm)
        } else {
            hudElements.hud.classList.add('hidden')
        }
    } else if (event.data.type === 'initSpeedUnit') {
        // Handle initial speed unit setting
        isMetric = event.data.isMetric;
        const unitSpan = document.querySelector('.speed-value .unit');
        if (unitSpan) {
            unitSpan.textContent = isMetric ? 'KM/H' : 'MP/H';
        }
    }
})

function toggleSpeedUnit() {
    isMetric = !isMetric;
    const unitSpan = document.querySelector('.speed-value .unit');
    unitSpan.textContent = isMetric ? 'KM/H' : 'MP/H';
    
    // Update speed with new unit
    const speedNumber = document.querySelector('.speed-value .number');
    const currentSpeed = parseInt(speedNumber.textContent);
    if (currentSpeed) {
        if (isMetric) {
            speedNumber.textContent = Math.round(currentSpeed * 1.60934); // mph to km/h
        } else {
            speedNumber.textContent = Math.round(currentSpeed * 0.621371); // km/h to mph
        }
    }
    
    // Send unit preference to the client
    fetch(`https://${GetParentResourceName()}/updateSpeedUnit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            isMetric: isMetric
        })
    });
}

function updateSpeed(hud, speed, unit) {
    hudElements.speedNumber.textContent = speed
    hudElements.speedUnit.textContent = unit.toUpperCase()
}

function updateGear(hud, gear, speed) {
    hudElements.gear.textContent = speed === 0 ? 'N' : gear
}

function updateFuel(hud, fuel) {
    hudElements.fuelBar.style.height = `${fuel}%`
    hudElements.fuelValue.textContent = `${fuel}%`
}

// Pre-calculate segment positions for better performance
const segmentPositions = Array.from(hudElements.rpmSegments).map((_, index) => 
    (index + 1) / hudElements.rpmSegments.length
);

function updateRPM(hud, rpm) {
    const fillWidth = rpm * 100
    hudElements.rpmFill.style.width = `${fillWidth}%`

    hudElements.rpmSegments.forEach((segment, index) => {
        const position = segmentPositions[index]
        const color = rpm >= position ? getSegmentColor(position) : ''
        if (segment.style.backgroundColor !== color) {
            segment.style.backgroundColor = color
        }
    })
}

// Cache segment colors for better performance
const segmentColors = {
    high: 'rgba(231, 76, 60, 0.8)',   // Red for high RPM
    medium: 'rgba(241, 196, 15, 0.8)', // Yellow for medium-high RPM
    normal: 'rgba(255, 255, 255, 0.8)' // White for normal RPM
};

function getSegmentColor(position) {
    if (position > 0.8) return segmentColors.high
    if (position > 0.6) return segmentColors.medium
    return segmentColors.normal
}
