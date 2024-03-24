"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertKeys = require('./convertKeys');
const Logger = require('./logging');
const ErrorHandler = require('./errorHandler');
const LogMessages = (response, mobileNumber, request, apiUrl, payload = {}) => {
    if (!response.header) {
        Logger.log('error', 'Error: ', {
            fullError: response,
            msisdn: mobileNumber,
            payload,
            request,
            customError: `Got an error while hitting ${apiUrl}`,
            actualError: response,
            customerMessage: 'Sorry we are experiencing a technical problem. Please try again later',
        });
    }
    else {
        const { header: { responseCode, responseMessage, customerMessage }, } = convertKeys(response);
        if (responseCode === 200 || responseCode === 1000) {
            Logger.log('info', 'Success: ', {
                message: 'Request Sucessful',
                request,
                payload,
                msisdn: mobileNumber,
                response,
                url: apiUrl,
            });
        }
        else {
            Logger.log('error', 'Error: ', {
                fullError: response,
                msisdn: mobileNumber,
                request,
                payload,
                customError: `Got (${responseCode}) while hitting ${apiUrl}`,
                actualError: responseMessage,
                customerMessage: ErrorHandler(customerMessage),
            });
        }
    }
};
exports.default = LogMessages;
