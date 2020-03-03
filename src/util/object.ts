export const pick = <T = Object>(obj: T, fields: (keyof T)[]) => {
  const o: Partial<T> = {};
  fields.forEach(f => o[f] = obj[f]);
  return o;
};
