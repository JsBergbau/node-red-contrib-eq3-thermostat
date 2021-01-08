"use strict";

const execFileSync = require('child_process').execFileSync;
const execFile = require('child_process').execFile;


let eQ3Cmd = __dirname + "/Heckie75-eq3-radiator-thermostat/eq3.exp"; //maybe not working inside Node-RED "./Heckie75-eq3-radiator-thermostat/eq3.exp";
let expect = null;

function textToJson(text) {
	var res = {};
	//console.log("str", new String(text));
	text = text.replace(/^[\t ]*Temperature/m, "Target_temperature");
	text = text.replace(/^[\t ]*"temperature/m, "\"target_temperature");
	try {
		res = JSON.parse(text);

		return res;
	}
	catch (error) {

	}
	if (text.match(/\n?timer/i)) {
		return { timer: text }
	}
	var myRegex = /(^.*:)[ \t]+(-?[\w].*$)/gm;
	var match = myRegex.exec(text);

	while (match != null) {
		var key = match[1].replace(/ /g, "_").replace(":", "");
		var val = match[2].trim().split(" ");
		switch (key) {
			case "Vacation_until":
				val = val[0] + " " + val[1];
				break;
			case "Open_window_time":
				break;
			default:
				var intval = parseFloat(val);
				if (!isNaN(intval)) {
					val = intval;
				}
		}


		if (Array.isArray(val) && val.length == 1) //reduce array to normal value, if it contains only one object
		{
			val = val[0];
		}
		res[key] = val;
		match = myRegex.exec(text);
	}
	return res;
}

module.exports = function (RED) {

	function eq3thermostat(config) {
		RED.nodes.createNode(this, config);
		var node = this;

		let deviceMAC = config.mac;

		//console.log("config:",config);
		node.on('input', function (msg, send, done) {
			// For maximum backwards compatibility, check that send exists.
			// If this node is installed in Node-RED 0.x, it will need to
			// fallback to using `node.send`
			send = send || function () { node.send.apply(node, arguments) }
			done = done || function () { if (arguments.length > 0) node.error.apply(node, arguments) }

			if ("mac" in msg) {
				deviceMAC = msg.mac;
			}
			else if ("MAC" in msg) {
				deviceMAC = msg.MAC;
			}

			let blInterface = msg.interface || config.interface;

			if (! /^hci[0-9]+$/.test(blInterface)) {
				node.status({ fill: "red", shape: "dot", text: "Error Bluetooth Interface wrong format" });
				done("Please specifiy a correct Bluetooth Interface, \"" + blInterface + "\" is no valid bluetooth interface");
				return;
			}

			if (! /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/.test(deviceMAC)) {
				node.status({ fill: "red", shape: "dot", text: "Error: MAC not correct" });
				done("Please specifiy a correct MAC-Address");
				return;
			}

			//deviceMAC = deviceMAC.toUpperCase();

			node.status({ fill: "yellow", shape: "dot", text: "Connecting ..." });
			if (!expect) {
				try {
					expect = execFileSync("which", ["expect"], { encoding: "utf8" }).trim();
				}
				catch (error) {
					// node.error("Expect not found, please install via sudo apt install expect", msg);
					node.status({ fill: "red", shape: "dot", text: "Error: Expect not found" });
					done("Expect not found, please install via sudo apt install expect", msg);
					return;
				}
			}


			if (msg.payload == "status") {
				msg.payload = "json";
			}
			msg.payload = msg.payload.replace(/temperature/i, "temp");
			//console.log("exec: ",expect, eQ3Cmd, blInterface, deviceMAC, msg.payload);
			execFile(expect, [eQ3Cmd, blInterface, deviceMAC, msg.payload], { encoding: "utf8" }, function (error, stdout, stderr) {

				if (error) {
					console.log(error);
					node.status({ fill: "red", shape: "dot", text: "Error connecting to device ..." })
					let blInterfaces = execFileSync("hciconfig", { encoding: "utf8" }).trim();
					if (!blInterfaces.includes(blInterface)) {
						done("Error connecting to device, Interface " + blInterface + " not found", msg);
					}
					else {
						done("Error connecting to device: " + stdout, msg);
					}

				}
				else {
					msg.payload = textToJson(stdout);
					send(msg);
					node.status({ fill: "green", shape: "dot", text: "All operations finished." })
				}

				if (done) {
					done();
				}


			});
		});

		node.on('close', function () {
			//node.warn("closing");
		});
	}
	RED.nodes.registerType("Eqiva eQ-3", eq3thermostat);
}