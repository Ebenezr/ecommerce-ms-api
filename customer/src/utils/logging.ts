const { createLogger, format } = require('winston');
const DailyLog = require('winston-daily-rotate-file');
const _ = require('lodash');
const config = require('dotenv');
const WinstonCloudWatch = require('winston-cloudwatch');
const getTimeStamp = require('./getTimestamp');

const { combine, timestamp, label, printf } = format;

config.config();
const configValues = process.env;

const logStringBuilder = (meta: any, message: any, level: any) => {
  let logString = `${getTimeStamp()}|message=${message}|level=${level}`;

  if ('url' in meta) {
    logString = `${logString}|url=${meta.url}`;
    delete meta.url;
  }

  if ('request' in meta) {
    logString = `${logString}|request=${meta.request}`;
    delete meta.request;
  }

  if ('email' in meta) {
    logString = `${logString}|email=${meta.email}`;
    delete meta.email;
  }

  if ('technicalMessage' in meta) {
    logString = `${logString}|technicalMessage=${meta.technicalMessage}`;
    delete meta.technicalMessage;
  }
  // Add customer error
  const selectableErrors = [
    'customerMessage',
    'customError',
    'message',
    'actualError',
    'systemError',
    'payload',
  ];
  const pipeSpecial = (errors: any, depth = 0) => {
    if (depth > 10) {
      return;
    }

    _.forOwn(errors, (value: any, key: any) => {
      if (typeof value === 'object') {
        pipeSpecial(value, depth + 1);
      } else if (selectableErrors.indexOf(key) >= 0) {
        logString = `${logString}|${key} =${value}`;
      }
    });
  };
  pipeSpecial(meta);

  logString = `${logString}\n`;

  return logString;
};

const timezoned = () =>
  new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Nairobi',
  });

const logFormat = printf(
  ({ level, message, ...meta }: any) =>
    `${logStringBuilder(meta, message, level)}`
);

const logFilePath = configValues.LOGGING_PATH;
let Logger: any;
let transport;
if (configValues.ENVIRONMENT === 'fileBased') {
  Logger = createLogger({
    transports: [
      new DailyLog({
        filename: logFilePath,
        datePattern: 'YYYY-MM-DD',
      }),
    ],
    format: combine(
      label({ label: 'Masoko Server' }),
      timestamp({
        format: timezoned,
      }),
      logFormat
    ),
  });
}

if (configValues.ENVIRONMENT === 'aws') {
  Logger = createLogger({
    transports: [
      new WinstonCloudWatch({
        awsOptions: {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
          region: process.env.AWS_REGION,
        },
        logGroupName: process.env.CLOUDWATCH_LOG_GROUP_NAME,
        logStreamName: `${process.env.CLOUDWATCH_LOG_GROUP_NAME}-${process.env.NODE_ENV}`,
        jsonMessage: true,
        messageFormatter: ({ level, message, ...meta }: any) =>
          `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(meta)}}`,
      }),
    ],
  });
}

export { Logger, logStringBuilder };
