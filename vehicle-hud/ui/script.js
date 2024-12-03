window.addEventListener('message', (event) => {
  if (event.data.type === 'updateVehicleHud') {
    const { show, speed, gear, fuel, rpm } = event.data
    const hud = document.getElementById('vehicle-hud')

    if (!hud) return

    if (show) {
      hud.classList.remove('hidden')
      updateSpeed(hud, speed)
      updateGear(hud, gear, speed)
      updateFuel(hud, fuel)
      updateRPM(hud, rpm)
    } else {
      hud.classList.add('hidden')
    }
  }
})

function updateSpeed(hud, speed) {
  const speedNumber = hud.querySelector('.speed-value .number')
  if (speedNumber) {
    speedNumber.textContent = Math.round(speed || 0)
  }
}

function updateGear(hud, gear, speed) {
  const gearElement = hud.querySelector('.gear')
  if (gearElement) {
    let displayGear = 'N' // Default to 'N' for neutral

    if (gear === -1) {
      // If gear is -1, vehicle is in reverse
      displayGear = 'R'
    } else if (gear === 0) {
      // If gear is 0, determine if it's reverse or neutral based on speed
      displayGear = speed > 0 ? 'R' : 'N'
    } else {
      // For all other gears, display the gear number
      displayGear = gear
    }

    gearElement.textContent = displayGear
  }
}

function updateFuel(hud, fuel) {
  const fuelBar = hud.querySelector('.fuel .bar-fill')
  const fuelValue = hud.querySelector('.fuel .value')
  if (fuelBar && fuelValue) {
    const fuelPercentage = Math.round(fuel || 0)
    fuelBar.style.height = `${fuelPercentage}%`
    fuelValue.textContent = `${fuelPercentage}%`
  }
}

function updateRPM(hud, rpm) {
  const rpmFill = hud.querySelector('.rpm-fill')
  const segments = hud.querySelectorAll('.segment')
  const normalizedRpm = Math.min(Math.max(rpm || 0, 0), 1)

  if (rpmFill) {
    rpmFill.style.width = `${normalizedRpm * 100}%`
  }

  if (segments.length > 0) {
    const activeSegments = Math.floor(normalizedRpm * segments.length)
    segments.forEach((segment, index) => {
      const position = index / segments.length
      if (index < activeSegments) {
        segment.style.backgroundColor = getSegmentColor(position)
      } else {
        segment.style.backgroundColor = ''
      }
    })
  }
}

function getSegmentColor(position) {
  if (position > 0.8) return '#e74c3c' // Red for high RPM
  if (position > 0.6) return '#f1c40f' // Yellow for medium RPM
  return '#2ecc71' // Green for low RPM
}
