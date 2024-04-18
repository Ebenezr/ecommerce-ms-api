import crypto from 'crypto';
import { Logger } from '../logging';
import config from 'dotenv';

config.config();
const configValues = process.env;

const decrypt = (cipherText: string, base64AuthTag: any): string => {
  const encryptionKey = configValues.ENCRYPTION_KEY;
  const initializationVector = configValues.INITIALIZATION_VECTOR;
  const encryptionHkdfKey = Buffer.from(encryptionKey || '', 'base64');

  const binaryIV = Buffer.from(initializationVector || '', 'base64');
  try {
    const decipher = crypto.createDecipheriv(
      'AES-256-GCM',
      encryptionHkdfKey,
      binaryIV
    ) as crypto.DecipherGCM;

    // Convert the base64 authTag back to binary
    const authTag = Buffer.from(base64AuthTag, 'base64');
    // Set the authentication tag
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(cipherText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error: any) {
    const customerMessage: string = 'Unable to decrypt';
    Logger.log('error', 'Error ', {
      customerMessage,
      request: 'decrypt (APiPayloadEncryption)',
      actualError: error?.message,
      fullError: error?.stack,
    });
    throw new Error(customerMessage);
  }
};

export default decrypt;
