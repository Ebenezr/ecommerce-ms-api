import isPlainObject from 'lodash/isPlainObject';
import camelCase from 'lodash/camelCase';
import keys from 'lodash/keys';
import isEmpty from 'lodash/isEmpty';

const convertKeys = (data: any): any => {
  // handle simple types
  if (!isPlainObject(data) && !Array.isArray(data)) {
    return data;
  }

  if (isPlainObject(data) && !isEmpty(data)) {
    const keysToConvert = keys(data);
    keysToConvert.forEach((key: string) => {
      // eslint-disable-next-line no-param-reassign
      data[camelCase(key)] = convertKeys(data[key]);

      // remove snake_case key
      if (camelCase(key) !== key) {
        // eslint-disable-next-line no-param-reassign
        delete data[key];
      }
    });
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      // eslint-disable-next-line no-param-reassign
      data[index] = convertKeys(item);
    });
  }

  return data;
};

export default convertKeys;
