TokenTypes = [
	"String",
	"Number",
	"Keyword",
	"Operator",
	"Identifier",
	"Delimiter",
	"Indent",
	"Comment",
	"LineBreak",
	"Boolean",
];
Booleans = ["true", "false"];
PureOperators = [
	"=", // equals
	"!", // not,
	"~", // about
	"<", // less than
	">", // more than
	"==", // equals
	"<=", // less than or equal to
	">=", // more than or equal to
	"!=", // not equal to
	"~=", // about equal to
	"&", // and
	"|", // or
	"x|", // xor(exculsive or)
	"+", // add
	"-", // subtract
	"/", // divide
	"*", // multiplication
	"^", // exponet
	"%", // mod
	"@", // at.reference
	"?", // x.y ? will be null if x.y doesn't exist or if it is null
	"->", // Return Type,
	"not", // not
	"and", // and
	"or", // or
	"xor", // xor
	"in", // in
	"++",
	"--",
	"$=",
	"...",
];

Operators = PureOperators.concat(["not", "and", "or", "xor", "in"]);
OrderOfOps = {
	0: ["?"],
	1: ["~", "!", "@", "..."],
	2: ["^"],
	3: ["*", "/"],
	4: ["-"],
	5: ["-", "+", "%"],
	6: ["++", "--", "=", "+=", "-=", "*=", "/=", "^=", "%="],
	7: ["~=", "<", ">", "<=", ">=", "!=", "in", "==", "$="],
	8: ["&", "|", "x|", "and", "or", "xor", "->"],
};

Quotes = ['"', "'", "`"];

Whitespaces = [
	" ",
	"\t",
	"​",
	" ",
	" ",
	" ",
	" ",
	" ",
	" ",
	" ",
	" ",
	" ",
	"⠀",
];

Delimiters = [":", "(", ")", ",", "{", "}", "[", "]", "."];

Keywords = [
	"class",
	"extends",
	// 'type',
	"extending",
	"function",
	"for",
	"while",
	"match",
	"case",
	"if",
	"else",
	"return",
	"static",
	"include",
	"await",
	"pause-until",
	"yield",
	"let",
	"as",
	"from",
	"defer",
	"layout",
	"break",
	"continue",
	"private",
	"set",
	"get",
	"macro",
];

class Token {
	constructor(type, start, end, line, value = null, variation = null) {
		this.type = type;
		this.start = start;
		this.end = end;
		this.line = line;
		this.value = value;
		this.variation = variation;
		this.length = end - start;
	}
}

class Lexer {
	constructor(
		singleline = "#",
		multilineStart = "#*",
		multilineEnd = "*#",
		comments = False
	) {
		this.singleline = singleline;
		this.multilineStart = multilineStart;
		this.multilineEnd = multilineEnd;
		this.doComments = comments;
		this.data = "";
		this.output = [];
		this.line = 1;
		this.column = 1;
		this.index = 0;
		this.empty = true;
		this.AtEnd = false;
		this.curChar = "";
	}
	isWhitespace(char) {
		return Whitespaces.includes(char || this.curChar);
	}
	isNewline(char) {
		return [";", "\n"].includes(char || this.curChar);
	}
	isQuote(char) {
		return Quotes.includes(char || this.curChar);
	}
	isDelimiter(char) {
		return Delimiters.includes(char || this.curChar);
	}
	isNumber(char) {
		return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
			char || this.curChar
		);
	}
	detect(text) {
		if (this.curChar === text[0]) {
			for (let i = 0; i < text.length - 1; i++)
				if (!(this.peek(i + 1) === text[i + 1])) return false;
		} else return false;
		return true;
	}
	addToken(...args) {
		this.output.push(new Token(...args));
		this.empty = false;
	}
	otherwise(char) {
		char = char || this.curChar;
		return !(
			this.isWhitespace(char) ||
			this.isNewline(char) ||
			this.isQuote(char) ||
			this.isDelimiter(char) ||
			this.isNumber(char) ||
			PureOperators.includes(char) ||
			char === this.comment
		);
	}
	newline() {
		this.line++;
		this.empty = true;
		this.column = 1;
	}
	advance(amt = 1) {
		this.index += amt;
		this.column += amt;
		if (this.index < this.data.length) this.curChar = this.data[this.index];
		else this.AtEnd = true;
	}
	peek(amt = 1) {
		if (this.index + amt < this.data.length) return this.data[this.index + amt];
		else return null;
	}
	tokenize(data) {
		if (data === "") return this.output;
		this.data += data;
		this.curChar = this.data[this.index];
		while (this.index < this.data.length) {
			//Newlines
			if (this.isNewline()) {
				this.addToken(
					"LineBreak",
					this.index,
					this.index,
					this.line,
					this.curChar,
					this.curChar
				);
				if (this.curChar === "\n") this.newline();
				else this.empty = true;
			}
			//Delimiters
			else if (this.isDelimiter()) {
				this.addToken(
					"Delimiter",
					this.index,
					this.index,
					this.line,
					this.curChar
				);
			}
			//numbers
			else if (this.isNumber()) {
				let start = this.index;
				let value = "";
				let seen_dot = false;
				while ((this.isNumber() || this.curChar === ".") && !this.AtEnd) {
					if (seen_dot && this.curChar === ".")
						throw `Invalid syntax, floats can only have one . ${seen_dot}`;
					else if (this.curChar === ".") seen_dot = true;
					value += this.curChar;
					this.advance();
				}
				this.advance(-1);
				this.addToken("Number", start, this.index, this.line, value);
			}

			//Multi-line comments
			else if (this.detect(this.multilineStart)) {
				let value = "";
				let start = this.index;
				while (!(this.detect(this.multilineEnd) || this.AtEnd)) {
					value += this.curChar;
					this.advance();
				}
				let wasAtEnd = this.AtEnd;
				this.advance(this.multilineEnd.length);
				if (this.doComments)
					this.addToken(
						"Comment",
						start,
						this.index,
						this.line,
						value + (wasAtEnd ? "" : this.multilineEnd)
					);
				continue;
			}

			//Single line comments
			else if (this.detect(this.singleline)) {
				let value = "";
				let start = this.index;
				while (!(this.isNewline() || this.AtEnd)) {
					value += this.curChar;
					this.advance();
				}
				if (this.doComments)
					this.addToken("Comment", start, this.index, this.line, value);
				this.advance(-1);
			}

			//Strings
			else if (this.isQuote()) {
				let variation = this.curChar;
				let value = "";
				let start = this.index;
				while (!this.AtEnd) {
					this.advance();
					if (
						(this.curChar === variation &&
							(value.length === 0 || value[value.length - 1] != "\\")) ||
						this.AtEnd
					)
						break;
					value += this.curChar;
				}
				this.addToken("String", start, this.index, this.line, value, variation);
			}
			//Operators
			else if (PureOperators.includes(this.curChar)) {
				let value = "";
				let start = this.index;

				while (!this.AtEnd && Operators.includes(value + this.curChar)) {
					value += this.curChar;
					this.advance();
				}
				this.advance(-1);
				this.addToken("Operator", start, this.index, this.line, value);
			}

			//Identifiers, Keywords, and Operators
			else if (this.otherwise()) {
				let value = "";
				let start = this.index;
				while ((this.otherwise() || this.isNumber()) && !this.AtEnd) {
					value += this.curChar;
					this.advance();
				}
				let type;
				if (Operators.includes(value)) type = "Operator";
				else if (Keywords.includes(value)) type = "Keyword";
				else type = "Identifier";
				this.advance(-1);
				this.addToken(type, start, this.index, this.line, value);
			}

			if (this.AtEnd) break;
			this.advance();
		}
		return this.output;
	}
}

