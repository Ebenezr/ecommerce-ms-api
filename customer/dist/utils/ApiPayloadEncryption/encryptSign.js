"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const encrypt_1 = __importDefault(require("./encrypt"));
const logging_1 = require("../logging");
const macSign_1 = __importDefault(require("./macSign"));
const encryptSign = (ikm, info, authenticationTag, plainText) => {
    const iv = crypto_1.default.randomBytes(16);
    try {
        const cipherText = (0, encrypt_1.default)(plainText, iv.toString('base64'), ikm, info);
        const signedCipher = (0, macSign_1.default)(ikm, authenticationTag, cipherText);
        const macBuffer = Buffer.from(signedCipher, 'base64');
        const cipherTextBuffer = Buffer.from(cipherText, 'base64');
        return Buffer.concat([
            Buffer.alloc(1, iv.length),
            iv,
            Buffer.alloc(1, macBuffer.length),
            macBuffer,
            cipherTextBuffer,
        ]).toString('base64');
    }
    catch (e) {
        const customerMessage = 'Unable to encrypt';
        logging_1.Logger.log('error', 'Error ', {
            customerMessage,
            request: 'encryptSign (APiPayloadEncryption)',
            actualError: e,
            fullError: e,
        });
        throw new Error('Unable to encrypt');
    }
};
exports.default = encryptSign;
