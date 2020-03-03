import { IRequest } from "../core/api";
import { UserPermission, User } from "../db/entities/User";
import { RequestError } from "../util/errors";
import { decode, jwt } from "../core/jwt";

interface IAuthenticationOptions {
  required?: boolean;
  permissions?: UserPermission[];
}

export default (opt: IAuthenticationOptions = {}) => async (req: IRequest, _, next) => {
  const ah = req.headers.authorization ?? '';
  const [type, token] = ah.split(' ');

  // jwt token should be stored in Authorization header
  // format: Bearer <token>
  if (type !== 'Bearer' || !token) {
    if (opt.required) { return next(new RequestError('Not authorized', 401)); }
    return next();
  }

  try {
    const perms = opt.permissions ?? [];
    const data = decode(token);
    const user = await User.findOne({ id: data.id });

    // if at least 1 permission is missing, throw an error
    if (perms.some(p => !user.permissions.find(up => up === p))) {
      return next(new RequestError('Forbidden', 403));
    }

    req.user = user;
  }
  catch (err) {
    return next(new RequestError(`Provided token is ${err instanceof jwt.TokenExpiredError ? 'expired' : 'invalid'}`, 401));
  }
  
  next();
};
