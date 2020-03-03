import { IRequest, IResponse, IRouteDescription } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { UserPermission, User } from "../../../db/entities/User";
import { check } from "express-validator";
import { RequestError } from '../../../util/errors';
import { generatePassword, hashPassword } from "../../../util/security";
import { invalidateToken } from "../../../core/jwt";

interface Body {
  username: string;
}

export const description: IRouteDescription = {
  url: '/api/passwords/reset',
  method: 'post',
  async: true,
  validation: [
    check('username').isString().notEmpty(),
  ],
  middlewares: [authentication({ required: true, permissions: [UserPermission.MANAGE_USERS] })],
};

/** POST /api/passwords/reset */
export default async (req: IRequest, res: IResponse) => {
  const { username } = req.body as Body;
  const user = await User.findOne({ username });

  if (!user) {
    throw new RequestError('User with given username was not found', 404);
  }

  const password = generatePassword();
  const { hash, salt } = await hashPassword(password);
  
  user.password = hash;
  user.salt = salt;

  await user.save();
  await invalidateToken({ userId: user.id, invalidated: false });

  res.status(200).json({ password });
};
