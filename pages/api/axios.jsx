import axios from "axios";
import { AsyncStorage } from "react-native";

const axiosAPI = axios.create({
  //   baseURL: "https://royalty.hiumanlab.com/",
  baseURL: "http://demo.localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAPI.interceptors.request.use(
  async function (config) {
    let item = await AsyncStorage.getItem("user");
    let object = JSON.parse(item);

    let token = "";

    if (object) {
      token = object.token;
    }

    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosAPI;
