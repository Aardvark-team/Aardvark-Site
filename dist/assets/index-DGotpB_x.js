import"./modulepreload-polyfill-B5Qt9EMX.js";let o=["=","!","~","<",">","==","<=",">=","!=","~=","&","|","x|","+","-","/","*","^","%","@","?","->","not","and","or","xor","in","++","--","$=","..."],u=o.concat(["not","and","or","xor","in"]),p=['"',"'","`"],x=[" ","	","​"," "," "," "," "," "," "," "," "," ","⠀"],v=[":","(",")",",","{","}","[","]","."],w=["class","extends","extending","function","for","while","match","case","if","else","return","static","include","await","pause-until","yield","let","as","from","defer","layout","break","continue","private","set","get","macro"];class C{constructor(e,t,i,s,r=null,n=null){this.type=e,this.start=t,this.end=i,this.line=s,this.value=r,this.variation=n,this.length=i-t}}class g{constructor(e="#",t="#*",i="*#",s=False){this.singleline=e,this.multilineStart=t,this.multilineEnd=i,this.doComments=s,this.data="",this.output=[],this.line=1,this.column=1,this.index=0,this.empty=!0,this.AtEnd=!1,this.curChar=""}isWhitespace(e){return x.includes(e||this.curChar)}isNewline(e){return[";",`
`].includes(e||this.curChar)}isQuote(e){return p.includes(e||this.curChar)}isDelimiter(e){return v.includes(e||this.curChar)}isNumber(e){return["0","1","2","3","4","5","6","7","8","9"].includes(e||this.curChar)}detect(e){if(this.curChar===e[0]){for(let t=0;t<e.length-1;t++)if(this.peek(t+1)!==e[t+1])return!1}else return!1;return!0}addToken(...e){this.output.push(new C(...e)),this.empty=!1}otherwise(e){return e=e||this.curChar,!(this.isWhitespace(e)||this.isNewline(e)||this.isQuote(e)||this.isDelimiter(e)||this.isNumber(e)||o.includes(e)||e===this.comment)}newline(){this.line++,this.empty=!0,this.column=1}advance(e=1){this.index+=e,this.column+=e,this.index<this.data.length?this.curChar=this.data[this.index]:this.AtEnd=!0}peek(e=1){return this.index+e<this.data.length?this.data[this.index+e]:null}tokenize(e){if(e==="")return this.output;for(this.data+=e,this.curChar=this.data[this.index];this.index<this.data.length;){if(this.isNewline())this.addToken("LineBreak",this.index,this.index,this.line,this.curChar,this.curChar),this.curChar===`
`?this.newline():this.empty=!0;else if(this.isDelimiter())this.addToken("Delimiter",this.index,this.index,this.line,this.curChar);else if(this.isNumber()){let t=this.index,i="",s=!1;for(;(this.isNumber()||this.curChar===".")&&!this.AtEnd;){if(s&&this.curChar===".")throw`Invalid syntax, floats can only have one . ${s}`;this.curChar==="."&&(s=!0),i+=this.curChar,this.advance()}this.advance(-1),this.addToken("Number",t,this.index,this.line,i)}else if(this.detect(this.multilineStart)){let t="",i=this.index;for(;!(this.detect(this.multilineEnd)||this.AtEnd);)t+=this.curChar,this.advance();let s=this.AtEnd;this.advance(this.multilineEnd.length),this.doComments&&this.addToken("Comment",i,this.index,this.line,t+(s?"":this.multilineEnd));continue}else if(this.detect(this.singleline)){let t="",i=this.index;for(;!(this.isNewline()||this.AtEnd);)t+=this.curChar,this.advance();this.doComments&&this.addToken("Comment",i,this.index,this.line,t),this.advance(-1)}else if(this.isQuote()){let t=this.curChar,i="",s=this.index;for(;!this.AtEnd&&(this.advance(),!(this.curChar===t&&(i.length===0||i[i.length-1]!="\\")||this.AtEnd));)i+=this.curChar;this.addToken("String",s,this.index,this.line,i,t)}else if(o.includes(this.curChar)){let t="",i=this.index;for(;!this.AtEnd&&u.includes(t+this.curChar);)t+=this.curChar,this.advance();this.advance(-1),this.addToken("Operator",i,this.index,this.line,t)}else if(this.otherwise()){let t="",i=this.index;for(;(this.otherwise()||this.isNumber())&&!this.AtEnd;)t+=this.curChar,this.advance();let s;u.includes(t)?s="Operator":w.includes(t)?s="Keyword":s="Identifier",this.advance(-1),this.addToken(s,i,this.index,this.line,t)}if(this.AtEnd)break;this.advance()}return this.output}}let m={String:"color: rgb(152, 195, 121);",Function:"color: rgb(97, 175, 239);",Number:"color: rgb(229, 192, 123);",Keyword:"color: rgb(224, 108, 117);",Operator:"color: rgb(86, 182, 194);font-weight: bold;",Boolean:"color: rgb(229, 192, 123);",Comment:"color: rgb(101, 109, 123);font-style: italic;",Delimiter:"color: rgb(245, 245, 255);",default:"color: rgb(203, 212, 227);",suggestion:"color: rgb(255, 165, 0);",none:""};function h(l,e){let t=document.createElement("span");return t.style=m[l],t.innerText=e,t.outerHTML}function d(l,e={}){let t=new g("#","#*","*#",!0);t.tokenize(l),e.startline;let i="",s=0,r=0;for(let n of t.output)n.start>r+1&&(i+=h("default",l.slice(r+1,n.start))),n.type==="String"?i+=h("String",n.variation+n.value+n.variation):n.value===`
`?i+="<br/>":n.type==="Identifier"&&s<t.output.length-1&&t.output[s+1].value==="("?i+=h("Function",n.value):n.type in m?i+=h(n.type,n.value):i+=h("default",n.value),s+=1,r=n.end;return i}let c=document.querySelector(".example-code"),b=document.querySelector(".example-list"),a=[];class f{constructor(e,t){this.name=e,this.code=t.trim(` 
`),this.element=null,a.push(this)}}new f("HTTP Server",`
include webr

let server = webr.Server(protocols=[webr.protocol.HTTP])

sever.route("/", function handler(request) {
    return "Hello, World!"
})
server.listen("localhost", 8000)

#*
Hello
Hi*#
`);new f("GUI App",`
include {px, inch, cm} from units.length
include AdkUI

let document = AdkUI.document()
let window = AdkUI.window(document).initialize()

let box = document.Element({
  width: 200px,
  height: 200px
})
box.text = "Hello, World!"
`);function E(){for(let l of a){let e=document.createElement("div");e.classList.add("example"),e.textContent=l.name,b.appendChild(e),l.element=e,e.addEventListener("click",function(){for(let t of a)t.element.classList.remove("selected");e.classList.add("selected"),c.innerHTML=d(l.code)})}c.innerHTML=d(a[0].code),a[0].element.classList.add("selected")}E();
