"use strict";

import Component from "./component";
import Mount from "./mount";
import Configure from "./configure";
import Registry from "./registry";

// Create global framework key
var whisk = {};

whisk.Component = Component;
whisk.mount = Mount;
whisk.configure = Configure;
whisk.registry = Registry;

window.whisk = whisk;

