import { FindManyOptions, FindConditions } from "typeorm";

export const buildOptionalQuery = <T>(q, params, where) => {
  const query: FindManyOptions<T> = { where: {} };

  Object.keys(params).forEach((k) => {
    const value = q[k];
    const fn = params[k];
    if (value != null) {
      query[k] = typeof(fn) === 'function' ? fn(value) : fn; 
    }
  });

  Object.keys(where).forEach((k) => {
    const value = q[k];
    const fn = where[k];
    if (value != null) {
      query.where[k] = typeof(fn) === 'function' ? fn(value) : fn; 
    }
  });

  return query;
};