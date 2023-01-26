import { get } from "lodash";
import WebApi from "./webApi";

class WebApiPayroll {
  static getCfdi(data) {
    return WebApi.ApisType(`/payroll/cfdi-payroll`, "post", data);
  }

  static getPayrollPerson(data) {
    return WebApi.ApisType(
      `/payroll/payroll-person/?person__id=${data}`,
      "get"
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

  static getMovementsIMSSLog(node, reg_patronal = "") {
    return WebApi.ApisType(
      `/payroll/imss-movement-log?node=${node}&patronal_registration=${reg_patronal}`,
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
}

export default WebApiPayroll;
