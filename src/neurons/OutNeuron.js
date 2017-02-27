'use strict';

const Neuron = require('./Neuron');
const NNUtils = require('./../NNUtils');

class OutNeuron extends Neuron {
    constructor() {
        super();
    }

    registerInboundNeuron(neuron) {
        let inboundNeuron = {
            neuron: neuron,
            weight: NNUtils.getRandomWeight(),
            isValueUpdated: false,
            value: null
        };
        this.inbounds.push(inboundNeuron);
        neuron.addListener('inbound', (value) => {
            process.nextTick(() => {
                this.collectInbound(value, inboundNeuron);
                if (this.arrivedValuesCount === this.inbounds.length) {
                    let value = this.calculate();
                    this.emit('inbound', value);
                }
            });
        });
    }

    collectInbound(value, inboundNeuron) {
        if (!inboundNeuron.hasOwnProperty('value')) {
            this.arrivedValuesCount++;
        }
        inboundNeuron.value = value;
    }
}

module.exports = OutNeuron;