import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
let currentProgram = null;
let InitialConnectedToAPI = false;

let API_endpoint = "adk-api.replit.app";
function reconnectToExecApi(isManual) {
	if (
		window.AARDVARK_API_WEBSOCKET &&
		window.AARDVARK_API_WEBSOCKET.readyState === 1
	)
		window.AARDVARK_API_WEBSOCKET.close();

	window.AARDVARK_API_WEBSOCKET = new WebSocket(`wss://${API_endpoint}`);
	window.AARDVARK_API_WEBSOCKET.addEventListener("message", (ev) => {
		const data = JSON.parse(ev.data);

		if (typeof data.output === "string") {
			terminal.write(data.output);
		}

		if (typeof data.state === "number") {
			if (data.state === 2) {
				currentProgram = "adk";
			} else if (currentProgram === "adk") {
				currentProgram = null;
			}

			if (data.state === 0) {
				if (InitialConnectedToAPI) clearLine(false);
				InitialConnectedToAPI = true;
			}
		}
	});

	window.AARDVARK_API_WEBSOCKET.addEventListener("open", () => {
		if (isManual) terminal.write("Connected to the code execution api.\r\n");
	});

	window.AARDVARK_API_WEBSOCKET.addEventListener("close", () => {
		window.alert(
			"Lost connection to the code execution api. (or didn't even connect)"
		);
	});
}
function checkCodeExecLocalStatus() {
	const status =
		window.AARDVARK_API_WEBSOCKET &&
		window.AARDVARK_API_WEBSOCKET.readyState === 1;

	window.alert(`You are${!status ? " not" : ""} connected to the api.`);
}
class CodeBlock {
	constructor(code) {
		this.code = code;
	}
}
var terminal;
window.addEventListener("load", () => {
	reconnectToExecApi(true);
	terminal = new Terminal({
		fontFamily: "Monospace",
		theme: {
			background: "#1d1d1d",
		},
		fontSize: 14,
		cursorBlink: true,
		cursorStyle: "bar",
		cursorInactiveStyle: "none",
		cursorWidth: 2,
	});
	const termEl = document.getElementById("terminal");
	const fit = new FitAddon();
	terminal.loadAddon(fit);
	terminal.open(termEl);
	fit.fit();
	let modifiers = {
		shift: false,
		ctrl: false,
		alt: false,
		meta: false,
	};
	const isMac = navigator.userAgent.includes("Mac");
	terminal.onData((data) => {
		let code = data.charCodeAt();
		if (currentProgram === "adk")
			return AARDVARK_API_WEBSOCKET.send(JSON.stringify({ input: data }));
		else if (data === "\r") return terminal.write("\r\n");
		else if (data === "\n") return terminal.write("\r\n");
		else if (
			(code === 127) &
			((isMac & modifiers.meta) | (!isMac & modifiers.ctrl))
		)
			return terminal.write("\x1b[2K\r");
		if (code === 127) {
			return terminal.write("\b \b");
		}
		if (data === "e") {
			console.log("DOING IT");
			window.AARDVARK_API_WEBSOCKET.send(
				JSON.stringify({
					runProgram: {
						files: {
							"main.adk": "let x = 5",
						},
						args: [],
						silenced: false,
					},
				})
			);
		}
		terminal.write(data);
	});
	window.addEventListener("keydown", (e) => {
		if (e.key === "Shift") modifiers.shift = true;
		if (e.key === "Control") modifiers.ctrl = true;
		if (e.key === "Alt") modifiers.alt = true;
		if (e.key === "Meta") modifiers.meta = true;
	});
	let keyup = (e) => {
		if (e.key === "Shift") modifiers.shift = false;
		if (e.key === "Control") modifiers.ctrl = false;
		if (e.key === "Alt") modifiers.alt = false;
		if (e.key === "Meta") modifiers.meta = false;
	};

	window.addEventListener("keyup", keyup);
	window.addEventListener("blur", keyup);
	currentProgram = "adk";
});
