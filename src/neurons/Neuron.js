'use strict';

const EventEmitter = require('events');
const NNUtils = require('./../NNUtils');

class Neuron extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(111);
        this.inbounds = [];
        this.arrivedValuesCount = 0;
    }

    registerInboundNeuron(neuron) {
        let inboundNeuron = {
            neuron: neuron,
            weight: NNUtils.getRandomWeight()
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



    calculate() {
        let value = 0;
        this.arrivedValuesCount = 0;
        this.inbounds.forEach((inbound) => {
            value += inbound.value * inbound.weight;
            delete inbound.value;
        });
        return NNUtils.normalizeValueHyperbolicTangent(value);
    }

    correctWeight(weightsDelta, learningRate) {
        this.inbounds.forEach((inbound) => {


        });
    }
}

module.exports = Neuron;