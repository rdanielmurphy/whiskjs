var xml2js      = require('xml2js');
var jsdom       = require("jsdom");
const { JSDOM } = jsdom;

function fixTemplate(template) {
  return template.replace(/(\r\n|\n|\r)/gm,"").trim();
}
function generateScript(name, template, code) {
  var script = "var " + name + " = function(params) { whisk.Component.call(this, params); }\n";
  script += name + ".prototype = Object.create(whisk.Component.prototype);\n";
  script += name + ".prototype.getTemplate = function(){\n return '" + fixTemplate(template) + "';}\n";
  script += name + ".prototype.getCode = function(){ " + code + "}\n";
  script += "module.exports = " + name + ";\n";
  
  return script;
}

function codeGenerationLoader(input) {
  const dom = new JSDOM(input);
  var template = "<div>" + dom.window.document.querySelector("template").innerHTML.trim() + "</div>";
  var code = dom.window.document.querySelector("script").textContent;
  var name = dom.window.document.querySelector("name").textContent;

  var script = generateScript(name, template, code);
  console.log(script);

  return script;
}

module.exports.default = codeGenerationLoader;