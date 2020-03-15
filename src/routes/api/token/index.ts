import { IRequest, IResponse, RequestMethod, Route } from '../../../core/api';
import { check } from 'express-validator';
import { User } from '../../../db/entities/User';
import { hashPassword } from '../../../util/security';
import { RequestError } from '../../../util/errors';
import { createTokenPair, invalidateToken } from '../../../core/jwt';

interface Body {
  username: string;
  password: string;
};

/** POST /api/token */
export default class extends Route {
  url = '/api/token';
  method = RequestMethod.POST;
  async = true;
  validation = [
    check('username').notEmpty(),
    check('password').notEmpty(),
  ];

  async onRequest(req: IRequest, res: IResponse) {
    const { username, password } = req.body as Body;
    const user = await User.findOne({ username });
    const { hash } = await hashPassword(password, user?.salt);
    const correctPassword = user?.password === hash;

    if (!correctPassword) {
      throw new RequestError('User with given username and password was not found.', 404);
    }

    await invalidateToken({ userId: user.id, invalidated: false });

    const { access, refresh } = await createTokenPair(
      {
        id: user.id,
        username: user.username,
        permissions: user.permissions,
      }
    );

    res.status(200).json({ access_token: access, refresh_token: refresh });
  }
};
