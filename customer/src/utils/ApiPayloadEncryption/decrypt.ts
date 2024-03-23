import crypto from 'crypto';
import { Logger } from '../logging';
import getAlgorithm from './getAlgorithm';
import { generateHkdfKey } from './generateHkdfKey';

const decrypt = (
  cipherText: string,
  ivParam: string,
  ikm: string,
  info: string
): string => {
  const encryptionHkdfKey: Buffer = generateHkdfKey(ikm, 16, null, info);
  const key = Buffer.from(encryptionHkdfKey.toString('base64'), 'base64');
  const iv = Buffer.from(ivParam || '', 'base64');

  try {
    const decipher = crypto.createDecipheriv(
      getAlgorithm(encryptionHkdfKey.toString()),
      key,
      iv
    );
    let decrypted: Buffer = decipher.update(cipherText, 'base64');
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    const customerMessage: string = 'Unable to decrypt';
    Logger.log('error', 'Error ', {
      customerMessage,
      request: 'decrypt (APiPayloadEncryption)',
      actualError: e,
      fullError: e,
    });
    throw new Error(customerMessage);
  }
};

export default decrypt;
