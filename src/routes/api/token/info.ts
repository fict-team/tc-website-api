import { IRequest, IResponse, IRouteDescription } from "../../../core/api";
import authentication from "../../../middlewares/authentication";

export const description: IRouteDescription = {
  url: '/api/token/info',
  method: 'get',
  async: true,
  middlewares: [authentication({ required: true })],
};

/** POST /api/token/info */
export default async (req: IRequest, res: IResponse) => {
  res.status(200).json({ user: req.user.getPublicData() });
};
