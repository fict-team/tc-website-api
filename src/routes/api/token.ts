import { IRequest, IResponse } from '../../core/api';
import { check } from 'express-validator';
import { User } from '../../db/entities/User';
import { hashPassword } from '../../util/security';
import { RequestError } from '../../util/errors';
import { createTokenPair } from '../../core/jwt';

interface Body {
  username: string;
  password: string;
};

export const validation = [
  check('username').notEmpty(),
  check('password').notEmpty(),
];

/** POST /api/token */
export default async (req: IRequest, res: IResponse) => {
  const { username, password } = req.body as Body;
  const user = await User.findOne({ username });
  const { hash } = await hashPassword(password, user?.salt);
  const correctPassword = user?.password === hash;

  if (!correctPassword) {
    throw new RequestError('User with given username and password was not found.', 404);
  }

  const { access, refresh } = await createTokenPair(
    {
      id: user.id,
      username: user.username,
      permissions: user.permissions,
    }, 
    hash
  );

  res.status(200).json({ access_token: access, refresh_token: refresh });
};
