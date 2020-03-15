import { IRequest, IResponse, RequestMethod, Route } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { UserPermission, User } from "../../../db/entities/User";
import { check } from "express-validator";
import { Like } from "typeorm";
import { buildOptionalQuery } from "../../../util/database";

interface Query {
  username?: string;
  id?: string;
  skip?: string;
  take?: string;
}

/** GET /api/users */
export default class extends Route {
  url = '/api/users';
  method = RequestMethod.GET;
  async = true;
  validation = [
    check('username').optional().isString().notEmpty(),
    check('id').optional().isInt(),
    check('offset').optional().isInt(),
    check('limit').optional().isInt(),
  ];
  middlewares = [
    authentication({ required: true, permissions: [UserPermission.MANAGE_USERS] }),
  ];

  async onRequest(req: IRequest, res: IResponse) {
    const dbQuery = buildOptionalQuery(req.query, 
      {
        skip: v => parseInt(v), 
        take: v => parseInt(v),
        where: {
          username: v => Like(v),
          id: v => parseInt(v),
        }
      }
    );
  
    const users = await User.find(dbQuery) as User[];
    res.status(200).json({ users: users.map(v => v.getPublicData()) });
  }
};
