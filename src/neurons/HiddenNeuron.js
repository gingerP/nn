'use strict';

const Neuron = require('./Neuron');
const NNUtils = require('./../NNUtils');

class HiddenNeuron extends Neuron {
    constructor() {
        super();
    }

    collectInbound(value, inboundNeuron) {
        if (!inboundNeuron.hasOwnProperty('value')) {
            this.arrivedValuesCount++;
        }
        inboundNeuron.value = value;
    }

}

module.exports = HiddenNeuron;