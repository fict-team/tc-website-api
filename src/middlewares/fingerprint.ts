import { IRequest } from "../core/api";
import { Fingerprint } from "../db/entities/Fingerprint";

export default () => async (req: IRequest, _, next) => {
  req.fingerprint = Fingerprint.make(req);
  next();
};
