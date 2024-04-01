import { test } from 'vitest';
import * as index from '../src/utils/ApiPayloadEncryption/index';
import encryptSign from '../src/utils/ApiPayloadEncryption/encryptSign';
import decryptSignedCipher from '../src/utils/ApiPayloadEncryption/decryptSignedCipher';

test('exports the correct functions', ({ expect }) => {
  expect(index.encryptSign).toBe(encryptSign);
  expect(index.decryptSignedCipher).toBe(decryptSignedCipher);
});
