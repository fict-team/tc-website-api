import { IRequest, IResponse, IRouteDescription } from "../../core/api";
import authentication from "../../middlewares/authentication";

export const description: IRouteDescription = {
  url: '/api/test',
  method: 'get',
  async: true,
  middlewares: [authentication()],
};

/** POST /api/token */
export default async (req: IRequest, res: IResponse) => {
  console.log(req.user);
  res.status(200).json({ user: req.user });
};
