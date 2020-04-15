export enum Language {
  ENGLISH = 'en',
  RUSSIAN = 'ru',
  UKRAINIAN = 'ua'
};

export type LocalizedContent<T> = {
  [key in Language]?: T;
};

export const isValidLocalizedContent= <T>(content: LocalizedContent<T>, checkValueFn?: (value: T) => boolean) => {
  return (
    typeof(content) === 'object' 
    && 
    Object.keys(content).every(k => Language[k] && (!checkValueFn || checkValueFn(content[k])))
  );
};
