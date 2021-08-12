export const API_URL = process.browser
  ? process.env.NEXT_PUBLIC_API_BASE_URL
  : process.env.API_BASE_URL;

export const LOGIN_URL = process.browser
  ? process.env.NEXT_PUBLIC_LOGIN_URL
  : process.env.NEXT_PUBLIC_LOGIN_URL;

export const APP_ID = process.browser
  ? process.env.NEXT_PUBLIC_APP_ID_BASE
  : process.env.NEXT_PUBLIC_APP_ID_BASE;
