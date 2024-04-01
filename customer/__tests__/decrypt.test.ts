import { test, vi } from 'vitest';
import decrypt from '../src/utils/ApiPayloadEncryption/decrypt';
import crypto from 'crypto';
import sinon from 'sinon';

test('decrypts a cipher text', ({ expect }) => {
  const cipherText = 'cipherText';
  const base64AuthTag = 'base64AuthTag';

  const mockDecipher = {
    update: sinon.stub().returns(Buffer.from('decrypted')),
    final: sinon.stub().returns(Buffer.from('')),
    setAuthTag: sinon.stub(),
  };
  sinon.stub(crypto, 'createDecipheriv').returns(mockDecipher);

  const result = decrypt(cipherText, base64AuthTag);

  expect(result).toBe('decrypted');

  sinon.restore();
});

test('logs an error if decryption fails', ({ expect }) => {
  const cipherText = 'cipherText';
  const base64AuthTag = 'base64AuthTag';

  const error = new Error('Decryption failed');

  try {
    decrypt(cipherText, base64AuthTag);
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
    expect(e.message).toBe('Unable to decrypt');
  }
});
