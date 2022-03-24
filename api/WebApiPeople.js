import WebApi from "./webApi";

class WebApiPeople {
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

  static personForKhonnectId(data) {
    return WebApi.ApisType(
      `/person/person/person_for_khonnectid/`,
      "post",
      data
    );
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

  static getRelationShip() {
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
    return WebApi.ApisType(`/setup/banks/`, "get");
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

  static getPersontype(data) {
    return WebApi.ApisType(`/person/person-type/?node=${data}`, "get");
  }

  static getJobs(data) {
    return WebApi.ApisType(`/business/job/?node=${data}`, "get");
  }

  static getCatalogs(model, data) {
    return WebApi.ApisType(`/business/${model}/?node=${data}`, "get");
  }

  static updateRegisterCatalogs(url, data) {
    return WebApi.ApisType(url, "put", data);
  }

  static createRegisterCatalogs(url, data) {
    return WebApi.ApisType(url, "post", data);
  }

  static deleteRegisterCatalogs(url, data) {
    return WebApi.ApisType(url, "delete");
  }

  static getCfdi(data) {
    return WebApi.ApisType(`/payroll/cfdi-payroll`, "post", data);
  }

  static getContractTypes() {
    return WebApi.ApisType(`/fiscal/contract-type/`, "get");
  }

  static getHiringRegimes() {
    return WebApi.ApisType(`/fiscal/hiring-regime/`, "get");
  }

  static getTypeTax() {
    return WebApi.ApisType(`/fiscal/type-tax/`, "get");
  }

  static getBanks() {
    return WebApi.ApisType(`/fiscal/bank/`, "get");
  }

  static getVacationRequest(data) {
    return WebApi.ApisType(`/person/vacation/?${data}`, "get");
  }

  static saveMassiveDepartments(data) {
    return WebApi.ApisType(
      `/business/department/import_departments_xls/`,
      "post",
      data
    );
  }

  static saveMassiveJobs(data) {
    return WebApi.ApisType(`/person/job/import_jobs_xls/`, "post", data);
  }

  static BulkMassivePerson(data) {
    return WebApi.ApisType(
      `/person/bulk-upload-person/upload_xls/`,
      "post",
      data
    );
  }

  static saveMassivePerson(data) {
    return WebApi.ApisType("/person/person/massive_save_person/", "post", data);
  }

  static deactivatePerson(data) {
    return WebApi.ApisType("/person/person/deactivate_by_ids/", "post", data);
  }

  static deletePerson(data) {
    return WebApi.ApisType(`/person/person/delete_by_ids/`, "post", data);
  }

  static getCompaniesPeople(data) {
    return WebApi.ApisType(
      `/business/node-person/get_assignment/?person__id=${data}`,
      "get"
    );
  }

  static assignmentCompanyPerson(url, data) {
    return WebApi.ApisType(`/business/node-person/${url}`, "post", data);
  }

  static deleteNode(data) {
    return WebApi.ApisType("/business/node/" + data + "/", "delete");
  }

  static updateNode(id, data) {
    return WebApi.ApisType("/business/node/" + id + "/", "patch", data);
  }

  static createNode(data) {
    return WebApi.ApisType("/business/node/", "post", data);
  }

  static getNodeTree(data) {
    return WebApi.ApisType(`/business/node/node_in_cascade/`, "post", data);
  }

  static changeStatusNode(id, data) {
    return WebApi.ApisType(`/business/node/id}/`, "put", data);
  }

  static getDocumentPerson(data) {
    return WebApi.ApisType(`/person/person/${data}/document_person/`, "get");
  }

  static deleteDocument(data) {
    return WebApi.ApisType(`/person/document/${data}/`, "delete");
  }

  static getTemplateImportPerson() {
    return WebApi.ApisType(`/person/person/generate_template/`, "get");
  }

  static fiscalInformationNode(type, data = "", url = "") {
    return WebApi.ApisType(`/business/fiscal-information/${url}`, type, data);
  }

  static changeIntranetAccess(data) {
    return WebApi.ApisType(
      `/person/person/change-intranet-access`,
      "post",
      data
    );
  }

  static changeStatusPerson(data) {
    return WebApi.ApisType(`/person/person/change_is_active/`, "post", data);
  }

  static trainingPerson(type, url = "", data = null) {
    return WebApi.ApisType(`/person/person/${url}`, type, data);
  }

  /* Solicitudes */
  static geDisabilitiesRequest(url = "") {
    return WebApi.ApisType(`/person/incapacity/${url}`, "get");
  }

  static saveDisabilitiesRequest(data) {
    return WebApi.ApisType(`/person/incapacity/`, "post", data);
  }

  static updateDisabilitiesRequest(id, data) {
    return WebApi.ApisType(`/person/incapacity/${id}/`, "patch", data);
  }

  static rejectDisabilitiesRequest(data) {
    return WebApi.ApisType(`/person/incapacity/reject_request/`, "post", data);
  }

  static approveDisabilitiesRequest(data) {
    return WebApi.ApisType(`/person/incapacity/approve_request/`, "post", data);
  }
}
export default WebApiPeople;
