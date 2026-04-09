/**
 * True on development
 */
export const __DEV__ = process.env.NODE_ENV === 'development';

export const __PROD__ = process.env.NODE_ENV !== "development";

/**
 * True if running only on this laptop
 */
export const __LOCAL__ = process.env.NEXT_PUBLIC_LOCAL === 'true';