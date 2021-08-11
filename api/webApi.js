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

  static getGeneralConfig() {
    return WebApi.ApisType(`/setup/site-configuration/`, "get");
  }

  static saveJwt(data) {
    return WebApi.ApisType(`/person/person/save_person_jwt/`, "post", data);
  }

  static getCompanys() {
    return WebApi.ApisType(`/business/node/`, "post");
  }

  static getCompany(data) {
    return WebApi.ApisType(`/business/node/${data}/`, "get");
  }

  static getCompanyPermanentCode(data) {
    return WebApi.ApisType(`/business/node/?permanent_code=${data}`, "get");
  }

  static createPerson(data) {
    return WebApi.ApisType(`/person/person/`, "post", data);
  }

  static getPerson(data) {
    return WebApi.ApisType(`/person/person/${data}/`, "get");
  }

  static updatePerson(data, id) {
    return WebApi.ApisType(`/person/person/${id}/`, "put", data);
  }

  static updatePhotoPerson(data) {
    return WebApi.ApisType(
      `/person/person/update_pthoto_person/`,
      "post",
      data
    );
  }

  static personForKhonnectId(data){ 
    return WebApi.ApisType(`/person/person/person_for_khonnectid/`, "post", data);
  }

  static getJobSelect(data) {
    return WebApi.ApisType(`/person/job/?department=${data}`, "get");
  }
}

export default WebApi;
