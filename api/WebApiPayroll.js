import { get } from "lodash";
import WebApi from "./webApi";
import axiosApi from "./axiosApi";

class WebApiPayroll {

  // Se agregan apis existentes

  static downloadConfronts(data) {
    return axiosApi.post('/payroll/confront', data, { responseType: 'blob' });
  }

  static downloadTemplateSalary(data){
    return axiosApi.post('/payroll/payroll-person/export_salary_modification/', data, {responseType: 'blob'});
  }

  // Termina

  static getCfdi(data) {
    return WebApi.ApisType(`/payroll/cfdi-payroll`, "post", data);
  }

  static getPayrollPerson(data) {
    return WebApi.ApisType(
      `/payroll/payroll-person/?person__id=${data}`,
      "get"
    );
  }

  static deletePayrollPerson(payrollPersonId) {
    let url = `/payroll/payroll-person/${payrollPersonId}/`;
    return WebApi.ApisType(
        url,
        "delete"
    );
  }


  static createPayrollPerson(data) {
    return WebApi.ApisType(`/payroll/payroll-person/`, "post", data);
  }

  static updatePayrollPerson(data) {
    return WebApi.ApisType(`/payroll/payroll-person/${data.id}/`, "put", data);
  }

  static getPaymentCalendar(data) {
    return WebApi.ApisType(`/payroll/payment-calendar/?node=${data}`, "get");
  }

  static deletePaymentCalendar(data) {
    return WebApi.ApisType(`/payroll/payment-calendar/${data}/`, "delete");
  }

  static createPaymentCalendar(data) {
    return WebApi.ApisType(
      `/payroll/payment-calendar/payment_calendar/`,
      "post",
      data
    );
  }

  static updatePaymentCalendar(data) {
    return WebApi.ApisType(
      `/payroll/payment-calendar/payment_calendar/`,
      "post",
      data
    );
  }

  static getDetailPaymentCalendar(id) {
    return WebApi.ApisType(`/payroll/payment-calendar/${id}`, "get");
  }

  static getPersonsCalendar(id) {
    return WebApi.ApisType(
      `/payroll/payment-calendar/${id}/person_calendar/`,
      "get"
    );
  }

  static getPaymentPeriodicity() {
    return WebApi.ApisType(`/fiscal/periodicity/`, "get");
  }

  static calculatePayroll(data) {
    return WebApi.ApisType(`/payroll/calculate-payroll`, "post", data);
  }

  static cfdiMultiEmitter(data) {
    return WebApi.ApisType(
      `/payroll/cfdi_multi_emitter_facturama/cfdi_multi_emitter/`,
      "post",
      data
    );
  }

  static importPayrollMasiveXml(data) {
    return WebApi.ApisType(`/payroll/payroll`, "post", data);
  }

  static fixedConcept(type, data = null, url = "") {
    return WebApi.ApisType(`/payroll/fixed-concept/${url}`, type, data);
  }

  static groupFixedConcept(type, data = null, url = "") {
    return WebApi.ApisType(`/payroll/group-fixed-concept/${url}`, type, data);
  }

  // Loan
  static getLoanRequest(url = "") {
    return WebApi.ApisType(`/payroll/loan/${url}`, "get");
  }

  static getConfigLoan(url = "") {
    return WebApi.ApisType(`/payroll/loan-config/${url}`, "get");
  }
  static saveConfigLoan(data) {
    return WebApi.ApisType(`/payroll/loan-config/`, "post", data);
  }

  static updateConfigLoan(id, data) {
    return WebApi.ApisType(`/payroll/loan-config/${id}/`, "patch", data);
  }

  static saveLoanRequest(data) {
    return WebApi.ApisType(`/payroll/loan/`, "post", data);
  }

  static updateLoanRequest(id, data) {
    return WebApi.ApisType(`/payroll/loan/${id}/`, "patch", data);
  }

  static rejectLoanRequest(data) {
    return WebApi.ApisType(`/payroll/loan/reject_request/`, "post", data);
  }

  static approveLoanRequest(data) {
    return WebApi.ApisType(`/payroll/loan/approve_request/`, "post", data);
  }

  static confirmPaidLoan(id, data) {
    return WebApi.ApisType(`/payroll/payment-plan/${id}/`, "patch", data);
  }

  static getPaymentPlan(id) {
    return WebApi.ApisType(`/payroll/payment-plan/?loan__id=${id}`, "get");
  }

  static getPayrollReport() {
    return WebApi.ApisType(
      `/payroll/payroll-report?start_date=2022-01-01&end_date=2022-01-15`,
      "get"
    );
  }

