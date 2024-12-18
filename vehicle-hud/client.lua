-- Cache config values
local isMetric = Config.SpeedUnit == 'kmh'
local hudPosition = Config.HudPosition
local conversionFactor = isMetric and 3.6 or 2.236936 -- 3.6 for km/h, 2.236936 for direct mph conversion

-- Cache fuel resource state
local fuelResource = nil
CreateThread(function()
    if GetResourceState("ox_fuel") == "started" then
        fuelResource = "ox_fuel"
    elseif GetResourceState("LegacyFuel") == "started" then
        fuelResource = "LegacyFuel"
    end
end)

-- Create function to get the fuel level
local function getFuel(vehicle)
    if not fuelResource then return 0 end
    
    if fuelResource == "ox_fuel" then
        return math.floor(GetVehicleFuelLevel(vehicle))
    else
        return math.floor(exports[fuelResource]:GetFuel(vehicle))
    end
end

-- Cache for previous values to avoid unnecessary updates
local lastData = {
    speed = 0,
    fuel = 0,
    gear = 0,
    rpm = 0
}

local function startVehicleUI(isInVehicle)
    while isInVehicle do
        Wait(150) -- Reduced update frequency for better performance

        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)
        if not vehicle or not DoesEntityExist(vehicle) then
            SendNUIMessage({
                type = 'updateVehicleHud',
                show = false
            })
            break
        end

        -- Get current values
        local speedRaw = GetEntitySpeed(vehicle) * conversionFactor
        local speed = math.floor(speedRaw)
        local fuel = getFuel(vehicle)
        local gear = GetVehicleCurrentGear(vehicle)
        local rpm = GetVehicleCurrentRpm(vehicle)

        -- Only send update if values changed
        if speed ~= lastData.speed or 
           fuel ~= lastData.fuel or 
           gear ~= lastData.gear or 
           rpm ~= lastData.rpm then
            
            -- Update cache
            lastData.speed = speed
            lastData.fuel = fuel
            lastData.gear = gear
            lastData.rpm = rpm

            -- Send data to the HUD
            SendNUIMessage({
                type = 'updateVehicleHud',
                speed = speed,
                unit = Config.SpeedUnit,
                position = hudPosition,
                fuel = fuel,
                gear = gear,
                rpm = rpm,
                show = true
            })
        end
    end
end

-- Use an event to start the HUD loop when the player enters a vehicle
AddEventHandler('gameEventTriggered', function(name, args)
    if name == "CEventNetworkPlayerEnteredVehicle" then
        local vehicle = args[2]
        local ped = PlayerPedId()
        local isInVehicle = IsPedInAnyVehicle(ped, false) or IsPedInVehicle(ped, vehicle, false)
        startVehicleUI(isInVehicle)
    end
end)
