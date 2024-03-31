import convertKeys from './convertKeys';
import { Logger } from './logging';
import ErrorHandler from './errorHandler';

interface ResponseHeader {
  responseCode: number;
  responseMessage: string;
  customerMessage: string;
}

interface Response {
  header?: ResponseHeader;
  [key: string]: any;
}

const LogMessages = (
  response: Response,
  mobileNumber: string,
  request: any,
  apiUrl: string,
  payload: any = {}
): void => {
  if (!response.header) {
    Logger.log('error', 'Error: ', {
      fullError: response,
      msisdn: mobileNumber,
      payload,
      request,
      customError: `Got an error while hitting ${apiUrl}`,
      actualError: response,
      customerMessage:
        'Sorry we are experiencing a technical problem. Please try again later',
    });
  } else {
    const {
      header: { responseCode, responseMessage, customerMessage },
    } = convertKeys(response);
    if (responseCode === 200 || responseCode === 1000) {
      Logger.log('info', 'Success: ', {
        message: 'Request Successful',
        // ... rest of the code
      });
    }
  }
};

export default LogMessages;
