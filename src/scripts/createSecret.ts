import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);
console.log(salt);
