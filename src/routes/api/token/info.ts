import { IRequest, IResponse, RequestMethod, Route } from "../../../core/api";
import authentication from "../../../middlewares/authentication";

/** GET /api/token/info */
export default class extends Route {
  url = '/api/token/info';
  method = RequestMethod.GET;
  async = true;
  middlewares = [
    authentication({ required: true }),
  ];

  onRequest(req: IRequest, res: IResponse) {
    res.status(200).json({ user: req.user.getPublicData() });
  }
};
