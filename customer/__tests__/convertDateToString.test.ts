import { test } from 'vitest';
import convertDateToString from '../src/utils/convertDateToString';

test('converts a date to a string in the format YYYY-MM-DD', ({ expect }) => {
  const date = new Date(2022, 0, 1); // January 1, 2022
  const result = convertDateToString(date);
  expect(result).toBe('2022-01-01');
});

test('adds leading zeros to the month and day if they are less than 10', ({
  expect,
}) => {
  const date = new Date(2022, 8, 9); // September 9, 2022
  const result = convertDateToString(date);
  expect(result).toBe('2022-09-09');
});
