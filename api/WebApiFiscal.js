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
    return WebApi.ApisType(`/fiscal/suburb?limit=10&search=${data}`, "get");
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

  static getInfoDisabilityType(id) {
    return WebApi.ApisType(`/fiscal/disability-type/${id}/`, "get");
  }

  static getPostalCode(data, version) {
    return WebApi.ApisType(
      `/fiscal/postal-code?limit=10&search=${data}`,
      "get"
    );
  }

  static getCfdiVersion() {
    return WebApi.ApisType(`/fiscal/cfdi-version/`, "get");
  }

  static uploadCsdsMultiEmmiter(data,node) {
    return WebApi.ApisType(`fiscal/csd-multi-emitter-validate/${node}/`, "post", data);
  }

  static validateExistsCsdsMultiEmmiter(node) {
    return WebApi.ApisType(`fiscal/csd-multi-emitter-validate/${node}/`, "get");
  }

  static ImssDelegation(data) {
    return WebApi.ApisType(`fiscal/imss-delegation`, "get");
  }

  static ImssSubdelegation(data) {
    return WebApi.ApisType(`fiscal/imss-subdelegation`, "get");
  }

  static FamilyMedicalUnit(data) {
    return WebApi.ApisType(`fiscal/family-medical-unit`, "get");
  }

  static getIntegrationFactors(node) {
    return WebApi.ApisType(`fiscal/integration-factors-node-config/?node=${node}`, "get")
  }

  static getSpecificIntegratorFactor(id) {
    return WebApi.ApisType(`fiscal/integration-factors-node-config/${id}`, "get")
  }

  static saveIntegrationFactor(data) {
    return WebApi.ApisType(`fiscal/integration-factors-node-config/`, 'post', data)
  }

  static detailsIntegratorFactor(id) {
    return WebApi.ApisType(`fiscal/integration-factors-node-config/${id}/details/`, "get")
  }

  static defaultIntegratorFactor() {
    return WebApi.ApisType('fiscal/integration-factors-default', 'get')
  }

  static deleteIntegrationFactor(id) {
    return WebApi.ApisType(`fiscal/integration-factors-node-config/${id}/`, 'delete')
  }

  static updateIntegratorFactor(data, id) {
    return WebApi.ApisType(`fiscal/integration-factors-node-config/${id}/`, 'patch', data)
  }

  static updatebyExcel(data) {
    return WebApi.ApisType(`fiscal/integration-factors-import`, 'post', data)
  }

  static downloadIntegrationFactor(id) {
    return WebApi.ApisType(`fiscal/integration-factors-report?integration_factor_id=${id}`, "get")
  }

  static get_monthly_imss_provision(data) {
    return WebApi.ApisType('fiscal/monthly-imss-free/get_monthly_imss_provision/', 'post', data)
  }

  static get_geograp_area(year) {
    return WebApi.ApisType(`/fiscal/geographic-area/?period=${year}`, 'get')
  }
}

export default WebApiFiscal;
