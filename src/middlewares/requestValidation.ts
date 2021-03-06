import { validationResult } from "express-validator";
import { RequestError } from "../util/errors";

export default () => (req, _, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) { return next(); }  
  next(new RequestError('Request is incorrect or incomplete', 400, errors.array().map(e => `${e.msg} in '${e.param}' - ${e.value}`)));
};