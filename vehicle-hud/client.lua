-- Created function to start the HUD loop
local function startVehicleUI(isInVehicle)
    while isInVehicle do
        Wait(100) -- Uptade hud status 100ms steel smooth and less cpu usage

        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)
        if not vehicle or not DoesEntityExist(vehicle) then
            SendNUIMessage({
                type = 'updateVehicleHud',
                show = false
            })
            break -- Exit if there is no vehicle (Stops de loop and hide the HUD)
        end

        -- Get actual speed in km/h better rounding
        local speed = math.floor(GetEntitySpeed(vehicle) * 3.6)

        -- Get fuel level better rounding
        local fuel = math.floor(GetVehicleFuelLevel(vehicle))

        -- Get current gear
        local gear = GetVehicleCurrentGear(vehicle)

        -- Get RPM of the vehicle (0 - 1)
        local rpm = GetVehicleCurrentRpm(vehicle)

        -- Send data to the HUD
        SendNUIMessage({
            type = 'updateVehicleHud',
            speed = speed,
            fuel = fuel,
            gear = gear,
            rpm = rpm,
            show = true
        })
    end
end

-- Use an event to start the HUD loop when the player enters a vehicle if the player isnt in a vehicle not looping all time
AddEventHandler('gameEventTriggered', function(name, args)
    if name == "CEventNetworkPlayerEnteredVehicle" then
        local vehicle = args[2]
        local ped = PlayerPedId()
        local isInVehicle = IsPedInAnyVehicle(ped, false) or IsPedInVehicle(ped, vehicle, false)
        startVehicleUI(isInVehicle)
    end
end)
