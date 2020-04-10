import { IRequest, IResponse, RequestMethod, Route } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { UserPermission, User } from "../../../db/entities/User";
import { check } from "express-validator";
import { RequestError } from '../../../util/errors';
import { generatePassword } from '../../../util/security';

interface Body {
  username: string;
  email?: string;
  permissions: UserPermission[];
}

/** PUT /api/users */
export default class extends Route {
  url = '/api/users';
  method = RequestMethod.PUT;
  async = true;
  validation = [
    check('username').isString().notEmpty(),
    check('email').optional({ nullable: true }).isEmail(),
    check('permissions')
      .isArray()
      .custom((arr: string[]) => arr.every(v => typeof(v) === 'string' && UserPermission[v]))
      .withMessage('Invalid permissions'),
  ];
  middlewares = [
    authentication({ required: true, permissions: [UserPermission.MANAGE_USERS] }),
  ];

  async onRequest(req: IRequest<any, Body>, res: IResponse) {
    const { username, permissions, email } = req.body;

    if (await User.findOne({ username })) { 
      throw new RequestError('User with given username already exists', 409); 
    }

    const password = generatePassword();
    const user = await User.make({ 
      username, 
      password,
      email,
      permissions, 
      createdBy: req.user.id,
    });

    await user.save();

    res.status(200).json({
      user: {
        id: user.id,
        username,
        email,
        password,
        permissions,
      },
    });
  }
}
