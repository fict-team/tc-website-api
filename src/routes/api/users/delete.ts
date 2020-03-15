import { IRequest, IResponse, Route, RequestMethod } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { UserPermission, User } from "../../../db/entities/User";
import { check } from "express-validator";
import { RequestError } from '../../../util/errors';

interface Body {
  username: string;
}

/** DELETE /api/users */
export default class extends Route {
  url = '/api/users';
  method = RequestMethod.DELETE;
  async = true;
  validation = [
    check('username').isString().notEmpty(),
  ];
  middlewares = [
    authentication({ required: true, permissions: [UserPermission.MANAGE_USERS] }),
  ];

  async onRequest(req: IRequest, res: IResponse) {
    const { username } = req.body as Body;
  
    if (req.user.username === username) {
      throw new RequestError('User cannot delete themself', 400);
    }

    const result = await User.delete({ username });

    if (result.affected === 0) {
      throw new RequestError('User with given username was not found', 404);
    }

    res.status(200).send();
  }
}
