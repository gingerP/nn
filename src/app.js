'use strict';

const NN = require('./NN');
const testData = [
    [0, 0]
];

let network = new NN(1, 100, 100, 1);
network.executePhase(testData);


