"use strict";

import Stateable from "./stateable";
import Util from "./utils";
import Registry from "./registry";

function Component(params) {
    // Apply params
    for (var key in params) {
        this[key] = params;
    }

    this.repeats = {};
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
    function iterate(scope, children) {
        if (!children) {
            return;
        }

        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (scope._processChild(child)) {
                iterate(scope, child.children);
            }
        }
    }

    iterate(this, this.rootNode.children);

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
        el.addEventListener("keyup", function(e) {
            var state = {};
            state[model] = this.value;
            scope.setState(state);
        });
    }
    var repeat = el.getAttribute("wk-repeat");
    if (repeat) {
        repeat = "this." + repeat + "";
        var repeatInner = el.innerHTML;
        var repeatCopy = el.cloneNode(true);
        Util.genRandId(repeatCopy);
        this.repeats[repeatCopy.id] = repeatCopy;
        el.parentElement.setAttribute("wk-repeat-id", repeatCopy.id);

        var iterator = Util.replaceAllStateVars(repeat, this, true);
        for (let i of iterator) {
            var innerVal = Util.replaceAllStateVars(repeatInner, i);
            var newEl = Util.createElement(el.tagName);
            newEl.innerHTML = innerVal;
            el.parentElement.appendChild(newEl);
        }

        el.remove();
    }
}

// Return false if tag is a child component so we don't continue down DOM tree
Component.prototype._processTag = function(el) {
    var tagName = el.tagName;

    if (Registry.getComponent(tagName)) {
        var tagClass = Registry.getComponent(tagName);
        var comp = new tagClass();
        whisk.mount(comp, el);

        var id = el.getAttribute("wk-id");
        if (id) {
            this[id] = comp;
        }

        return false;
    } else {
        // TODO the rest
        // TODO we can do stuff with lists
        if (tagName === 'ul') {
            console.log("ul");
        }
    }

    return el.children.length > 0;
}

Component.prototype._setTagState = function(el) {
    // TODO: Don't set state for child component tags

    // handle value
    var wkValue = el.getAttribute("wk-value");
    if (wkValue) {
        var stringVal = Util.replaceAllStateVars(wkValue, this);

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

    // handle list
    var wkRepeat = el.getAttribute("wk-repeat-id");
    if (wkRepeat) {
        // TODO
    }
}

Component.prototype._processChild = function(child) {
    this._processAttrs(child);
    return this._processTag(child);
}

Component.prototype.setState = function(state) {
    Object.getPrototypeOf(Component.prototype).setState.call(this, state);

    function iterate(scope, children) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (!Registry.getComponent(child.tagName)) {
                scope._setTagState(child);

                if (child.children.length > 0) {
                    iterate(scope, child.children);
                }
            }
        }
    }

    iterate(this, this.rootNode.children);
}

export default Component;