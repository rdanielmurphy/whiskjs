"use strict";

function configure(comp) {
    if (comp.prototype instanceof whisk.Component) {
        whisk.registry.register(comp);
    }
};

export default configure;
