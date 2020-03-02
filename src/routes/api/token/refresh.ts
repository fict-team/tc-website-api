import { IRequest, IResponse } from '../../../core/api';
import { check } from 'express-validator';
import { RefreshToken } from '../../../db/entities/RefreshToken';
import { User } from '../../../db/entities/User';
import { RequestError } from '../../../util/errors';
import { createTokenPair, invalidateToken } from '../../../core/jwt';

interface Body {
  refresh_token: string;
};

export const validation = [
  check('refresh_token').notEmpty(),
];

/** POST /api/token/refresh */
export default async (req: IRequest, res: IResponse) => {
  const { refresh_token } = req.body as Body;

  const rtoken = await RefreshToken.findOne({ token: refresh_token, invalidated: false });
  if (!rtoken) { throw new RequestError('This token is invalid or expired.', 400); }

  const user = await User.findOne({ id: rtoken.userId });
  if (!user) { throw new RequestError('Token was issued to a user that does not exist now.', 404); }

  await invalidateToken({ userId: user.id, invalidated: false });

  const { access, refresh } = await createTokenPair(
    {
      id: user.id,
      username: user.username,
      permissions: user.permissions,
    }
  );

  res.status(200).json({ access_token: access, refresh_token: refresh });
};
