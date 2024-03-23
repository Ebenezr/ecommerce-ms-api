import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import amqplib from 'amqplib';
import {
  APP_SECRET,
  EXCHANGE_NAME,
  CUSTOMER_SERVICE,
  MSG_QUEUE_URL,
} from '../config';

//Utility functions
export const GenerateSalt = async (): Promise<string> => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (
  password: string,
  salt: string
): Promise<string> => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
): Promise<boolean> => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (
  payload: string | object | Buffer
): string => {
  return jwt.sign(payload, APP_SECRET!, { expiresIn: '1d' });
};

export const ValidateSignature = async (req: any): Promise<boolean> => {
  const signature = req.get('Authorization');

  if (signature) {
    const payload = await jwt.verify(
      signature.split(' ')[1],
      APP_SECRET as string
    );
    req.user = payload;
    return true;
  }

  return false;
};

export const FormateData = (data: any): { data: any } | never => {
  if (data) {
    return { data };
  } else {
    throw new Error('Data Not found!');
  }
};

//Message Broker
export const CreateChannel = async (): Promise<any> => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL!);
    const channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME!, { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

export const PublishMessage = (
  channel: any,
  service: string,
  msg: string
): void => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
};
