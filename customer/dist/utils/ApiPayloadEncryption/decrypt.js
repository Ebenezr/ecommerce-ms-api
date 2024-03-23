"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const logging_1 = require("../logging");
const getAlgorithm_1 = __importDefault(require("./getAlgorithm"));
const generateHkdfKey_1 = require("./generateHkdfKey");
const decrypt = (cipherText, ivParam, ikm, info) => {
    const encryptionHkdfKey = (0, generateHkdfKey_1.generateHkdfKey)(ikm, 16, null, info);
    const key = Buffer.from(encryptionHkdfKey.toString('base64'), 'base64');
    const iv = Buffer.from(ivParam || '', 'base64');
    try {
        const decipher = crypto_1.default.createDecipheriv((0, getAlgorithm_1.default)(encryptionHkdfKey.toString()), key, iv);
        let decrypted = decipher.update(cipherText, 'base64');
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    catch (e) {
        const customerMessage = 'Unable to decrypt';
        logging_1.Logger.log('error', 'Error ', {
            customerMessage,
            request: 'decrypt (APiPayloadEncryption)',
            actualError: e,
            fullError: e,
        });
        throw new Error(customerMessage);
    }
};
exports.default = decrypt;
