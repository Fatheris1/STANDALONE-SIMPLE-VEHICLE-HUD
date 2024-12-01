local ESX = exports["es_extended"]:getSharedObject()
local isInVehicle = false
local currentVehicle = nil
local lastFuel = 0
local lastSpeed = 0
local hudVisible = false

-- Configuration
local CONFIG = {
    updateInterval = 200, -- How often to update HUD (ms)
    maxSpeed = 220,      -- Maximum speed for the speedometer
    fuelWarning = 20,    -- Fuel percentage to start warning
}

-- Helper function to round numbers
local function round(num)
    return math.floor(num + 0.5)
end

-- Helper function to get vehicle fuel level
local function getVehicleFuel(vehicle)
    local fuel = GetVehicleFuelLevel(vehicle)
    if fuel and fuel >= 0 then
        return round(fuel)
    end
    return 0
end

-- Helper function to show/hide HUD
local function toggleHud(show)
    if hudVisible ~= show then
        hudVisible = show
        SendNUIMessage({
            type = 'updateVehicleHud',
            show = show
        })
    end
end

-- Main update loop
Citizen.CreateThread(function()
    while true do
        local sleep = CONFIG.updateInterval
        
        -- Check if player is in vehicle
        local ped = PlayerPedId()
        local inVehicle = IsPedInAnyVehicle(ped, false)
        
        if inVehicle then
            local vehicle = GetVehiclePedIsIn(ped, false)
            
            if vehicle and DoesEntityExist(vehicle) then
                -- Get vehicle data
                local speed = GetEntitySpeed(vehicle) * 3.6  -- Convert to KM/H
                local gear = GetVehicleCurrentGear(vehicle)
                local fuel = getVehicleFuel(vehicle)
                
                -- Only update if values changed significantly
                if math.abs(lastSpeed - speed) > 0.5 or lastFuel ~= fuel or not isInVehicle then
                    -- Format gear text
                    local gearText = 'N'
                    if gear > 0 then
                        gearText = tostring(gear)
                    elseif gear == 0 and speed > 0 then
                        gearText = 'R'
                    end
                    
                    -- Send updates to UI
                    SendNUIMessage({
                        type = 'updateVehicleHud',
                        show = true,
                        speed = speed,
                        gear = gearText,
                        fuel = fuel
                    })
                    
                    -- Update last known values
                    lastSpeed = speed
                    lastFuel = fuel
                    isInVehicle = true
                end
            end
        else
            if isInVehicle then
                isInVehicle = false
                lastSpeed = 0
                lastFuel = 0
                toggleHud(false)
            end
            sleep = 1000 -- Longer sleep when not in vehicle
        end
        
        Citizen.Wait(sleep)
    end
end)

-- Handle resource stop
AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        toggleHud(false)
    end
end)

-- Hide HUD when player dies
AddEventHandler('esx:onPlayerDeath', function()
    toggleHud(false)
end)
