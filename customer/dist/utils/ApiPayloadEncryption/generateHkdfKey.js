"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHkdfKey = void 0;
const futoin_hkdf_1 = __importDefault(require("futoin-hkdf"));
const generateHkdfKey = (ikm, length, salt, info = '', hash = 'SHA-256') => {
    const options = {
        salt: salt ? salt.toString() : undefined,
        info,
        hash,
    };
    return (0, futoin_hkdf_1.default)(ikm, length, options);
};
exports.generateHkdfKey = generateHkdfKey;
