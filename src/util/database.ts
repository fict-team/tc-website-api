import { FindManyOptions } from "typeorm";

export const buildOptionalQuery = <T>(q, params) => {
  const query = {};

  Object.keys(params).forEach((k) => {
    const value = q[k];
    const fn = params[k];
    const fnType = typeof(fn);

    if (value != null) {
      if (fnType === 'function') { query[k] = fn(value); } 
      else { query[k] = fn; }
    } else if (fnType === 'object') {
      query[k] = buildOptionalQuery(q, fn);
    }
  });

  return query as FindManyOptions<T>;
};