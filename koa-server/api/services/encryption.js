import crypto from 'crypto';
import util from 'util';

const pbkdf2 = util.promisify(crypto.pbkdf2);

export default {
  async encrypt(string, iteration = 64) {
    const salt = crypto.randomBytes(iteration).toString('base64');
    const hash = (await pbkdf2(string, salt, iteration, iteration, 'sha512')).toString('base64');

    return { hash, salt };
  },
  async validate(string, hash, salt, iteration = 64) {
    const value = (await pbkdf2(string, salt, iteration, iteration, 'sha512')).toString('base64');

    return hash === value;
  },
};

export const encryptSync = (string, iteration = 64) => {
  const salt = crypto.randomBytes(iteration).toString('base64');
  const hash = crypto.pbkdf2Sync(string, salt, iteration, iteration, 'sha512').toString('base64');

  return { hash, salt };
};
