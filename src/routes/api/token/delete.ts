import { IRequest, IResponse, RequestMethod, Route } from '../../../core/api';
import { check } from 'express-validator';
import { RequestError } from '../../../util/errors';
import { invalidateToken } from '../../../core/jwt';
import { Fingerprint } from '../../../db/entities/Fingerprint';
import authentication from "../../../middlewares/authentication";

interface Body {
  fingerprint: string;
};

/** DELETE /api/token */
export default class extends Route {
  url = '/api/token';
  method = RequestMethod.DELETE;
  async = true;
  validation = [
    check('fingerprint').notEmpty(),
  ];
  middlewares = [
    authentication({ required: true }),
  ];

  async onRequest(req: IRequest<any, Body>, res: IResponse) {
    const { fingerprint } = req.body;
    const { user } = req;

    const fp = await Fingerprint.findOne({ id: fingerprint });

    if (!fp) {
      throw new RequestError('Fingerprint was not found', 404);
    }

    await invalidateToken({ userId: user.id, invalidated: false, fingerprint: fp });

    res.status(200).send();
  }
};
