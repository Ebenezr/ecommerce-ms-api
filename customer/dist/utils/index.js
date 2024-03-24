"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishMessage = exports.CreateChannel = exports.FormateData = exports.ValidateSignature = exports.GenerateSignature = exports.ValidatePassword = exports.GeneratePassword = exports.GenerateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const amqplib_1 = __importDefault(require("amqplib"));
const config_1 = require("../config");
//Utility functions
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
const ValidatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
});
exports.ValidatePassword = ValidatePassword;
const GenerateSignature = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: '1d' });
};
exports.GenerateSignature = GenerateSignature;
const ValidateSignature = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.get('Authorization');
    if (signature) {
        const payload = yield jsonwebtoken_1.default.verify(signature.split(' ')[1], config_1.APP_SECRET);
        req.user = payload;
        return true;
    }
    return false;
});
exports.ValidateSignature = ValidateSignature;
const FormateData = (data) => {
    if (data) {
        return { data };
    }
    else {
        throw new Error('Data Not found!');
    }
};
exports.FormateData = FormateData;
//Message Broker
const CreateChannel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect(config_1.MSG_QUEUE_URL);
        const channel = yield connection.createChannel();
        yield channel.assertQueue(config_1.EXCHANGE_NAME, { durable: true });
        return channel;
    }
    catch (err) {
        throw err;
    }
});
exports.CreateChannel = CreateChannel;
const PublishMessage = (channel, service, msg) => {
    channel.publish(config_1.EXCHANGE_NAME, service, Buffer.from(msg));
};
exports.PublishMessage = PublishMessage;
