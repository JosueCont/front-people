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
    return WebApi.ApisType(`/business/node/`, "get");
  }

  static getCompany(data) {
    return WebApi.ApisType(`/business/node/${data}/`, "get");
  }

  static getCompanyPermanentCode(data) {
    return WebApi.ApisType(`/business/node/?permanent_code=${data}`, "get");
  }

  static filterDepartmentByNode(data) {
    return WebApi.ApisType(`/business/department/?node=${data}`, "get");
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
  
  static filterPerson(data) {
    return WebApi.ApisType(`/person/person/get_list_persons/`, "post", data);
  }

  static getPhone(data) {
    return WebApi.ApisType(`/person/person/${data}/phone_person/`, "get");
  }

  static createPhone(data) {
    return WebApi.ApisType(`/person/phone/`, "post", data);
  }

  static updatePhone(data) {
    return WebApi.ApisType(`/person/phone/${data.id}/`, "put", data);
  }

  static deletePhone(data) {
    return WebApi.ApisType(`/person/phone/${data}/`, "delete");
  }

  static getAddress(data) {
    return WebApi.ApisType(`/person/person/${data}/address_person/`, "get");
  }

  static createAddress(data) {
    return WebApi.ApisType(`/person/address/`, "post", data);
  }

  static updateAddress(id, data) {
    return WebApi.ApisType(`/person/address/${id}/`, "put", data);
  }

  static getFamily(data) {
    return WebApi.ApisType(`/person/person/${data}/family_person/`, "get");
  }

  static createFamily(data) {
    return WebApi.ApisType(`/person/family/`, "post", data);
  }

  static updateFamily(data) {
    return WebApi.ApisType(`/person/family/${data.id}/`, "put", data);
  }

  static deleteFamily(data) {
    return WebApi.ApisType(`/person/family/${data}/`, "delete");
  }

  static getRelationShip(data) {
    return WebApi.ApisType(`/setup/relationship/`, "get");
  }

  static getContactEmergency(data) {
    return WebApi.ApisType(
      `/person/person/${data}/contact_emergency_person/`,
      "get"
    );
  }

  static createContactEmergency(data) {
    return WebApi.ApisType(`/person/contact-emergency/`, "post", data);
  }

  static updateContactEmergency(data) {
    return WebApi.ApisType(
      `/person/contact-emergency/${data.id}/`,
      "put",
      data
    );
  }

  static deleteContactEmergency(data) {
    return WebApi.ApisType(`/person/contact-emergency/${data}/`, "delete");
  }

  static getBank(data) {
    return WebApi.ApisType(`/setup/bank/`, "get");
  }

  static getBankAccount(data) {
    return WebApi.ApisType(`/person/bank-account/?person=${data}`, "get");
  }

  static createBankAccount(data) {
    return WebApi.ApisType(`/person/bank-account/`, "post", data);
  }

  static updateBankAccount(data) {
    return WebApi.ApisType(`/person/bank-account/${data.id}/`, "put", data);
  }

  static deleteBankAccount(data) {
    return WebApi.ApisType(`/person/bank-account/${data}/`, "delete");
  }

  static getGeneralDataPerson(data) {
    return WebApi.ApisType(`/person/person/${data}/general_person/`, "get");
  }

  static createGeneralDataPerson(data) {
    return WebApi.ApisType(`/person/general-person/`, "post", data);
  }

  static updateGeneralDataPerson(id, data) {
    return WebApi.ApisType(`/person/general-person/${id}/`, "put", data);
  }
}

export default WebApi;
