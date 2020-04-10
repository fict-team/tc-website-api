import { IRequest, IResponse, RequestMethod, Route } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { check } from "express-validator";
import { hashPassword } from "../../../util/security";
import { createTokenPair, invalidateToken } from "../../../core/jwt";
import { RequestError } from "../../../util/errors";

interface Body {
  old_password: string;
  password: string;
}

/** PATCH /api/passwords */
export default class extends Route {
  url = '/api/passwords';
  method = RequestMethod.PATCH;
  async = true;
  validation = [
    check('old_password').isString().notEmpty(),
    check('password').isString().isLength({ min: 8 }),
  ];
  middlewares = [
    authentication({ required: true }),
  ];

  async onRequest(req: IRequest<any, Body>, res: IResponse) {
    const { old_password, password } = req.body;
    const { user } = req;

    const { hash: oldHash } = await hashPassword(old_password, user.salt);
    const correctPassword = user?.password === oldHash;

    if (!correctPassword) {
      throw new RequestError('Incorrect password', 401);
    }

    const { hash, salt } = await hashPassword(password);

    user.password = hash;
    user.salt = salt;

    await user.save();
    await invalidateToken({ userId: user.id, invalidated: false });

    const { access, refresh } = await createTokenPair(
      {
        id: user.id,
        username: user.username,
        permissions: user.permissions,
      },
      req.fingerprint
    );

    res.status(200).json({
      access_token: access,
      refresh_token: refresh,
    });
  }
};

