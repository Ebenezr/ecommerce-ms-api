import crypto from 'crypto';
import config from 'dotenv';
import { Logger } from '../logging';

config.config();
const configValues = process.env;

const encrypt = (plainText: string) => {
  const encryptionKey = configValues.ENCRYPTION_KEY;
  const initializationVector = configValues.INITIALIZATION_VECTOR;

  const binaryEncryptionKey = Buffer.from(encryptionKey || '', 'base64');
  const binaryIV = Buffer.from(initializationVector || '', 'base64');

  try {
    const cipher = crypto.createCipheriv(
      'AES-256-GCM',
      binaryEncryptionKey,
      binaryIV
    ) as crypto.CipherGCM;

    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Retrieve the authentication tag
    const authTag = cipher.getAuthTag();
    return { encrypted, authTag: authTag.toString('base64') };
  } catch (error: any) {
    const customerMessage: string = 'Unable to encrypt';
    Logger.log('error', 'Error ', {
      customerMessage,
      request: 'encrypt (APiPayloadEncryption)',
      actualError: error?.message,
      fullError: error?.stack,
    });
    throw new Error(customerMessage);
  }
};

export default encrypt;
