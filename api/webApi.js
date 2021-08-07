import axiosApi from "./axiosApi";

class WebApi {
  static ApisType = (url, method = "post", params = {}) => {
    switch (method) {
      case "post":
        return axiosApi.post(url, params);
        break;
      case "put":
        return axiosApi.put(url, params);
        break;
      case "get":
        return axiosApi.get(url);
        break;
      case "delete":
        return axiosApi.delete(url);
        break;
    }
  };

  static login() {
    return WebApi.ApisType(`/setup/general-config/`, "get");
  }
}

export default WebApi;
