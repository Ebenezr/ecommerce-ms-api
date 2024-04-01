import { test } from 'vitest';
import sinon from 'sinon';
import crypto from 'crypto';
import macSign from '../src/utils/ApiPayloadEncryption/macSign';
import { generateHkdfKey } from '../src/utils/ApiPayloadEncryption/generateHkdfKey';

test('signs a cipher text', ({ expect }) => {
  const ikm = 'ikm';
  const info = 'info';
  const cipherText = 'cipherText';
  const hkdfAuthenticationKey = Buffer.from('hkdfAuthenticationKey');
  const signedCipher = 'signedCipher';

  //   const hmac = crypto.createHmac('sha256', hkdfAuthenticationKey);
  //   sinon.stub(hmac, 'update').returns(hmac);
  //   sinon.stub(hmac, 'digest').returns(signedCipher);

  const result = macSign(ikm, info, cipherText);

  expect(result).toBe('iqVoi036wNeu2hEWvvHmdI93OgRQiOEJd1ukFzVdHgU=');
});
