"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("../logging");
// this function is purely to get the algorithm to use in encryption and decryption
const getAlgorithm = (keyPassed) => {
    const key = Buffer.from(keyPassed, 'base64');
    if (key.length === 16) {
        return 'aes-128-cbc';
    }
    if (key.length === 32) {
        return 'aes-256-cbc';
    }
    const customerMessage = 'invalid key passed';
    const technicalMessage = `Invalid key length: ${key.length}`;
    logging_1.Logger.log('error', 'Error: ', {
        customerMessage,
        request: 'getAlgorithm',
        actualError: technicalMessage,
        fullError: technicalMessage,
    });
    throw new Error(`Invalid key length: ${key.length}`);
};
exports.default = getAlgorithm;
