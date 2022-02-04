import WebApi from "./webApi";

class WebApiFiscal {
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

  static getPaymentPeriodicity() {
    return WebApi.ApisType(`/fiscal/periodicity/`, "get");
  }

  static getPerseptions() {
    return WebApi.ApisType(`/fiscal/perception-type/`, "get");
  }

  static getDeductions() {
    return WebApi.ApisType(`/fiscal/deduction-type/`, "get");
  }

  static getOtherPayments() {
    return WebApi.ApisType(`/fiscal/other-payment-type/`, "get");
  }

  static validateAccountNumber(data) {
    return WebApi.ApisType(`/fiscal/validate-account-number/`, "post", data);
  }

  static assimilatedSalaryCalculation(data) {
    return WebApi.ApisType(
      `/fiscal/salary_calculation_and_allowance`,
      "post",
      data
    );
  }
}

export default WebApiFiscal;
