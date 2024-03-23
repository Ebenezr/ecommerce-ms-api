"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const config = require('dotenv');
const { v4: uuid } = require('uuid');
config.config();
const configValues = process.env;
// Some of the headers that are commonly used
const commonHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
const commonAwsHeaders = {
    'Accept-Encoding': 'application/json',
    'Accept-Language': 'EN',
    'x-app': `${configValues.SOURCE_SYSTEM}`,
    'X-Source-System': `${configValues.APP_NAME}`,
    'X-Source-Division': 'DE',
    'X-Source-CountryCode': 'KE',
    'X-Source-Operator': 'safaricom',
    'x-api-key': `${configValues.AWS_API_KEY}`,
    'X-Version': '1',
    'X-DeviceInfo': uuid(),
    'X-DeviceId': uuid(),
    'x-source-identity-token': uuid(),
};
const addHeader = (request, headerName, headerValue) => {
    if (request.headers && typeof request.headers.set === 'function') {
        request.headers.set(headerName, headerValue);
    }
    else if (request.headers && typeof request.headers.append === 'function') {
        request.headers.append(headerName, headerValue);
    }
    else if (request.headers && typeof request.headers === 'object') {
        request.headers[headerName] = headerValue;
    }
};
class HeadersConfig {
    headerEnrichment(request) {
        // Add the common headers
        lodash_1.default.forOwn(commonHeaders, (header, name) => {
            addHeader(request, name, header);
        });
    }
    // aws access token
    awsAccessToken(request) {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.basicAuthHeader(`${configValues.AWS_USERNAME}:${configValues.AWS_PASSWORD}`),
        };
        lodash_1.default.forOwn(headers, (header, name) => {
            addHeader(request, name, header);
        });
    }
    basicApiHeaders(request, customerToken) {
        let finalToken;
        finalToken = configValues.APIS__API_MAGENTO2__CONFIG__INTEGRATION;
        if (customerToken.token) {
            finalToken = customerToken.token;
        }
        const headers = {
            Authorization: `Bearer ${finalToken}`,
        };
        lodash_1.default.forOwn(headers, (header, name) => {
            addHeader(request, name, header);
        });
        // Add the common headers
        lodash_1.default.forOwn(commonHeaders, (header, name) => {
            addHeader(request, name, header);
        });
    }
    // Helper function to generate a basic auth given username:password
    basicAuthHeader(credentials) {
        return `Basic ${Buffer.from(credentials).toString('base64')}`;
    }
}
module.exports = HeadersConfig;
