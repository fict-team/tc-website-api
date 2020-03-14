import { IRequest, IResponse, IRouteDescription } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { UserPermission, User } from "../../../db/entities/User";
import { check } from "express-validator";
import { RequestError } from '../../../util/errors';

interface Body {
  username: string;
  permissions: UserPermission[];
}

export const description: IRouteDescription = {
  url: '/api/users',
  method: 'patch',
  async: true,
  validation: [
    check('username').isString().notEmpty(),
    check('permissions')
      .isArray()
      .custom((arr: string[]) => arr.every(v => typeof(v) === 'string' && UserPermission[v]))
      .withMessage('Invalid permissions'),
  ],
  middlewares: [authentication({ required: true, permissions: [UserPermission.MANAGE_USERS] })],
};

/** PATCH /api/users */
export default async (req: IRequest, res: IResponse) => {
  const { username, permissions } = req.body as Body;

  const user = await User.findOne({ username });
  if (!user) { 
    throw new RequestError('User with given username does not exist', 404); 
  }

  user.permissions = permissions;
  user.updatedAt = new Date();

  await user.save();

  res.status(200).json({
    user: {
      id: user.id,
      username,
      permissions,
    },
  });
};
