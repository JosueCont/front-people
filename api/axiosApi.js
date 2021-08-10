import axios from "axios";

export const domainApi = process.browser
  ? process.env.NEXT_PUBLIC_API_BASE_URL
  : process.env.API_BASE_URL;

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

// const domainApiWithTenant = `${tenant}.${domainApi}`;
const domainApiWithTenant = `${domainApi}`;
export const config = {
  // baseURL: `${typeHttp}://${domainApiWithTenant}/`,
  baseURL: `${domainApiWithTenant}/`,
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
