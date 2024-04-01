import { test } from 'vitest';
import sinon from 'sinon';
import decryptSignedCipher from '../src/utils/ApiPayloadEncryption/decryptSignedCipher';
import { Logger } from '../src/utils/logging';

test.skip('decrypts and verifies a signed cipher', ({ expect }) => {
  const authenticationTag = 'authenticationTag';
  const cipherText = 'cipherText';
  const decryptedText = 'decryptedText';
  const serializedResponse = 'serializedResponse';

  const result = decryptSignedCipher(
    authenticationTag,
    cipherText,
    serializedResponse
  );

  expect(result).toBe(decryptedText);
});

test('throws an error if MAC authentication fails', ({ expect }) => {
  const ikm = 'ikm';
  const authenticationTag = 'authenticationTag';
  const cipherText = 'cipherText';

  const log = sinon.stub(Logger, 'log');

  try {
    decryptSignedCipher(ikm, authenticationTag, cipherText);
  } catch (e) {
    expect(e.message).toBe('Invalid Iv Length');
  }
});
