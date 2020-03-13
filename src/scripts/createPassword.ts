import '../requirements';
import { hashPassword } from '../util/security';

const password = process.env.PASSWORD;
hashPassword(password)
  .then(v => console.log(`Plain Password: ${password}\nHashed Password: ${v.hash}\nSalt: ${v.salt}`))
  .catch(e => console.error(`Failed to generate a password`, e));
