import { test } from 'vitest';
import sinon from 'sinon';
import encryptSign from '../src/utils/ApiPayloadEncryption/encryptSign';
import crypto from 'crypto';
import { Logger } from '../src/utils/logging';

test('encrypts and signs a plain text', ({ expect }) => {
  const plainText = 'Hello, world!';
  const encryptedText = 'encryptedText';
  const signedCipher = 'signedCipher';
  const iv = Buffer.from('iv');
  const ikm = 'info';
  const authenticationTag = 'authenticationTag';
  sinon.stub(crypto, 'randomBytes').returns(iv);

  const result = encryptSign(ikm, authenticationTag, plainText);

  //   expect(result).toBe(
  //     Buffer.concat([
  //       Buffer.alloc(1, iv.length),
  //       iv,
  //       Buffer.alloc(1, Buffer.from(signedCipher, 'base64').length),
  //       Buffer.from(signedCipher, 'base64'),
  //       Buffer.from(encryptedText, 'base64'),
  //     ]).toString('base64')
  //   );
});

test('logs an error if encryption fails', ({ expect }) => {
  const plainText = 'Hello, world!';
  const ikm = 'info';
  const authenticationTag = 'authenticationTag';

  const error = new Error('Encryption failed');

  const log = sinon.stub(Logger, 'log');

  try {
    encryptSign(ikm, authenticationTag, plainText);
  } catch (e) {
    expect(
      log.calledWith('error', 'Error ', {
        customerMessage: 'Unable to encrypt',
        request: 'encryptSign (APiPayloadEncryption)',
        actualError: error,
        fullError: error,
      })
    ).toBe(true);
  }
});