  static getCfdiPayrrol(data) {
    return WebApi.ApisType(`/payroll/cfdi-voucher?${data}`, "get");
  }

  static closePayroll(data) {
    return WebApi.ApisType(
      `/payroll/consolidated_payroll/save_calculation/`,
      "post",
      data
    );
  }

  static stampPayroll(data) {
    return WebApi.ApisType(
      `/payroll/cfdi_multi_emitter_facturama/send_invoice_facturama/`,
      "post",
      data
    );
  }

  static getReportPayroll(url) {
    return WebApi.ApisType(`/payroll/payroll-report?${url}`, "get");
  }

  static downloadRenegationCart(id) {
    return WebApi.ApisType(
      `/payroll/resignation-letter?person_id=${id}`,
      "get"
    );
  }

  static downloadContractForWork(id) {
    return WebApi.ApisType(
      `/payroll/contract-for-work?person_id=${id}&contract_code=CTO4`,
      "get"
    );
  }

  static downloadIndefiniteTermContract(id) {
    return WebApi.ApisType(
      `/payroll/indefinite-term-contract?person_id=${id}&contract_code=CTO3`,
      "get"
    );
  }

  static downloadFixedTermContract(id) {
    return WebApi.ApisType(
      `/payroll/fixed-term-contract?person_id=${id}&contract_code=CTO2`,
      "get"
    );
  }

  static getPayrollList(data) {
    return WebApi.ApisType(
      `/payroll/payroll-person/get_payroll_person/`,
      "post",
      data
    );
  }

  static openConsolidationPayroll(data) {
    return WebApi.ApisType(
      `payroll/consolidated_payroll/open_consolidation/`,
      "post",
      data
    );
  }

  static deleteCfdiCalculated(data) {
    return WebApi.ApisType(
      `payroll/consolidated_payroll/delete_cfdi_calculated/`,
      "post",
      data
    );
  }

  static cancelCfdi(data) {
    return WebApi.ApisType(
      `payroll/cfdi_multi_emitter_facturama/cancel_cfdi/`,
      "post",
      data
    );
  }

  static importPayrollCaculate(data) {
    return WebApi.ApisType(`payroll/read-payroll-calculus`, "post", data);
  }

  static getInfonavitCredit(data) {
    return WebApi.ApisType(`payroll/infonavit-credit`, "post", data);
  }

  static getUserCredits(id) {
    return WebApi.ApisType(`payroll/infonavit-credit?person=${id}`, "get");
  }

  static saveIMSSInfonavit(data) {
    return WebApi.ApisType("payroll/imss-person/", "post", data);
  }

  static editIMSSInfonavit(imssId, data) {
    return WebApi.ApisType(`payroll/imss-person/${imssId}/`, "patch", data);
  }

  static addInfonavit(data) {
    return WebApi.ApisType("payroll/person-infonavit-credit/", "post", data);
  }

  static editInfonavit(creditId, data) {
    return WebApi.ApisType(
      `payroll/person-infonavit-credit/${creditId}/`,
      "put",
      data
    );
  }

  static getLogsInfonavit(person_id) {
    console.log('request_person__id')
    return WebApi.ApisType(
      `payroll/infonavit-logs/?request_person__id=${person_id}`,
      "get",
    );
  }

  static getExtraordinaryPayroll(data) {
    return WebApi.ApisType("/payroll/extraordinary-payroll", "post", data);
  }

  static setSalaryModification(data) {
    return WebApi.ApisType(
      "/payroll/payroll-person/salary_modification/",
      "post",
      data
    );
  }

  static getMovementsIMSSLog(node, reg_patronal = "", status = "", date = "", validity_date = "") {
    return WebApi.ApisType(
      `/payroll/imss-movement-log?node=${node}&patronal_registration=${reg_patronal}&status=${status}&date=${date}&validity_date=${validity_date}`,
      "get"
    );
  }

  static getPersonalCredits(id) {
    return WebApi.ApisType(
      `/payroll/imss-person/get_imss_person?person=${id}`,
      "get"
    );
  }

  static importSalaryModification(data) {
    //payroll/payroll-person/import_salary_modification/
    return WebApi.ApisType(
      `/payroll/payroll-person/import_salary_modification/`,
      "post",
      data
    );
  }

  static importVacationModification(data) {
    return WebApi.ApisType(
      `/payroll/payroll-person/import_vacation_modification/`,
      "post",
      data
    );
  }


  static importIMSSPerson(data) {
    //payroll/payroll-person/import_salary_modification/
    return WebApi.ApisType(
      `/payroll/imss-person/import_imss_person/`,
      "post",
      data
    );
  }

