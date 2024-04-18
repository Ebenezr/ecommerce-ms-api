import crypto from 'crypto';
import { generateHkdfKey } from './generateHkdfKey';

const macSign = (ikm: string, info: string, cipherText: string): string => {
  const hkdfAuthenticationKey: Buffer = generateHkdfKey(ikm, 32, null, info);
  const cipherTextBuffer: Buffer = Buffer.from(cipherText, 'base64');
  return crypto
    .createHmac('sha256', hkdfAuthenticationKey)
    .update(cipherTextBuffer)
    .digest('base64');
};

export default macSign;
