var xml2js = require('xml2js');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;

function fixTemplate(template) {
  return template.replace(/(\r\n|\n|\r)/gm, "").trim();
}
function generateScript(p) {
  var script = "";
  if (p.imports) {
    script += p.imports.trim() + "\n";
  }
  script += "var " + p.name + " = function(params) { whisk.Component.call(this, params); }\n";
  script += p.name + ".prototype = Object.create(whisk.Component.prototype);\n";
  script += p.name + ".prototype.getTemplate = function(){\n return '" + fixTemplate(p.template) + "';}\n";
  script += p.name + ".prototype.getCode = function(){ " + p.code + "}\n";
  script += "\nwhisk.configure(" + p.name + ");\n";
  script += "export default " + p.name + ";\n";

  return script;
}

function getTagContents(tag, dom, type) {
  var el = dom.window.document.querySelector(tag);
  
  return el ? el[type] : null;
}

function codeGenerationLoader(input) {
  const dom = new JSDOM(input);
  var template = "<div>" + getTagContents("template", dom, "innerHTML").trim() + "</div>";
  var code = getTagContents("script", dom, "textContent");
  var name = getTagContents("name", dom, "textContent");
  var imports = getTagContents("imports", dom, "textContent");

  var script = generateScript({
    name: name, template: template, code: code, imports: imports
  });

  console.log(script);
  return script;
}

module.exports.default = codeGenerationLoader;