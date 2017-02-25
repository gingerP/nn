'use strict';

const HiddenNeuron = require('./neurons/HiddenNeuron');
const InNeuron = require('./neurons/InNeuron');
const OutNeuron = require('./neurons/OutNeuron');
const NNUtils = require('./NNUtils');
const Promise = require('bluebird');

class NN {
    constructor(inboundLayerSize, hiddenLayersCount, hiddenLayerSize, outboundLayerSize) {
        this.inboundLayer = NNUtils.generateLayer(inboundLayerSize, InNeuron);
        this.outboundLayer = NNUtils.generateLayer(outboundLayerSize, OutNeuron);
        this.hiddenLayer = NNUtils.generateHiddenLayer(hiddenLayersCount, hiddenLayerSize, HiddenNeuron);
        this.removeListeners = function() {};

        NNUtils.linkLayers(this.inboundLayer, this.hiddenLayer, this.outboundLayer);
    }

    executePhase(phase) {
        Promise.each(phase, (phaseValue) => {
            return this.executeSet(
                [phaseValue[0]],
                [phaseValue[1]]
            );
        })
    }

    executeSet(inboundValues, outboundValues) {
        return new Promise((resolve) => {
            this.inboundLayer.forEach((neuron, index) => {
                neuron.setValue(inboundValues[index]);
            });
            this.removeListeners();
            this.removeListeners = NNUtils.listenOutboundNeurons(this.outboundLayer, (value) => {
                console.info('out value: ' + value);
                resolve();
            });
        });
    }

    correctWeight() {

    }
}

module.exports = NN;