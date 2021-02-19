import axios from "axios";
import cookie from "js-cookie";
export const domainApi = process.browser
  ? process.env.NEXT_PUBLIC_API_BASE_URL
  : process.env.API_BASE_URL;
//export const domainApi = production?"https://khonnect.khor2.com":"https://khonnect.hiumanlab.com";
//export const clientId = production?"5f5c0425c46dc9e9198d8bca":"5f417a53c37f6275fb614104";
//export const clientId = process.browser ? process.env.NEXT_PUBLIC_CLIENT_ID : process.env.CLIENT_ID;
// export const domainApi = "http://localhost:8000/kuiz/";
//prod?'https://humand.kuiz.khor2.com':'https://humand.kuiz.hiumanlab.com';
let config = {
  baseURL: domainApi,
  headers: { "Content-Type": "application/json", "Accept-Language": "en" },
};

const axiosApi = axios.create(config);

axiosApi.interceptors.request.use(
  async function (config) {
    let token = JSON.parse(cookie.get("token"));
    config.headers.khonnect_id = token.user_id;
    const ct = "content-type"
    
    return config;
  },
  function (error) {
    console.log("error-axios", error.response);
    return Promise.reject(error);
  }
);

export default axiosApi;
