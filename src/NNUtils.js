'use strict';

class NNUtils {
    static generateLayer(inboundLayerSize, neuronClass) {
        let neurons = [];
        let index = 0;

        while (index < inboundLayerSize) {
            neurons.push(new neuronClass());
            index++;
        }
        return neurons;
    }

    static generateHiddenLayer(layersCount, layerSize, neuronClass) {
        let hiddenLayer = [];
        let layerIndex = 0;

        while (layerIndex < layersCount) {
            let layer = this.generateLayer(layerSize, neuronClass);
            hiddenLayer.push(layer);
            layerIndex++;
        }
        return hiddenLayer;
    }

    static linkLayers(inboundLayer, hiddenLayer, outboundLayer) {
        let layers = [inboundLayer];
        layers = layers.concat(hiddenLayer);
        layers.push(outboundLayer);
        let layerIndex = 0;

        while (layerIndex < layers.length - 1) {
            this.linkTwoLayers(layers[layerIndex], layers[layerIndex + 1]);
            layerIndex++;
        }
    }

    static linkTwoLayers(layerParent, layerChild) {
        let parentIndex = 0;
        let childIndex = 0;

        while (parentIndex < layerParent.length) {
            let parent = layerParent[parentIndex];

            while (childIndex < layerChild.length) {
                layerChild[childIndex].registerInboundNeuron(parent);
                childIndex++;
            }

            childIndex = 0;
            parentIndex++;
        }
    }

    static listenOutboundNeurons(outboundNeurons, callback) {
        outboundNeurons.forEach((neuron) => {
            neuron.addListener('inbound', callback);
        });
        return () => {
            outboundNeurons.forEach((neuron) => {
                neuron.removeListener('inbound', callback);
            });
        };
    }
}

module.exports = NNUtils;