'use strict';

const NN = require('./NN');
const testData = [
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0]
];

let network = new NN(1, 100, 10, 1);
network.executePhase(testData).then((result) => {
    console.log(JSON.stringify(result, null, '  '));
});
