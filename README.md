# EQ3-Radiator Thermostat: Controls Eqiva EQ-3 Bluetooth Radiator Thermostat
With this node you can control your Eqiva EQ-3 Bluetooth Radiator Thermostat. It is based on https://github.com/Heckie75/eQ-3-radiator-thermostat and shares the same API.

## Installation and Prerequisites
Expect needs to be installed to use this node. Install it via 
```
sudo apt update && sudo apt install expect
```
Depending on the firmware version pairing may be required. You'll find this information also in 

<p>There seem to be 3 different firmware versions regarding Bluetooth connectivity</p>
		<ol>
			<li> Oldest version. Bluetooth is ready after thermostat is setup. You can directly use it with this script. This version does not provide additional information like offset temperature by a simple sync request.</li>
			<li> After each battery insert you have to disable and re-enable bluetooth: Press left button (Mode Menu) for about 3 seconds. Turn control wheel until "bLE" is shown.
				 Press it shortly, then "OFF" will appear, press the wheel shortly again. This disables Bluetooth. Re-Do these steps, but now "ON" will appear. Press the wheel shortly again. This turns on Bluetooth.
			<li> Latest version installed in January 2021 by update via App. With integrated bluetooth of Raspberry Pi 4 and Zero W you have to pair before you can control them. To do so go to commandline:
<pre>
sudo bluetoothctl
scan on
&lt;wait until mac of new Eqiva EQ3 appears&gt;
scan off
pair &lt;MAC&gt;
&lt;Enter 6 digit number, getting by longpressing control wheel&gt;
disconnect &lt;MAC&gt;
</pre>
		Disconnecting is essential, otherwise bluetoothctl stays connected and you can't control the thermostat.
		<p>With an external USB Bluetooth Receiver it was still possible to control the thermostat without pairing. So there is a false sense of security with new firmware.</p>
		<p>With <code>unpair &lt;MAC&gt;</code> in bluetoothctl you can undo the pairing.</p>
			</ol>

To get the MAC of your device use `sudo hcitool lescan` or an App like "nRF Connect". Devicename is "CC-RT-BLE".  

## Usage
Set `msg.payload` to the command you want to execute. E.g. `temp 20` to set target temperature to 20 °C. More in the node’s help tab. See full command reference under https://github.com/Heckie75/eQ-3-radiator-thermostat

## Longterm support
This node uses no npm dependencies. The only dependencies are expect and Heckie75/eQ-3-radiator-thermostat, which is included in this package. So its very likely that this node won’t receive an update for years. If you notice any kind of issue, feel free to open one on the Github project page.

## Changing bluetooth interface

In this updated version you can easily do it in the Node's settings and via msg.interface, see Node's help.

## License
GPLv3

