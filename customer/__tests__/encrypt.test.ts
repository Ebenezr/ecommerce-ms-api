import { test } from 'vitest';
import encrypt from '../src/utils/ApiPayloadEncryption/encrypt';
import crypto from 'crypto';
import sinon from 'sinon';

test('encrypts a plain text', ({ expect }) => {
  const plainText = 'Hello, world!';
  const encryptedText = 'encryptedText';
  //   const authTag = 'authTag';

  const mockCipher = {
    update: sinon.stub().returns(Buffer.from('encryptedText')),
    final: sinon.stub().returns(Buffer.from('')),
    getAuthTag: sinon.stub().returns(Buffer.from('authTag', 'base64')),
  };
  sinon.stub(crypto, 'createCipheriv').returns(mockCipher);

  const result = encrypt(plainText);

  expect(result).toEqual({
    authTag: 'authTag=',
    encrypted: 'encryptedText',
  });
});

test('logs an error if encryption fails', ({ expect }) => {
  const plainText = 'Hello, world!';

  const error = new Error('Encryption failed');

  try {
    encrypt(plainText);
  } catch (e: any) {
    expect(e).toBeInstanceOf(Error);
    // expect(e?.message).toBe('Unable to encrypt');
  }
});
