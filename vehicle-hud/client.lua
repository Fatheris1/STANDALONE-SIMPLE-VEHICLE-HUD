ESX = exports["es_extended"]:getSharedObject()

-- Update HUD
local isInVehicle = false

Citizen.CreateThread(function()
    while true do
        local ped = PlayerPedId()
        
        if IsPedInAnyVehicle(ped, false) then
            if not isInVehicle then
                isInVehicle = true
            end
            
            -- Get vehicle data
            local vehicle = GetVehiclePedIsIn(ped, false)
            local speed = GetEntitySpeed(vehicle) * 3.6 -- Convert to km/h
            local fuel = GetVehicleFuelLevel(vehicle)
            
            -- Get current gear
            local gear = GetVehicleCurrentGear(vehicle)
            if gear == 0 and speed > 0 then
                gear = 'R'
            elseif gear == 0 then
                gear = 'N'
            end
            
            -- Get RPM (0.0 to 1.0)
            local rpm = GetVehicleCurrentRpm(vehicle)
            
            -- Send all data to UI
            SendNUIMessage({
                type = 'updateVehicleHud',
                show = true,
                speed = speed,
                fuel = fuel,
                gear = gear,
                rpm = rpm
            })
        else
            if isInVehicle then
                isInVehicle = false
                SendNUIMessage({
                    type = 'updateVehicleHud',
                    show = false
                })
            end
        end
        
        Citizen.Wait(50) -- Update 20 times per second for smoother RPM
    end
end)
