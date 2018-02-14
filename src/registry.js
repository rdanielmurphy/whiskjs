"use strict";

const registry = Object.assign({}, {
    _components : {},
    register : function(component) {
        if (!this._components[component.name]) {
            this._components[component.name] = component;
        }
    }
});

export default registry;
