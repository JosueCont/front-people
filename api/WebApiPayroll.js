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
}

export default WebApiPayroll;
