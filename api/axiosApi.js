import axios from "axios";

export const domainKuiz = process.browser
  ? process.env.NEXT_PUBLIC_APP_ASSESSMENT_BASE_FRONT
  : process.env.FRONT_BASE_URL_KUIZ;

export const API_YNL = process.browser
    ? process.env.NEXT_PUBLIC_API_YNL
    : process.env.API_YNL;

export const domainApi = process.browser
  ? process.env.NEXT_PUBLIC_API_BASE_URL_TENANT
  : process.env.API_BASE_URL_TENANT;

let tenant = "demo";

if (process.browser) {
  let splitDomain = window.location.hostname.split(".");
  if (splitDomain.length > 0) {
    tenant = splitDomain[0];
  }
}

export const typeHttp = process.browser
  ? process.env.NEXT_PUBLIC_USE_HTTPS
  : process.env.USE_HTTPS;
export const domainApiWithTenant = `${tenant}.${domainApi}`;
export const tenant_ = tenant

export const config = {
  baseURL: `${typeHttp}://${domainApiWithTenant}/`,
  // baseURL: domainApi,
  headers: { "Content-Type": "application/json" },
};

export const axiosApi = axios.create(config);

axiosApi.interceptors.response.use(
  async function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosApi;
