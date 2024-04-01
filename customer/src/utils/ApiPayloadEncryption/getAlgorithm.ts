import { Logger } from '../logging';

// this function is purely to get the algorithm to use in encryption and decryption
const getAlgorithm = (keyPassed: string): string => {
  const key: Buffer = Buffer.from(keyPassed, 'base64');
  if (key.length === 16) {
    return 'AES-256-GCM';
  }
  if (key.length === 32) {
    return 'AES-256-GCM';
  }
  const customerMessage: string = 'invalid key passed';
  const technicalMessage: string = `Invalid key length: ${key.length}`;
  Logger.log('error', 'Error: ', {
    customerMessage,
    request: 'getAlgorithm',
    actualError: technicalMessage,
    fullError: technicalMessage,
  });
  throw new Error(`Invalid key length: ${key.length}`);
};

export default getAlgorithm;
