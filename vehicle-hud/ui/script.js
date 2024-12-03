// Vehicle HUD
window.addEventListener('message', function(event) {
    if (event.data.type === 'updateVehicleHud') {
        const data = event.data;
        const hud = document.getElementById('vehicle-hud');
        
        if (data.show) {
            hud.classList.remove('hidden');
            
            // Update speed value
            const speed = Math.round(data.speed);
            const speedNumber = hud.querySelector('.speed-value .number');
            if (speedNumber) speedNumber.textContent = speed;
            
            // Update gear
            const gearElement = hud.querySelector('.gear');
            if (gearElement) gearElement.textContent = data.gear || 'N';
            
            // Update fuel bar and value
            const fuelBar = hud.querySelector('.fuel .bar-fill');
            const fuelValue = hud.querySelector('.fuel .value');
            if (fuelBar && fuelValue) {
                const fuel = Math.round(data.fuel);
                fuelBar.style.height = `${fuel}%`;
                fuelValue.textContent = `${fuel}%`;
            }
            
            // Update RPM display
            const rpmFill = hud.querySelector('.rpm-fill');
            if (rpmFill) {
                const rpmWidth = `${data.rpm * 100}%`;
                rpmFill.style.width = rpmWidth;
            }
            
            // Update RPM segments
            const segments = hud.querySelectorAll('.segment');
            if (segments.length > 0) {
                const totalSegments = segments.length;
                const activeSegments = Math.floor(data.rpm * totalSegments);
                
                segments.forEach((segment, index) => {
                    if (index < activeSegments) {
                        const position = index / totalSegments;
                        if (position > 0.8) {
                            segment.style.backgroundColor = '#e74c3c';
                        } else if (position > 0.6) {
                            segment.style.backgroundColor = '#f1c40f';
                        } else {
                            segment.style.backgroundColor = '#2ecc71';
                        }
                    } else {
                        segment.style.backgroundColor = '';
                    }
                });
            }
        } else {
            hud.classList.add('hidden');
        }
    }
});
