import bcrypt from 'bcrypt';

const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 12;
const secret = process.env.SECRET;

export const hashPassword = async (password: string, salt: string = null) => {
  salt = salt ?? await bcrypt.genSalt(saltRounds);
  const firstPass = await bcrypt.hash(password, salt);
  
  return {
    salt,
    hash: await bcrypt.hash(firstPass, secret),
  };
};
