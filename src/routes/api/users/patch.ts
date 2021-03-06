import { IRequest, IResponse, RequestMethod, Route } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { UserPermission, User, isValidUserPermission } from "../../../db/entities/User";
import { check } from "express-validator";
import { RequestError } from '../../../util/errors';

interface Body {
  username: string;
  email?: string;
  permissions?: UserPermission[];
}

/** PATCH /api/users */
export default class extends Route {
  url = '/api/users';
  method = RequestMethod.PATCH;
  async = true;
  validation = [
    check('username').isString().notEmpty(),
    check('email').optional({ nullable: true }).isEmail(),
    check('permissions')
      .optional({ nullable: true })
      .isArray()
      .custom((arr: string[]) => arr.every(v => isValidUserPermission(v)))
      .withMessage('Invalid permissions'),
  ];
  middlewares = [
    authentication({ required: true, permissions: [UserPermission.MANAGE_USERS] }),
  ];

  async onRequest(req: IRequest<any, Body>, res: IResponse) {
    const { username, permissions, email } = req.body;

    const user = await User.findOne({ username });
    if (!user) { 
      throw new RequestError('User with given username does not exist', 404); 
    }

    if (permissions != null) {
      user.permissions = permissions;
    }

    if (email != null) {
      user.email = email;
    }

    user.updatedAt = new Date();

    await user.save();

    res.status(200).json({
      user: {
        id: user.id,
        username,
        email: user.email,
        permissions: user.permissions,
      },
    });
  }
};
