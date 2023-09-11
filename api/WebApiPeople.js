import WebApi from "./webApi";
import axiosApi from "./axiosApi";

class WebApiPeople {
  static getGeneralConfig() {
    return WebApi.ApisType(`/setup/site-configuration/`, "get");
  }

  static saveJwt(data) {
    return WebApi.ApisType(`/person/person/save_person_jwt/`, "post", data);
  }

  static getCompanys(personId = null, active = true) {
    return WebApi.ApisType(
      `/business/node/?${active !== null ? `active=${active}` : ""}${personId ? `&person=${personId}` : ""
      }`,
      "get"
    );
  }

  // Se agregan apis existentes

  static downloadTemplate(node, query){
    return axiosApi.get(`/person/person/generate_template/?node_id=${node}${query}`, {responseType: 'blob'});
  }

  static downloadCatalogs(node){
    return axiosApi.get(`/business/all-catalogs/?node_id=${node}`, {responseType: 'blob'});
  }

  // Termina

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

  static getListPersons(filters) {
    return WebApi.ApisType(`/person/person/get_list_persons/`, "post", filters);
  }

  // Nuevas apis

  static getCollaborators(node, query){
    return WebApi.ApisType(`/person/search?node=${node}${query}`, 'get')
  }

  static downloadReportPeople(node, query){
    return axiosApi.get(`/person/search?node=${node}${query}`, {responseType: 'blob'});
  }

  // Termina

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
    let nodeStr = "node";
    if (model === "level") nodeStr = "node__id";

    return WebApi.ApisType(`/business/${model}/?${nodeStr}=${data}`, "get");
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

