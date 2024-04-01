import { test } from 'vitest';
import { encrypt } from '../src/utils/encryptDecrypt';

test('encrypts a string', ({ expect }) => {
  const input = 'Hello, world!';
  const result = encrypt(input);
  expect(result).toHaveProperty('encrypted');
  expect(result).toHaveProperty('authTag');
});

test('throws an error when the input is not a string', ({ expect }) => {
  const input = { message: 'Hello, world!' };
  try {
    encrypt(input);
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Wrong format passed.');
  }
});
