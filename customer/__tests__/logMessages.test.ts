import { test, vi } from 'vitest';
import LogMessages from '../src/utils/logMessages';
import { Logger } from '../src/utils/logging';
import ErrorHandler from '../src/utils/errorHandler';
import convertKeys from '../src/utils/convertKeys';

vi.mock('../src/utils/logging');
vi.mock('../src/utils/errorHandler');
vi.mock('../src/utils/convertKeys');

test.skip('logs a success message for response codes 200 and 1000', ({
  expect,
}) => {
  const mobileNumber = '1234567890';
  const request = {};
  const apiUrl = 'http://example.com';
  const payload = {};

  const response = {
    header: {
      responseCode: 200,
      responseMessage: 'Success',
      customerMessage: 'Success',
    },
  };

  LogMessages(response, mobileNumber, request, apiUrl, payload);

  expect(Logger.log).toHaveBeenCalledWith('info', 'Success: ', {
    message: 'Request Sucessful',
    request,
    payload,
    msisdn: mobileNumber,
    response: convertKeys(response),
    url: apiUrl,
  });
});

// expect(log).toHaveBeenCalledWith('info', 'Success: ', {
//     message: 'Request Sucessful',
//     request,
//     payload,
//     msisdn: mobileNumber,
//     response: convertKeys(response),
//     url: apiUrl,
// });

// test('logs an error message for other response codes', ({ expect }) => {
//   const response = {
//     header: {
//       response_code: 500,
//       response_message: 'Error',
//       customer_message: 'Error',
//     },
//   };
//   const mobileNumber = '1234567890';
//   const request = {};
//   const apiUrl = 'http://example.com';
//   const payload = {};

//   LogMessages(response, mobileNumber, request, apiUrl, payload);

//   expect(log).toHaveBeenCalledWith('error', 'Error: ', {
//     fullError: response,
//     msisdn: mobileNumber,
//     request,
//     payload,
//     customError: `Got (500) while hitting ${apiUrl}`,
//     actualError: 'Error',
//     customerMessage: ErrorHandler('Error'),
//   });
// });
