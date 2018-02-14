"use strict";

function mount (component, placeAt) {
    // Build component
    component.preRender();
    component.render();
    component.postCreate();

    // Add to DOM
    component.placeAt(placeAt);
};

export default mount;
