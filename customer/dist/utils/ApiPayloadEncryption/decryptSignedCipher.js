"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const macSign_1 = __importDefault(require("./macSign"));
const decrypt_1 = __importDefault(require("./decrypt"));
const logging_1 = require("../logging");
const decryptSignedCipher = (ikm, info, authenticationTag, serializedResponse) => {
    const bData = Buffer.from(serializedResponse, 'base64');
    const iv = bData.subarray(1, 17);
    if (iv.length !== 16) {
        throw new Error('Invalid Iv Length');
    }
    const mac = bData.subarray(18, 50);
    if (mac.length !== 32) {
        throw new Error('Invalid mac Length');
    }
    const cipher = bData.subarray(50);
    const refMac = Buffer.from((0, macSign_1.default)(ikm, authenticationTag, cipher.toString('base64')), 'base64');
    if (Buffer.compare(mac, refMac) !== 0) {
        throw new Error('Mac authentication failed');
    }
    const cipherText = cipher.toString('base64');
    try {
        return (0, decrypt_1.default)(cipherText, iv.toString('base64'), ikm, info);
    }
    catch (e) {
        const customerMessage = 'Unable to decrypt';
        logging_1.Logger.log('error', 'Error ', {
            customerMessage,
            request: 'decryptSignedCipher',
            actualError: e,
            fullError: e,
        });
        throw new Error(customerMessage);
    }
};
exports.default = decryptSignedCipher;
