'use strict';

const EventEmitter = require('events');
const NNUtils = require('./../NNUtils');
const Promise = require('bluebird');

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
        if (!inboundNeuron.isValueUpdated) {
            this.arrivedValuesCount++;
        }
        inboundNeuron.value = value;
        inboundNeuron.isValueUpdated = true;

    }

    calculate() {
        let value = 0;
        this.arrivedValuesCount = 0;
        this.inbounds.forEach((inbound) => {
            value += inbound.value * inbound.weight;
        });
        return NNUtils.normalizeValueHyperbolicTangent(value);
    }

    correctWeight(weightsDelta, learningRate) {
        return Promise.each(this.inbounds, (inbound) => {
            inbound.isValueUpdated = false;
            let newWeightsDelta = NNUtils.calculateWeightDelta(inbound.value, weightsDelta, learningRate);
            delete inbound.value;

            inbound.weight -= newWeightsDelta;
            return inbound.neuron.correctWeight(newWeightsDelta, learningRate);
        });
    }
}

module.exports = Neuron;