import { test } from 'vitest';
import errorHandler from '../src/utils/errorHandler';

test('returns the customer message for known errors', ({ expect }) => {
  const message = 'Known error message';
  const result = errorHandler(message);
  expect(result).toBe('Known error message');
});

test('returns the input string for "does not exist" errors', ({ expect }) => {
  const message = 'User does not exist';
  const result = errorHandler(message);
  expect(result).toBe(message);
});

test('returns a network timeout message for "network timeout" errors', ({
  expect,
}) => {
  const message = 'network timeout';
  const result = errorHandler(message);
  expect(result).toBe(
    'Dear Customer, we are unable to complete your request at the moment. Please try again later.'
  );
});

test('returns a technical problem message for server errors', ({ expect }) => {
  const message = 500;
  const result = errorHandler(message);
  expect(result).toBe(
    'Sorry we are experiencing a technical problem. Please try again later'
  );
});

test('returns the input message for other errors', ({ expect }) => {
  const message = 'Some error message';
  const result = errorHandler(message);
  expect(result).toBe(message);
});
