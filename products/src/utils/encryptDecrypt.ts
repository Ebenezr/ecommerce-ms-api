// Require the core node modules.
import crypto from 'crypto';
import config from 'dotenv';
import { Logger } from './logging';

config.config();
const configValues = process.env;

const encryptionKey = configValues.ENCRYPTION_KEY;
const initializationVector = configValues.INITIALIZATION_VECTOR;

// The CipherIV methods must take the inputs as a binary / buffer values.
const binaryEncryptionKey = Buffer.from(encryptionKey || '', 'base64');
const binaryIV = Buffer.from(initializationVector || '', 'base64');

module.exports = {
  encrypt(input: any) {
    try {
      // When encrypting, we're converting the UTF-8 input to base64 output.

      const cipher = crypto.createCipheriv(
        'AES-256-GCM',
        binaryEncryptionKey,
        binaryIV
      ) as crypto.CipherGCM;

      let encrypted = cipher.update(input, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Retrieve the authentication tag
      const authTag = cipher.getAuthTag();
      return { encrypted, authTag: authTag.toString('base64') };
    } catch (e) {
      const customerMessage = 'Wrong format passed.';
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'encrypt',
        input,
        technicalMessage: `Unable to encrypt the input`,
        customerMessage,
      });
      throw new Error(customerMessage);
    }
  },

  decrypt(encryptedText: any, base64AuthTag: any) {
    try {
      const decipher = crypto.createDecipheriv(
        'AES-256-GCM',
        binaryEncryptionKey,
        binaryIV
      ) as crypto.DecipherGCM;

      // Convert the base64 authTag back to binary
      const authTag = Buffer.from(base64AuthTag, 'base64');

      // Set the authentication tag
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;

      // When decrypting we're converting the base64 input to UTF-8 output.
    } catch (e) {
      const customerMessage = 'Wrong format passed.';
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'decrypt',
        input: encryptedText,
        technicalMessage: `Unable to decrypt the input`,
        customerMessage,
      });
      throw new Error(customerMessage);
    }
  },
};
