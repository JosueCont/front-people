import WebApi from "./webApi";

class WebApiFiscal {
  static getContractTypes(data) {
    return WebApi.ApisType(
      `/fiscal/contract-type/?version_cfdi=${data}`,
      "get"
    );
  }

  static getHiringRegimes(data) {
    return WebApi.ApisType(
      `/fiscal/hiring-regime/?version_cfdi=${data}`,
      "get"
    );
  }

  static getTypeTax(data) {
    return WebApi.ApisType(`/fiscal/type-tax/?version_cfdi=${data}`, "get");
  }

  static getTaxRegime(data) {
    return WebApi.ApisType(`/fiscal/tax-regime/?version_cfdi=${data}`, "get");
  }

  static getBanks(data) {
    return WebApi.ApisType(`/fiscal/bank/?version_cfdi=${data}`, "get");
  }

  static getPaymentPeriodicity(data) {
    return WebApi.ApisType(`/fiscal/periodicity/?version_cfdi=${data}`, "get");
  }

  static getPerseptions(data) {
    return WebApi.ApisType(
      `/fiscal/perception-type/?version_cfdi=${data}`,
      "get"
    );
  }

  static getDeductions(data) {
    return WebApi.ApisType(
      `/fiscal/deduction-type/?version_cfdi=${data}`,
      "get"
    );
  }

  static getOtherPayments(data) {
    return WebApi.ApisType(
      `/fiscal/other-payment-type/?version_cfdi=${data}`,
      "get"
    );
  }

  static getTypeworkingday(data) {
    return WebApi.ApisType(
      `/fiscal/type-working-day/?version_cfdi=${data}`,
      "get"
    );
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

  static getCountries(data) {
    return WebApi.ApisType(`/fiscal/country/?version_cfdi=${data}`, "get");
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

  static getInternalPerceptions(data, version_cfdi) {
    return WebApi.ApisType(
      `/fiscal/internal-perception-type/?node=${data}&version_cfdi=${version_cfdi}`,
      "get"
    );
  }

  static getInternalDeductions(data, version_cfdi) {
    return WebApi.ApisType(
      `/fiscal/internal-deduction-type/?node=${data}&version_cfdi=${version_cfdi}`,
      "get"
    );
  }

  static getInternalOtherPayments(data, version_cfdi) {
    return WebApi.ApisType(
      `/fiscal/internal-other-payment-type/?node=${data}&version_cfdi=${version_cfdi}`,
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
    return WebApi.ApisType(
      `/fiscal/postal-code?code=${data}&version_cfdi=${version}`,
      "get"
    );
  }

  static getCfdiVersion() {
    return WebApi.ApisType(`/fiscal/cfdi-version/`, "get");
  }
}

export default WebApiFiscal;