  static getVacationRequest(node, query) {
    return WebApi.ApisType(
      `/person/vacation/?person__node__id=${node}${query}`,
      "get"
    );
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
    return WebApi.ApisType(`/business/node/${id}/`, "put", data);
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

  static getfiscalInformationNode(data) {
    return WebApi.ApisType(
      `/business/fiscal-information/?node=${data}&active=True`,
      "get"
    );
  }

  static savefiscalInformation(data) {
    return WebApi.ApisType(`/business/fiscal_information`, "post", data);
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
    return WebApi.ApisType(`/person/${url}`, type, data);
  }

  /* Solicitudes */
  static getDisabilitiesRequest(node, query = "") {
    return WebApi.ApisType(
      `/person/incapacity/?person__node__id=${node}${query}`,
      "get"
    );
  }

  static getInfoInability(id) {
    return WebApi.ApisType(`/person/incapacity/${id}/`, "get");
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

  static getPermitsRequest(node, query = "") {
    return WebApi.ApisType(
      `/person/permit/?person__node__id=${node}${query}`,
      "get"
    );
  }

  static getInfoPermit(id) {
    return WebApi.ApisType(`/person/permit/${id}/`, "get");
  }

  static savePermitsRequest(data) {
    return WebApi.ApisType(`/person/permit/`, "post", data);
  }

  static updatePermitsRequest(id, data) {
    return WebApi.ApisType(`/person/permit/${id}/`, "patch", data);
  }

  static changeStatusPermitsRequest(data) {
    return WebApi.ApisType(`/person/permit/change_status/`, "post", data);
  }

  static getInfoVacation(id) {
    return WebApi.ApisType(`/person/vacation/${id}/`, "get");
  }

  static saveVacationRequest(data) {
    return WebApi.ApisType(`/person/vacation/`, "post", data);
  }

  static updateVacationRequest(id, data) {
    return WebApi.ApisType(`/person/vacation/${id}/`, "patch", data);
  }

  static vacationRejectRequest(data) {
    return WebApi.ApisType(`/person/vacation/reject_request/`, "post", data);
  }

  static vacationApproveRequest(data) {
    return WebApi.ApisType(`/person/vacation/approve_request/`, "post", data);
  }

  static vacationCancelRequest(data) {
    return WebApi.ApisType(`/person/vacation/cancel-request/`, "post", data);
  }

  static vacationReOpenRequest(data) {
    return WebApi.ApisType(`/person/vacation/rollback-request/`, "post", data);
  }

  static vacationNextPeriod(data) {
    return WebApi.ApisType("/person/vacation/planned-vacation/", "post", data);
  }

  static informationNode(data) {
    return WebApi.ApisType(`/person/vacation/approve_request/`, "post", data);
  }

  static generalInfoNode(type, data = null, url = "") {
    return WebApi.ApisType(`/business/node-information/${url}`, type, data);
  }

  static centerCost(nodeId, method = "get", data) {
    return WebApi.ApisType(`/payroll/cost-center/?node=${nodeId}`, method);
  }

  static tags(nodeId) {
    return WebApi.ApisType(`/business/tag/?node=${nodeId}`, "get");
  }

  static accountantAccount(nodeId) {
    return WebApi.ApisType(
      `/payroll/accountant-account/?node=${nodeId}`,
      "get"
    );
  }

  static getBranches(filter) {
    return WebApi.ApisType(`/business/branch-node/${filter}`, "get");
  }

  static saveBranch(data) {
    return WebApi.ApisType(`/business/branch-node/`, "post", data);
  }

  static updateBranch(id, data) {
    return WebApi.ApisType(`/business/branch-node/${id}/`, "patch", data);
  }

  static deleteBranch(id) {
    return WebApi.ApisType(`/business/branch-node/${id}/`, "delete");
  }

  static getPatronalRegistration(node) {
    return WebApi.ApisType(
      `/business/patronal-registration-data?node=${node}`,
      "get"
    );
  }

  static listEbaAndEmaFiles(node, patronalRegistration, offset = 0, limit = 10) {
    return WebApi.ApisType(
      `/business/document/?node_id=${node}&limit=${limit}&offset=${offset}&patronal_registration_id=${patronalRegistration}&origin__type=1`,
      "get"
    );
  }

  static forceListEbaAndEmaFiles(data) {
    return WebApi.ApisType("business/document/", "post", data);
  }

  static importEMAandEvaFiles(data) {
    return WebApi.ApisType("payroll/import-emissions", "post", data);
  }

  static importAfiliateMovement(data) {
    return WebApi.ApisType("payroll/affiliate-movements", "post", data);
  }

  static getJobRiskClass(node) {
    return WebApi.ApisType(`/fiscal/job-risk-class/?node=${node}`, "get");
  }

  static getFractions(node) {
    return WebApi.ApisType(`/fiscal/fraction-rt/?node=${node}`, "get");
  }

  static accountantAccount(nodeId) {
    return WebApi.ApisType(
      `/payroll/accountant-account/?node=${nodeId}`,
      "get"
    );
  }

  static getPatronalRegistrationData(node) {
    return WebApi.ApisType(
      `/business/patronal-registration-data/?node=${node}`,
      "get"
    );
  }

  static getCredentials(site, patronal_registrartion) {
    return WebApi.ApisType(
      `/business/scraper-config/${site}/${patronal_registrartion}/`,
      "get"
    );
  }

  static deleteCredentials(site, patronal_registrartion) {
    return WebApi.ApisType(
      `/business/scraper-config/${site}/${patronal_registrartion}/`,
      "delete"
    );
  }

  static addNewCredentials(data) {
    return WebApi.ApisType("/business/scraper-config/", "post", data);
  }

  static patronalRegistration(data) {
    return WebApi.ApisType(
      `/business/patronal-registration-data/`,
      "post",
      data
    );
  }

  static deletePatronalRegistration(id, idCompany) {
    return WebApi.ApisType(
      `/business/patronal-registration-data/${id}/?node=${idCompany}`,
      "delete"
    );
  }

  static sendCatalogData(url, data) {
    return WebApi.ApisType(url, "post", data);
  }

  static afilliateMovements(data) {
    return WebApi.ApisType(`/business/document/${data}`, "get");
  }

  static getWithHoldingNotice(data) {
    return WebApi.ApisType(`/payroll/retention-notice${data}`, "get");
  }

  static withHoldingNotice(data) {
    return WebApi.ApisType("/payroll/retention-notice", "post", data);
  }

  static syncUpAfilliateMovements(data) {
    return WebApi.ApisType(
      "/payroll/infonavit-affiliate-movements",
      "post",
      data
    );
  }

  static sendFilesToAddPerson(data) {
    return WebApi.ApisType("/business/add-massive-person-from-cif/", "post", data);
  }

  static validateKhor(data) {
    return WebApi.ApisType(`/external-services/khor/sso/`, "post", data);
  }

  static validateChangePassword(data) {
    return WebApi.ApisType(`/person/change-password/`, "post", data);
  }

  static getCodesApps(id) {
    return WebApi.ApisType(`/setup/get-instance-codes/?person=${id}`, "get");
  }

  static khonnectSavePerson(data) {
    return WebApi.ApisType("/khonnect/save-person/", "post", data);
  }

  static assignedMassiveImmediateSupervisor(data) {
    return WebApi.ApisType(
      `/person/person/set-immediate-supervisor/`,
      "post",
      data
    );
  }

  static assignedMassiveSubstituteImmediateSupervisor(data) {
    return WebApi.ApisType(
      `/person/person/set-substitute-immediate-supervisor/`,
      "post",
      data
    );
  }

  //Roles de administrador

  static getModulesPermissions() {
    return WebApi.ApisType("/security/khorplus-module-with-perm/", "get");
  }

  static getAdminRoles(node, query) {
    return WebApi.ApisType(
      `/security/administrator-profile/?node=${node}${query}`,
      "get"
    );
  }

  static getInfoAdminRole(id) {
    return WebApi.ApisType(`/security/administrator-profile/${id}/`, "get");
  }

  static createAdminRole(data) {
    return WebApi.ApisType("/security/administrator-profile/", "post", data);
  }

  static updateAdminRole(id, data) {
    return WebApi.ApisType(
      `/security/administrator-profile/${id}/`,
      "patch",
      data
    );
  }

  static deleteAdminRole(id) {
    return WebApi.ApisType(`/security/administrator-profile/${id}/`, "delete");
  }

  static getWorkTitles(node) {
    return WebApi.ApisType(`/business/work-title/?node=${node}`, "get");
  }

  static deleteAffiliatedMovements(data) {
    return WebApi.ApisType(
      `/business/delete-affiliated-movements/`,
      "post",
      data
    );
  }

  /*** WORKING/NON-WORKING DAYS ***/
  static getNonWorkingDays({ node, offset = 0, limit = 10, year = "", type = null  }) {
    let _URL = `/business/non-working-day/?node=${node}`;

    _URL += offset && offset > 0 ? `&offset=${offset}` : "";
    // _URL += offset && offset >= 1 ? `&offset=${offset}` : '&offset=1'
    _URL += limit && limit >= 1 ? `&limit=${limit}` : "&limit=10";
    _URL += year && year !== "" ? `&date__year=${year}` : "";
    _URL += type ? `&type__in=${type}` : "";

    return WebApi.ApisType(_URL, "get");
  }

  static createNonWorkingDay(data) {
    return WebApi.ApisType(`/business/non-working-day/`, "post", data);
  }

  static updateNonWorkingDay(id, data) {
    return WebApi.ApisType(`/business/non-working-day/${id}/`, "put", data);
  }

  static deleteNonWorkingDay(id) {
    return WebApi.ApisType(`/business/non-working-day/${id}/`, "delete");
  }

  static getWorkingWeekDays(node) {
    return WebApi.ApisType(`/business/working-week-day/?node=${node}`, "get");
  }

  static createWorkingWeekDay(data) {
    return WebApi.ApisType(`/business/working-week-day/`, "post", data);
  }

  static updateWorkingWeekDay(id, data) {
    return WebApi.ApisType(`/business/working-week-day/${id}/`, "put", data);
  }

  static getWorkingDaysFromRange(data) {
    return WebApi.ApisType(
      `/business/get-working-days-from-range-date/`,
      "post",
      data
    );
  }

  static CreateTruoraRequest(id) {
    return WebApi.ApisType(
      `/person/person/${id}/add_background_check/`,
      "post",
      {}
    );
  }

  static GetTruoraRequest(id) {
    return WebApi.ApisType(`/person/person/${id}/get_background_check/`, "get");
  }

  static GetTruoraFile(id) {
    return WebApi.ApisType(
      `/person/person/${id}/get_background_check_file/`,
      "get"
    );
  }

  static GetUiStoreId(node) {
    return WebApi.ApisType(
      `/business/node-iuss-configuration/?node=${node}`,
      "get"
    );
  }

  static CreateUiStoreId(data) {
    return WebApi.ApisType("/business/node-iuss-configuration/", "post", data);
  }

  static UpdateUiStoreId(data) {
    return WebApi.ApisType(
      `/business/node-iuss-configuration/${data.id}/`,
      "put",
      data
    );
  }

  static CreateUIStoreUsers(data) {
    return WebApi.ApisType("/iuss/sync-persons-to-iuss/", "post", data);
  }

  static getfiscalInformation(node_id) {
    return WebApi.ApisType(
      `/business/get-fiscal-information/?node=${node_id}`,
      "get"
    );
  }

  static getBenefitsNodeConfig(node_id) {
    return WebApi.ApisType(
      `/business/node/${node_id}/get_benefits_config/`,
      "get"
    );
  }

  static UpdateProportionalBenefits(data) {
    return WebApi.ApisType(
      `/business/node/change_benefits_proportional/`,
      "post",
      data
    );
  }

  static PersonUpDown(data){
    return WebApi.ApisType(`/payroll/payroll-person/up_down/`, 'post', data);
  }
  
}

export default WebApiPeople;
