import randomString from 'crypto-random-string';

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
  method: 'delete',
  async: true,
  validation: [
    check('username').isString().notEmpty(),
  ],
  middlewares: [authentication({ required: true, permissions: [UserPermission.MANAGE_USERS] })],
};

/** PUT /api/users */
export default async (req: IRequest, res: IResponse) => {
  const { username } = req.body as Body;
  
  if (req.user.username === username) {
    throw new RequestError('User cannot delete themself', 400);
  }

  const result = await User.delete({ username });

  if (result.affected === 0) {
    throw new RequestError('User with given username was not found', 404);
  }

  res.status(200).send();
};
