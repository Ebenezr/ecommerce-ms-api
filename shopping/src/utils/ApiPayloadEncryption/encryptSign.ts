import crypto from 'crypto';
import encrypt from './encrypt';
import { Logger } from '../logging';
import macSign from './macSign';

const encryptSign = (
  ikm: string,
  authenticationTag: string,
  plainText: string
): string => {
  const iv: Buffer = crypto.randomBytes(16);
  try {
    const { encrypted } = encrypt(plainText);
    const signedCipher: string = macSign(ikm, authenticationTag, encrypted);
    const macBuffer: Buffer = Buffer.from(signedCipher, 'base64');
    const cipherTextBuffer: Buffer = Buffer.from(encrypted, 'base64');
    return Buffer.concat([
      Buffer.alloc(1, iv.length),
      iv,
      Buffer.alloc(1, macBuffer.length),
      macBuffer,
      cipherTextBuffer,
    ]).toString('base64');
  } catch (e) {
    const customerMessage: string = 'Unable to encrypt';
    Logger.log('error', 'Error ', {
      customerMessage,
      request: 'encryptSign (APiPayloadEncryption)',
      actualError: e,
      fullError: e,
    });
    throw new Error('Unable to encrypt');
  }
};

export default encryptSign;
