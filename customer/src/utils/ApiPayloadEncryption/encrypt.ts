import crypto from 'crypto';
import { Logger } from '../logging';
import getAlgorithm from './getAlgorithm';
import { generateHkdfKey } from './generateHkdfKey';

const encrypt = (
  plainText: string,
  ivParam: string,
  ikm: string,
  info: string
): string => {
  const encryptionHkdfKey: Buffer = generateHkdfKey(ikm, 16, null, info);
  const key = Buffer.from(encryptionHkdfKey.toString('base64'), 'base64');
  const iv = Buffer.from(ivParam || '', 'base64');

  try {
    const cipher = crypto.createCipheriv(
      getAlgorithm(encryptionHkdfKey.toString()),
      key,
      iv
    ) as crypto.CipherGCM;
    let encrypted: string = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  } catch (e) {
    const customerMessage: string = 'Unable to encrypt';
    Logger.log('error', 'Error ', {
      customerMessage,
      request: 'encrypt (APiPayloadEncryption)',
      actualError: e,
      fullError: e,
    });
    throw new Error(customerMessage);
  }
};

export default encrypt;
