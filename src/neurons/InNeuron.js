'use strict';

const Neuron = require('./Neuron');

class InNeuron extends Neuron {
    constructor() {
        super();
    }

    setValue(value) {
        this.emit('inbound', value);
    }
}

module.exports = InNeuron;