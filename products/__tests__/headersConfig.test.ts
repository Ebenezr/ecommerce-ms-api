import { test } from 'vitest';
import HeadersConfig from '../src/utils/headersConfig';

test('adds authorization header if customer token is present', ({ expect }) => {
  const headersConfig = new HeadersConfig();
  const request = { headers: new Map() };
  const customerToken = { token: 'token' };
  headersConfig.basicApiHeaders(request, customerToken);
  expect(request.headers.get('Authorization')).toBe('Bearer token');
});

test.skip('does not add authorization header if customer token is not present', ({
  expect,
}) => {
  const headersConfig = new HeadersConfig();
  const request = { headers: new Map() };
  const customerToken = {};
  headersConfig.basicApiHeaders(request, customerToken);
  expect(request.headers.get('Authorization')).toBeUndefined();
});

test('generates a basic auth header', ({ expect }) => {
  const headersConfig = new HeadersConfig();
  const credentials = 'username:password';
  const result = headersConfig.basicAuthHeader(credentials);
  expect(result).toBe('Basic ' + Buffer.from(credentials).toString('base64'));
});