  static getIMSSMovements(node, patronal_registration) {
    return WebApi.ApisType(
      `/payroll/affiliate-movements?node=${node}&patronal_registration=${patronal_registration}`,
      "get"
    );
  }

  static generateDispmagORSendMovement(
    type,
    regPatronal,
    listPeople = [],
    method = 2
  ) {
    let data = {
      type,
      patronal_id: regPatronal,
      list: listPeople,
      method,
    };
    return WebApi.ApisType(`payroll/sua-movements`, "post", data);
  }

  static consolidatedExtraordinaryPayroll(data) {
    return WebApi.ApisType(
      "/payroll/consolidated-extraordinary-payroll",
      "post",
      data
    );
  }

  static downLoadReceipt(data) {
    return WebApi.ApisType("/payroll/payroll-receipt", "post", data);
  }

  static getVacationsRecord(person_id) {
    return WebApi.ApisType(
      `/payroll/person-vacations-record/?person=${person_id}`,
      "get"
    );
  }

  static saveVacationsRecord(data) {
    return WebApi.ApisType("/payroll/person-vacations-record", "post", data);
  }

  static updateVacationsRecord(id, data) {
    return WebApi.ApisType(
      `/payroll/person-vacations-record/${id}/`,
      "patch",
      data
    );
  }

  static getPeople(id, search, filter = null) {
    return WebApi.ApisType(
      `/payroll/people-calendar?calendar_id=${id}&search=${search != null ? search : ''}${filter != null ? filter : ''}`,
      'get'
    );
  }

  static addMassiveCalendar(data) {

    return WebApi.ApisType(
      "/payroll/assign-calendar-employees",
      "post",
      data
    );
  }

  static getPayrollSpred(filters) {
    return WebApi.ApisType(`/business/bank-dispersion/${filters}`, "get");
  }

  static savePayrollSpred(data) {
    return WebApi.ApisType(`/business/bank-dispersion/`, "post", data);
  }

  static updPayrollSpred(data, item) {
    return WebApi.ApisType(`/business/bank-dispersion/${item.id}/`, "put", data);
  }

  static deletePayrollSpred(item) {
    return WebApi.ApisType(`/business/bank-dispersion/${item.id}`, "delete");
  }

  static getBanks() {
    return WebApi.ApisType(`/business/bank-dispersion/banks/`, "get");
  }

  static generateDispersion(data) {
    return WebApi.ApisType(`/payroll/payroll-dispersion`, "post", data);
  }

  static getSuaFile(data) {
    return WebApi.ApisType(`/payroll/sua`, "post", data);
  }

  static deleteConsolidationPayroll(data) {
    return WebApi.ApisType(
      `payroll/consolidated_payroll/delete_consolidation/`,
      "post",
      data
    );
  }

  static generateVariability(data) {
    return WebApi.ApisType(
      `payroll/variability/create_variability/`,
      "post",
      data
    );
  }

  static getCalculateCreditNote(data) {
    return WebApi.ApisType(
      `payroll/calculate_credit_note`,
      "post",
      data
    );
  }

  static UploadCreditNoteLayout(data){
    return WebApi.ApisType(
      `payroll/read_credit_note_layout`,
    "post",
    data
    )
  }

  static saveConsolidationCreditNote(data){
    return WebApi.ApisType(
      `payroll/save_consolidation_credit_note`,
    "post",
    data
    )
  }

  static openConsolidationCreditNote(data){
    return WebApi.ApisType(
      `payroll/open_consolidation_credit_note`,
      "post",
      data
    )
  }

  static stampCreditNote(data){
    return WebApi.ApisType(
      `payroll/stamp_credit_note`,
      "post",
      data
    )
  }


  static getPayrollSheets(filter){
    return WebApi.ApisType(`payroll/payroll-sheets/?${filter}`, "get")
  }

  static addPayrollSheets(data){
    return WebApi.ApisType(`payroll/payroll-sheets/`, "post", data)
  }

  static updPayrollSheets(id, data){
    return WebApi.ApisType(`payroll/payroll-sheets/${id}/`, "put", data)
  }

  static delPayrollSheets(id){
    return WebApi.ApisType(`payroll/payroll-sheets/${id}/`, "delete")
  }

  static deferredFixedConceptList(filters){
    return WebApi.ApisType(`payroll/deferred-fixed-concept-list?${filters}`, "get")
  }

  static getContractsInfo(filters=""){
    return WebApi.ApisType(`payroll/payroll-person/get_contracts_for_expired/?${filters}`, "get")
  }


  static sharePayload(data){
    return WebApi.ApisType(`payroll/share/`, "post", data)
  }

}

export default WebApiPayroll;
