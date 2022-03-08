import axiosApi from "./axiosApi";

class WebApi {
  static ApisType = (url, method = "post", params = {}) => {
    switch (method) {
      case "post":
        return axiosApi.post(url, params);
      case "put":
        return axiosApi.put(url, params);
      case "get":
        return axiosApi.get(url);
      case "delete":
        return axiosApi.delete(url);
      case "patch":
        return axiosApi.patch(url, params);
    }
  };
}

export default WebApi;
