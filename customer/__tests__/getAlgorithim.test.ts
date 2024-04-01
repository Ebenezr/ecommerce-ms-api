import { test } from 'vitest';
import sinon from 'sinon';
import { Logger } from '../src/utils/logging';
import getAlgorithm from '../src/utils/ApiPayloadEncryption/getAlgorithm';

test('returns AES-256-GCM for a 16-byte key', ({ expect }) => {
  const key = Buffer.alloc(16).toString('base64');
  const result = getAlgorithm(key);
  expect(result).toBe('AES-256-GCM');
});

test('returns AES-256-GCM for a 32-byte key', ({ expect }) => {
  const key = Buffer.alloc(32).toString('base64');
  const result = getAlgorithm(key);
  expect(result).toBe('AES-256-GCM');
});

test('throws an error for an invalid key length', ({ expect }) => {
  const key = Buffer.alloc(4).toString('base64');
  const log = sinon.stub(Logger, 'log');

  try {
    getAlgorithm(key);
  } catch (e) {
    expect(e.message).toBe('Invalid key length: 4');
    expect(
      log.calledWith('error', 'Error: ', {
        customerMessage: 'invalid key passed',
        request: 'getAlgorithm',
        actualError: 'Invalid key length: 4',
        fullError: 'Invalid key length: 4',
      })
    ).toBe(true);
  }
});
