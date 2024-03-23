"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logStringBuilder = exports.Logger = void 0;
const { createLogger, format } = require('winston');
const DailyLog = require('winston-daily-rotate-file');
const _ = require('lodash');
const config = require('dotenv');
const WinstonCloudWatch = require('winston-cloudwatch');
const getTimeStamp = require('./getTimestamp');
const { combine, timestamp, label, printf } = format;
config.config();
const configValues = process.env;
const logStringBuilder = (meta, message, level) => {
    let logString = `${getTimeStamp()}|message=${message}|level=${level}`;
    if ('url' in meta) {
        logString = `${logString}|url=${meta.url}`;
        delete meta.url;
    }
    if ('request' in meta) {
        logString = `${logString}|request=${meta.request}`;
        delete meta.request;
    }
    if ('email' in meta) {
        logString = `${logString}|email=${meta.email}`;
        delete meta.email;
    }
    if ('technicalMessage' in meta) {
        logString = `${logString}|technicalMessage=${meta.technicalMessage}`;
        delete meta.technicalMessage;
    }
    // Add customer error
    const selectableErrors = [
        'customerMessage',
        'customError',
        'message',
        'actualError',
        'systemError',
        'payload',
    ];
    const pipeSpecial = (errors, depth = 0) => {
        if (depth > 10) {
            return;
        }
        _.forOwn(errors, (value, key) => {
            if (typeof value === 'object') {
                pipeSpecial(value, depth + 1);
            }
            else if (selectableErrors.indexOf(key) >= 0) {
                logString = `${logString}|${key} =${value}`;
            }
        });
    };
    pipeSpecial(meta);
    logString = `${logString}\n`;
    return logString;
};
exports.logStringBuilder = logStringBuilder;
const timezoned = () => new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Nairobi',
});
const logFormat = printf((_a) => {
    var { level, message } = _a, meta = __rest(_a, ["level", "message"]);
    return `${logStringBuilder(meta, message, level)}`;
});
const logFilePath = configValues.LOGGING_PATH;
let Logger;
exports.Logger = Logger;
let transport;
if (configValues.ENVIRONMENT === 'fileBased') {
    exports.Logger = Logger = createLogger({
        transports: [
            new DailyLog({
                filename: logFilePath,
                datePattern: 'YYYY-MM-DD',
            }),
        ],
        format: combine(label({ label: 'Masoko Server' }), timestamp({
            format: timezoned,
        }), logFormat),
    });
}
if (configValues.ENVIRONMENT === 'aws') {
    exports.Logger = Logger = createLogger({
        transports: [
            new WinstonCloudWatch({
                awsOptions: {
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    },
                    region: process.env.AWS_REGION,
                },
                logGroupName: process.env.CLOUDWATCH_LOG_GROUP_NAME,
                logStreamName: `${process.env.CLOUDWATCH_LOG_GROUP_NAME}-${process.env.NODE_ENV}`,
                jsonMessage: true,
                messageFormatter: (_a) => {
                    var { level, message } = _a, meta = __rest(_a, ["level", "message"]);
                    return `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(meta)}}`;
                },
            }),
        ],
    });
}
