import { IRequest, IResponse, IRouteDescription } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { check } from "express-validator";
import { hashPassword } from "../../../util/security";
import { createTokenPair, invalidateToken } from "../../../core/jwt";

interface Body {
  password: string;
}

export const description: IRouteDescription = {
  url: '/api/passwords/change',
  method: 'post',
  async: true,
  validation: [
    check('password').isString().isLength({ min: 8 }),
  ],
  middlewares: [authentication({ required: true })],
};

/** POST /api/passwords/reset */
export default async (req: IRequest, res: IResponse) => {
  const { password } = req.body as Body;
  const { hash, salt } = await hashPassword(password);
  const { user } = req;

  user.password = hash;
  user.salt = salt;

  await user.save();
  await invalidateToken({ userId: user.id, invalidated: false });

  const { access, refresh } = await createTokenPair(
    {
      id: user.id,
      username: user.username,
      permissions: user.permissions,
    }
  );

  res.status(200).json({
    access_token: access,
    refresh_token: refresh,
  });
};
