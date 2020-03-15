import { IRequest, IResponse, RequestMethod, Route } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { UserPermission, User } from "../../../db/entities/User";
import { check } from "express-validator";
import { RequestError } from '../../../util/errors';

interface Body {
  username: string;
  permissions: UserPermission[];
}

/** PATCH /api/users */
export default class extends Route {
  url = '/api/users';
  method = RequestMethod.PATCH;
  async = true;
  validation = [
    check('username').isString().notEmpty(),
    check('permissions')
      .isArray()
      .custom((arr: string[]) => arr.every(v => typeof(v) === 'string' && UserPermission[v]))
      .withMessage('Invalid permissions'),
  ];
  middlewares = [
    authentication({ required: true, permissions: [UserPermission.MANAGE_USERS] }),
  ];

  async onRequest(req: IRequest, res: IResponse) {
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
  }
};
