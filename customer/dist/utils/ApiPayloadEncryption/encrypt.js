"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const logging_1 = require("../logging");
const getAlgorithm_1 = __importDefault(require("./getAlgorithm"));
const generateHkdfKey_1 = require("./generateHkdfKey");
const encrypt = (plainText, ivParam, ikm, info) => {
    const encryptionHkdfKey = (0, generateHkdfKey_1.generateHkdfKey)(ikm, 16, null, info);
    const key = Buffer.from(encryptionHkdfKey.toString('base64'), 'base64');
    const iv = Buffer.from(ivParam || '', 'base64');
    try {
        const cipher = crypto_1.default.createCipheriv((0, getAlgorithm_1.default)(encryptionHkdfKey.toString()), key, iv);
        let encrypted = cipher.update(plainText, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }
    catch (e) {
        const customerMessage = 'Unable to encrypt';
        logging_1.Logger.log('error', 'Error ', {
            customerMessage,
            request: 'encrypt (APiPayloadEncryption)',
            actualError: e,
            fullError: e,
        });
        throw new Error(customerMessage);
    }
};
exports.default = encrypt;
