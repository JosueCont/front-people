export const API_URL = process.browser
  ? process.env.NEXT_PUBLIC_API_BASE_URL
  : process.env.API_BASE_URL;

export const API_URL_TENANT = process.browser
  ? process.env.NEXT_PUBLIC_API_BASE_URL_TENANT
  : process.env.API_BASE_URL_TENANT;

export const LOGIN_URL = process.browser
  ? process.env.NEXT_PUBLIC_LOGIN_URL
  : process.env.NEXT_PUBLIC_LOGIN_URL;

export const APP_ID = process.browser
  ? process.env.NEXT_PUBLIC_APP_ID_BASE
  : process.env.NEXT_PUBLIC_APP_ID_BASE;

export const API_ASSESSMENT = process.browser
  ? process.env.NEXT_PUBLIC_APP_ASSESSMENT_BASE
  : process.env.NEXT_PUBLIC_APP_ASSESSMENT_BASE;
