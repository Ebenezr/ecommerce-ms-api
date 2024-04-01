import macSign from './macSign';
import decrypt from './decrypt';
import { Logger } from '../logging';

const decryptSignedCipher = (
  ikm: string,

  authenticationTag: string,
  serializedResponse: string
): string => {
  const bData: Buffer = Buffer.from(serializedResponse, 'base64');
  const iv: Buffer = bData.subarray(1, 17);
  if (iv.length !== 16) {
    throw new Error('Invalid Iv Length');
  }
  const mac: Buffer = bData.subarray(18, 50);
  if (mac.length !== 32) {
    throw new Error('Invalid mac Length');
  }
  const cipher: Buffer = bData.subarray(50);
  const refMac: Buffer = Buffer.from(
    macSign(ikm, authenticationTag, cipher.toString('base64')),
    'base64'
  );
  if (Buffer.compare(mac, refMac) !== 0) {
    throw new Error('Mac authentication failed');
  }
  const cipherText: string = cipher.toString('base64');
  try {
    return decrypt(cipherText, iv.toString('base64'));
  } catch (e) {
    const customerMessage: string = 'Unable to decrypt';
    Logger.log('error', 'Error ', {
      customerMessage,
      request: 'decryptSignedCipher',
      actualError: e,
      fullError: e,
    });
    throw new Error(customerMessage);
  }
};

export default decryptSignedCipher;
