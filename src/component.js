"use strict";

import Stateable from "./stateable";
import Util from "./utils";

function Component(params) {
    // Apply params
    for (var key in params) {
        this[key] = params;
    }
}

Component.prototype  = Object.create(Stateable.prototype);

Component.prototype.preRender = function() {
    // Run code
    this.getCode();
}

Component.prototype.render = function() {
    // Process template
    this.rootNode = document.createElement("div");
    //this.rootNode = new DOMParser().parseFromString(this.getTemplate(), 'text/html');
    this.rootNode.innerHTML = this.getTemplate();

    // Iterate over all children of component
    var children = this._getChildren();
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      this._processAttrs(child);
    }

    if (this.onRender) {
        this.onRender();
    }
}

Component.prototype.postCreate = function() {
    if (this.onPostCreate) {
        this.onPostCreate();
    }
}

Component.prototype.placeAt = function(placeAt) {
    if (typeof placeAt === 'string' || placeAt instanceof String) {
        var placeAt = document.getElementById(placeAt);
    }
    placeAt.appendChild(this.rootNode);
}

Component.prototype.placeAt = function(placeAt) {
    if (typeof placeAt === 'string' || placeAt instanceof String) {
        var placeAt = document.getElementById(placeAt);
    }
    placeAt.appendChild(this.rootNode);
}

Component.prototype._getChildren = function() {
    return this.rootNode.getElementsByTagName('*');
}

Component.prototype._processAttrs = function(el) {
    var scope = this;

    var id = el.getAttribute("wk-id");
    if (id) {
        this[id] = el;
    }
    var click = el.getAttribute("wk-click");
    if (click) {
        el.addEventListener("click", function(e) {
            scope[click](e);
        });
    }
    var model = el.getAttribute("wk-model");
    if (model && el.tagName === 'INPUT') {
        el.addEventListener("change", function(e) {
            var state = {};
            state[model] = this.value;
            scope.setState(state);
        });
    }
}

Component.prototype._setTagState = function(el) {
    var wkValue = el.getAttribute("wk-value");
    if (wkValue) {
        var stringVal = Util.replaceAllStateVars(wkValue, this.state);

        // set values
        if (el.tagName === 'P' || el.tagName === 'BUTTON') {
            el.innerHTML = stringVal;
        }
    }

    // handle model
    var wkModel = el.getAttribute("wk-model");
    if (wkModel) {
        var stringVal = this.state[wkModel];

        // set values
        if (el.tagName === 'INPUT') {
            el.value = stringVal;
        }
    }
}

Component.prototype.setState = function(state) {
    Object.getPrototypeOf(Component.prototype).setState.call(this, state);

    var children = this._getChildren();
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      this._setTagState(child);
    }
}

export default Component;