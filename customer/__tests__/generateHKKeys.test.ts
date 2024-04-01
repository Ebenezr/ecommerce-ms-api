import { test } from 'vitest';
import sinon from 'sinon';
import hkdf from 'futoin-hkdf';
import { generateHkdfKey } from '../src/utils/ApiPayloadEncryption/generateHkdfKey';

test('generates an HKDF key', ({ expect }) => {
  const ikm = 'ikm';
  const length = 32;
  const salt = 'salt';
  const info = 'info';
  const hash = 'SHA-256';
  const expectedKey = Buffer.from('hkdfKey');
  //   sinon.stub(hkdf, '').returns(expectedKey);
  const result = generateHkdfKey(ikm, length, salt, info, hash);

  //   expect(result).toBe(expectedKey);
});
