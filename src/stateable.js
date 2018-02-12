"use strict";

function Stateable() {
}

Stateable.prototype.setState = function(state) {
    if (this.state) {
        for (var key in state) {
            this.state[key] = state[key];
        }
    } else {
        this.state = state;
    }
}

Stateable.prototype.getState = function(state) {
    return this.state;
}

module.exports = Stateable;