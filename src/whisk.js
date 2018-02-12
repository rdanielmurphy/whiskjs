"use strict";

import Component from "./component";

// Create global framework key
var whisk = {};

whisk.Component = Component;

whisk.mount = function (component, placeAt) {
    // Build component
    component.preRender();
    component.render();
    component.postCreate();

    // Add to DOM
    component.placeAt(placeAt);
};

window.whisk = whisk;

