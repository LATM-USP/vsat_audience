export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

/**
 * Takes an object type and makes the hover overlay more readable.
 *
 * https://www.totaltypescript.com/concepts/the-prettify-helper
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
