import { test } from 'vitest';
import removeWhiteSpaces from '../src/utils/removeWhiteSpaces';

test('removes all white spaces from a string', ({ expect }) => {
  const string = 'Hello, world!';
  const result = removeWhiteSpaces(string);
  expect(result).toBe('Hello,world!');
});

test('returns the input unchanged if it does not contain white spaces', ({
  expect,
}) => {
  const string = 'Hello,world!';
  const result = removeWhiteSpaces(string);
  expect(result).toBe(string);
});
