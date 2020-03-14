import { FindManyOptions } from "typeorm";

export const buildOptionalQuery = <T>(q, params) => {
  const query = {};

  Object.keys(params).forEach((k) => {
    const value = q[k];
    const fn = params[k];

    if (value != null) {
      const fnType = typeof(fn);
      if (fnType === 'function') { query[k] = fn(value); } 
      else if (fnType === 'object') { query[k] = buildOptionalQuery(q, fn); } 
      else { query[k] = fn; }
    }
  });

  return query as FindManyOptions<T>;
};