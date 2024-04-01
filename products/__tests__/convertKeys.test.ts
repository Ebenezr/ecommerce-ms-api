import { test } from 'vitest';
import convertKeys from '../src/utils/convertKeys';

test('converts object keys from snake_case to camelCase', ({ expect }) => {
  const data = { first_name: 'John', last_name: 'Doe' };
  const result = convertKeys(data);
  expect(result).toEqual({ firstName: 'John', lastName: 'Doe' });
});

test('converts nested object keys from snake_case to camelCase', ({
  expect,
}) => {
  const data = { user_info: { first_name: 'John', last_name: 'Doe' } };
  const result = convertKeys(data);
  expect(result).toEqual({ userInfo: { firstName: 'John', lastName: 'Doe' } });
});

test('converts array items from snake_case to camelCase', ({ expect }) => {
  const data = [
    { first_name: 'John', last_name: 'Doe' },
    { first_name: 'Jane', last_name: 'Doe' },
  ];
  const result = convertKeys(data);
  expect(result).toEqual([
    { firstName: 'John', lastName: 'Doe' },
    { firstName: 'Jane', lastName: 'Doe' },
  ]);
});

test('returns the input unchanged if it is not an object or array', ({
  expect,
}) => {
  const data = 'John Doe';
  const result = convertKeys(data);
  expect(result).toBe(data);
});
