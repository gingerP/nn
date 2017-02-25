'use strict';

const Neuron = require('./Neuron');

class HiddenNeuron extends Neuron {
    constructor() {
        super();
    }

    registerInboundNeuron(neuron) {
        let inboundNeuron = {
            neuron: neuron,
            weight: Math.random()
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



            value += inbound.value;



            delete inbound.value;
        });
        return value;
    }
}

module.exports = HiddenNeuron;