'use strict';

const HiddenNeuron = require('./neurons/HiddenNeuron');
const InNeuron = require('./neurons/InNeuron');
const OutNeuron = require('./neurons/OutNeuron');
const NNUtils = require('./NNUtils');
const Promise = require('bluebird');

class NN {
    constructor(inboundLayerSize, hiddenLayersCount, hiddenLayerSize, outboundLayerSize, learningRate) {
        this.learningRate = 0.07;
        this.inboundLayer = NNUtils.generateLayer(inboundLayerSize, InNeuron);
        this.outboundLayer = NNUtils.generateLayer(outboundLayerSize, OutNeuron);
        this.hiddenLayer = NNUtils.generateHiddenLayer(hiddenLayersCount, hiddenLayerSize, HiddenNeuron);
        this.removeListeners = function () {
        };

        NNUtils.linkLayers(this.inboundLayer, this.hiddenLayer, this.outboundLayer);
    }

    executePhase(phase) {
        let results = [];
        console.time('time');
        return Promise.each(
            phase,
            (phaseValue) => {
                return this.executeSet(
                    [phaseValue[0]],
                    [phaseValue[1]]
                ).then((outboundResult) => {
                    outboundResult.error = this.calculateError(outboundResult);
                    return outboundResult;//this.correctWeight(outboundResult).return(outboundResult);
                }).then(
                    outboundResult => this.correctWeight(outboundResult)
                ).then((value) => {
                    results.push(value);
                    return value;
                });
            }
        );
    }

    executeSet(inboundValues, outboundValues) {
        return new Promise((resolve) => {
            this.inboundLayer.forEach((neuron, index) => {
                neuron.setValue(inboundValues[index]);
            });
            this.removeListeners();
            this.removeListeners = NNUtils.listenOutboundNeurons(this.outboundLayer, (value) => {
                console.timeEnd('time');
                resolve({
                    inbound: inboundValues,
                    expectedOutbound: outboundValues,
                    actualOutbound: [value]
                });
            });
        });
    }

    calculateError(setResult) {
        return NNUtils.calculateErrorMSE(setResult);
    }

    correctWeight(outbound) {
        let error = this.calculateError(outbound);
        let weightsDelta = error * NNUtils.derivativeHyperbolicTangent(error);
        return Promise.each(
            this.outboundLayer,
            neuron => neuron.correctWeight(weightsDelta, this.learningRate)
        );
        return Promise.resolve({});
    }
}

module.exports = NN;