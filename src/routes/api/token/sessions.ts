import { IRequest, IResponse, RequestMethod, Route } from '../../../core/api';
import { RefreshToken } from '../../../db/entities/RefreshToken';
import authentication from "../../../middlewares/authentication";

/** GET /api/token/sessions */
export default class extends Route {
  url = '/api/token/sessions';
  method = RequestMethod.GET;
  async = true;
  middlewares = [
    authentication({ required: true }),
  ];

  async onRequest(req: IRequest<any, Body>, res: IResponse) {
    const { user, fingerprint } = req;
    
    const tokens = await RefreshToken.find({
      where: {
        userId: user.id,
        invalidated: false,
      },
      relations: ['fingerprint'],
    });

    const sessions = tokens.map(t => (
      { 
        fingerprint: t.fingerprint, 
        current: fingerprint.id === t.fingerprint.id,
        createdAt: t.createdAt 
      }
    ));
    res.status(200).json({ sessions });
  }
};
