import { test } from 'vitest';
import getTimeStamp from '../src/utils/getTimeStamp';

test('returns a timestamp in the format YYYY-MM-DDTHH:mm:ss', ({ expect }) => {
  const result = getTimeStamp();
  expect(result).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
});

test('returns the current date and time', ({ expect }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDate = date < 10 ? `0${date}` : date;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const expected = `${year}-${formattedMonth}-${formattedDate}T${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  const result = getTimeStamp();
  expect(result).toBe(expected);
});
