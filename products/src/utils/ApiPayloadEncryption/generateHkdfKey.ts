import hkdf from 'futoin-hkdf';

interface HkdfOptions {
  salt?: string | Buffer | undefined;
  info: string;
  hash: string;
}

const generateHkdfKey = (
  ikm: string,
  length: number,
  salt: string | Buffer | undefined | null,
  info: string = '',
  hash: string = 'SHA-256'
): Buffer => {
  const options: HkdfOptions = {
    salt: salt ? salt.toString() : undefined,
    info,
    hash,
  };
  return hkdf(ikm, length, options);
};

export { generateHkdfKey };
