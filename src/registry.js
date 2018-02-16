"use strict";

const registry = Object.assign({}, {
    _components : {},
    register : function(component) {
        if (!this._components[component.name.toUpperCase()]) {
            this._components[component.name.toUpperCase()] = component;
        }
    },
    getComponent : function(key) {
        return this._components[key];
    }
});

export default registry;
