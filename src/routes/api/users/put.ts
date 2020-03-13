import { IRequest, IResponse, IRouteDescription } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { UserPermission, User } from "../../../db/entities/User";
import { check } from "express-validator";
import { RequestError } from '../../../util/errors';
import { generatePassword } from '../../../util/security';

interface Body {
  username: string;
  permissions: UserPermission[];
}

export const description: IRouteDescription = {
  url: '/api/users',
  method: 'put',
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

/** PUT /api/users */
export default async (req: IRequest, res: IResponse) => {
  const { username, permissions } = req.body as Body;

  if (await User.findOne({ username })) { 
    throw new RequestError('User with given username already exists', 409); 
  }

  const password = generatePassword();
  const user = await User.make({ 
    username, 
    password,
    permissions, 
    createdBy: req.user.id,
  });

  await user.save();

  res.status(200).json({
    user: {
      id: user.id,
      username,
      password,
      permissions,
    },
  });
};
