import { Highlight } from "./highlight.js";
let exampleCodeElement = document.querySelector(".example-code");
let exampleListElement = document.querySelector(".example-list");
let examples = [];

class Example {
	constructor(name, code) {
		this.name = name;
		this.code = code.trim(" \n");
		this.element = null;
		examples.push(this);
	}
}
new Example(
	"HTTP Server",
	`
include webr

let server = webr.Server(protocols=[webr.protocol.HTTP])

sever.route("/", function handler(request) {
    return "Hello, World!"
})
server.listen("localhost", 8000)

#*
Hello
Hi*#
`
);
new Example(
	"GUI App",
	`
include {px, inch, cm} from units.length
include AdkUI

let document = AdkUI.document()
let window = AdkUI.window(document).initialize()

let box = document.Element({
  width: 200px,
  height: 200px
})
box.text = "Hello, World!"
`
);

function initExamples() {
	for (let example of examples) {
		let exampleElement = document.createElement("div");
		exampleElement.classList.add("example");
		exampleElement.textContent = example.name;
		exampleListElement.appendChild(exampleElement);
		example.element = exampleElement;

		exampleElement.addEventListener("click", function () {
			for (let example of examples) {
				example.element.classList.remove("selected");
			}
			exampleElement.classList.add("selected");
			exampleCodeElement.innerHTML = Highlight(example.code);
		});
	}
	exampleCodeElement.innerHTML = Highlight(examples[0].code);

	examples[0].element.classList.add("selected");
}

initExamples();
