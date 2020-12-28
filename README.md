# EQ3-Radiator Thermostat
With this node you can control your Eqiva EQ3 Bluetooth Radiator Thermostat. It is based on https://github.com/Heckie75/eQ-3-radiator-thermostat and shares the same API.

## Installation and Prerequisites
Expect needs to be installed to use this node. Install it via 
```
sudo apt update && sudo apt install expect
```
After each battery insert you have to disable and re-enable bluetooth: Press left button (Mode Menu) for about 3 seconds. Turn control wheel until "bLE" is shown. Press it shortly, then "OFF" will appear, press the wheel shortly again. This disables Bluetooth. Re-Do these steps, but now "ON" will appear. Press the wheel shortly again. This turns on Bluetooth.

To get the MAC of your device use `sudo hcitool lescan` or an App like "nRF Connect". Devicename is "CC-RT-BLE".  

## Usage
Set `msg.payload` to the command you want to execute. E.g. `temp 20` to set target temperature to 20 °C. More in the node’s help tab. See full command reference under https://github.com/Heckie75/eQ-3-radiator-thermostat

## Longterm support
This node uses no npm dependencies. The only dependencies are expect and Heckie75/eQ-3-radiator-thermostat, which is included in this package. So its very likely that this node won’t receive an update for years. If you notice any kind of issue, feel free to open one on the Github project page.

## Changing bluetooth interface

In this updated version you can easily do it in the Node's settings and via msg.interface, see Node's help.

## License
GPLv3

