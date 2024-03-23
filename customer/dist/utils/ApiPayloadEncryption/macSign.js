"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const generateHkdfKey_1 = require("./generateHkdfKey");
const macSign = (ikm, info, cipherText) => {
    const hkdfAuthenticationKey = (0, generateHkdfKey_1.generateHkdfKey)(ikm, 32, null, info);
    const cipherTextBuffer = Buffer.from(cipherText, 'base64');
    return crypto_1.default
        .createHmac('sha256', hkdfAuthenticationKey)
        .update(cipherTextBuffer)
        .digest('base64');
};
exports.default = macSign;
