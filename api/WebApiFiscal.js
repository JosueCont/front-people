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

  static getTaxRegime() {
    return WebApi.ApisType(`/fiscal/tax-regime/`, "get");
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

  static getTypeworkingday() {
    return WebApi.ApisType(`/fiscal/type-working-day/`, "get");
  }

  static validateAccountNumber() {
    return WebApi.ApisType(`/fiscal/validate-account-number/`, "post", data);
  }

  static calculatorSalary(data) {
    return WebApi.ApisType(
      `/fiscal/salary_calculation_and_allowance`,
      "post",
      data
    );
  }

  static getCountries() {
    return WebApi.ApisType(`/fiscal/country/`, "get");
  }

  static getStates(data) {
    return WebApi.ApisType(`/fiscal/state/?country=${data}`, "get");
  }

  static getMunicipality(data) {
    return WebApi.ApisType(`/fiscal/municipality/?state=${data}`, "get");
  }

  static getSuburb(data) {
    return WebApi.ApisType(`/fiscal/suburb/?postal_code=${data}`, "get");
  }

  static getInternalPerceptions(data) {
    return WebApi.ApisType(
      `/fiscal/internal-perception-type/?node=${data}`,
      "get"
    );
  }

  static getInternalDeductions(data) {
    return WebApi.ApisType(
      `/fiscal/internal-deduction-type/?node=${data}`,
      "get"
    );
  }

  static getInternalOtherPayments(data) {
    return WebApi.ApisType(
      `/fiscal/internal-other-payment-type/?node=${data}`,
      "get"
    );
  }

  static crudInternalConcept(url, type, data = null) {
    return WebApi.ApisType(`/fiscal/${url}`, type, data);
  }

  static getDisabilityType() {
    return WebApi.ApisType(`/fiscal/disability-type/`, "get");
  }

  static getPostalCode(data, version) {
    return WebApi.ApisType(`/fiscal/postal-code?code=${data}`, "get");
  }

  static getCfdiVersion() {
    return WebApi.ApisType(`/fiscal/cfdi-version/`, "get");
  }

  static uploadCsdsMultiEmmiter(data) {
    return WebApi.ApisType(`fiscal/csd-multi-emitter`, "post", data);
  }
}

export default WebApiFiscal;
