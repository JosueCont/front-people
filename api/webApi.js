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

  static saveJwt(data) {
    return WebApi.ApisType(`/person/person/save_person_jwt/`, "post", data);
  }

  static getCompanys() {
    return WebApi.ApisType(`/business/node/`, "post");
  }

  static getGeneralConfig() {
    return WebApi.ApisType(`/setup/site-configuration/`, "get");
  }
}

export default WebApi;