let styles = {
	String: "color: rgb(152, 195, 121);",
	Function: "color: rgb(97, 175, 239);",
	Number: "color: rgb(229, 192, 123);",
	Keyword: "color: rgb(224, 108, 117);",
	Operator: "color: rgb(86, 182, 194);font-weight: bold;",
	Boolean: "color: rgb(229, 192, 123);",
	Comment: "color: rgb(101, 109, 123);font-style: italic;",
	Delimiter: "color: rgb(245, 245, 255);",
	default: "color: rgb(203, 212, 227);",
	suggestion: "color: rgb(255, 165, 0);",
	none: "",
};
function Style(style, code) {
	//console.log(style, code)
	let span = document.createElement("span");
	span.style = styles[style];
	span.innerText = code;
	return span.outerHTML;
}
function Highlight(code, opts = {}) {
	let lexer = new Lexer("#", "#*", "*#", true);
	lexer.tokenize(code);
	line = opts["startline"] || 1;
	output = "";
	toknum = 0;
	last = 0;
	for (let token of lexer.output) {
		if (token.start > last + 1) {
			output += Style("default", code.slice(last + 1, token.start));
		}
		if (token.type === "String") {
			output += Style(
				"String",
				token.variation + token.value + token.variation
			);
		} else if (token.value === "\n") {
			line++;
			output += "<br/>";
		} else if (
			token.type === "Identifier" &&
			toknum < lexer.output.length - 1 &&
			lexer.output[toknum + 1].value === "("
		) {
			output += Style("Function", token.value);
		} else if (token.type in styles) {
			output += Style(token.type, token.value);
		} else {
			output += Style("default", token.value);
		}
		toknum += 1;
		last = token.end;
	}
	return output;
}
function HighlightAll() {
	tags = [
		"code h1",
		"code h2",
		"code h3",
		"code h4",
		"code h5",
		"code h6",
		"pre code",
	];
	for (let tag of tags)
		for (let elem of document.querySelectorAll(tag)) {
			if (elem.hasAttribute("noh")) continue;
			if (elem.classList.contains("highlighted")) continue;
			let code = elem.innerText;
			let output = Highlight(code);
			elem.innerHTML = output;
			elem.classList.add("highlighted");
		}
	for (let elem of document.querySelectorAll("code")) {
		if (elem.hasAttribute("noh")) continue;
		if (elem.children.length > 0) continue;
		if (elem.classList.contains("highlighted")) continue;
		let code = elem.innerText;
		//Breaks on builtins.html:
		let output = Highlight(code);
		elem.innerHTML = output;
		elem.classList.add("highlighted");
	}
}
// window.onload = HighlightAll;
// testtext = `
// #Hello World
// test
// #* This is a comment *#if x == 0 stdout.write("Hello World");
// ~5.432345
// `;
// console.log(Highlight(testtext));
