'use strict';

const EventEmitter = require('events');

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

    calculate() {}
}

module.exports = Neuron;