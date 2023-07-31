import Axios from "axios";
import { API_ASSESSMENT, typeHttp } from "../config/config";
import WebApi from "./webApi";

let tenant = "demo";

if (process.browser) {
  let splitDomain = window.location.hostname.split(".");
  if (splitDomain.length > 0 && !splitDomain[0].includes('localhost') ) {
    tenant = splitDomain[0];
  }
}

// Set url Kuiz Base Api with Tenant
const urlKuizBaseApiWithTenant = `${typeHttp}://${tenant}.${API_ASSESSMENT}`

class WebApiAssessment {
  static getGroupsAssessments(node, query) {
    return WebApi.ApisType(
      `/person/group-assessments/?node=${node}${query}`,
      "get"
    );
  }
  static getOnlyGroupAssessment(id) {
    return WebApi.ApisType(`/person/group-assessments/${id}/`, "get");
  }

  static getOnlyGroupAssessmentByNode(id) {
    return WebApi.ApisType(`/person/group-assessments/?node=${id}`, "get");
  }

  static uploadMassiveGroups(data) {
    return WebApi.ApisType(`/person/group-assessments/upload_massive/`, "post", data);
  }



  static getListSurveys(node, query = '') {
    return WebApi.ApisType(`/person/assessment/?companies=${node}${query}`, 'get');
  }

  static createGroupAssessments(data) {
    return WebApi.ApisType(`/person/group-assessments/`, "post", data);
  }
  static updateGroupAssessments(data, id) {
    return WebApi.ApisType(`/person/group-assessments/${id}/`, "put", data);
  }
  static deleteGroupAssessments(data) {
    return WebApi.ApisType(
      `/person/group-assessments/delete_by_ids/`,
      "post",
      data
    );
  }

  static getListPersons(data) {
    return WebApi.ApisType(`/person/person/get_list_persons/`, "post", data);
  }
  static getGroupsPersons(data) {
    return WebApi.ApisType(
      `/person/group/?node=${data.nodeId}${data.name}${data.queryParam}`,
      "get"
    );
  }
  static createGroupPersons(data) {
    return WebApi.ApisType(`/person/group/`, "post", data);
  }
  static updateGroupPersons(data, id) {
    return WebApi.ApisType(`/person/group/${id}/`, "put", data);
  }
  static deleteGroupPersons(data) {
    return WebApi.ApisType(`/person/group/delete_by_ids/`, "post", data);
  }

  static assignAssessments(data) {
    return WebApi.ApisType(`/person/person-assessments/`, "post", data);
  }
  static getAssignments(nodeId, queryParam) {
    return WebApi.ApisType(
      `/person/person-assessments/?node=${nodeId}${queryParam}`,
      "get"
    );
  }
  static deletePersonAssessment(data) {
    return WebApi.ApisType(
      `/person/person-assessments/delete_by_ids/`,
      "post",
      data
    );
  }
  static getDetailsAssessment(id) {
    return WebApi.ApisType(`/person/assessment/${id}/`, "get");
  }

  static getAllAssignments(data) {
    return WebApi.ApisType(
      `/person/group-person-assessment/get_all_assignments/`,
      "post",
      data
    );
  }

  static getAssignByPerson(id, queryParam, type) {
    return WebApi.ApisType(
      `/person/person-assessments/?person=${id}${queryParam}${type}`,
      "get"
    );
  }

  static getAssignListPersonal(data){
    return WebApi.ApisType(
      `/person/person-assessments/user-assignments-list/`, 'post', data
    )
  }

  static getAssignByGroup(id, queryParam, type) {
    return WebApi.ApisType(
      `/person/group-person-assessment/?group_person=${id}${queryParam}${type}`,
      "get"
    );
  }
  static getCategoriesAssessment() {
    return WebApi.ApisType(`/person/assessment/categories/`, "get");
  }
  static assignAssessmentsGroup(data) {
    return WebApi.ApisType(`/person/group-person-assessment/`, "post", data);
  }

  static assessmentLoadAssessment(id) {
    return WebApi.ApisType(`/person/assessment/?companies=${id}`, "get");
  }

  static createAssessments(data) {
    return WebApi.ApisType(`/person/assessment/`, "post", data);
  }
  static updateAssessments(id, data) {
    return WebApi.ApisType(`/person/assessment/${id}/`, "put", data);
  }
  static deleteAssignByPerson(data) {
    return WebApi.ApisType(
      `/person/person-assessments/delete_by_ids/`,
      "post",
      data
    );
  }
  static deleteAssignByGroup(data) {
    return WebApi.ApisType(
      `/person/group-person-assessment/delete_by_ids/`,
      "post",
      data
    );
  }
  static assessmentSections(id) {
    return Axios.get(`${urlKuizBaseApiWithTenant}/assessments/section/?assessment=${id}`);
  }
  static assessmentQuestions(id) {
    return Axios.get(`${urlKuizBaseApiWithTenant}/assessments/question/?section=${id}`);
  }
  static assessmentDelete(id) {
    return Axios.delete(`${urlKuizBaseApiWithTenant}/assessments/assessment/${id}`);
  }
  static assessmentStatus(id, data) {
    return Axios.patch(`${urlKuizBaseApiWithTenant}/assessments/assessment/${id}/`, data);
  }
  static createSection(data) {
    return Axios.post(urlKuizBaseApiWithTenant + "/assessments/section/", data);
  }
  static getInfoSection(id){
    return Axios.get(`${urlKuizBaseApiWithTenant}/assessments/section/${id}/`);
  }
  static updateSection(id, data) {
    return Axios.patch(`${urlKuizBaseApiWithTenant}/assessments/section/${id}/`, data);
  }
  static deleteSection(id) {
    return Axios.delete(`${urlKuizBaseApiWithTenant}/assessments/section/${id}`);
  }
  static createQuestion(data) {
    return Axios.post(urlKuizBaseApiWithTenant + "/assessments/question/", data);
  }
  static updateQuestion(id, data) {
    return Axios.patch(`${urlKuizBaseApiWithTenant}/assessments/question/${id}/`, data);
  }
  static deleteQuestion(id) {
    return Axios.delete(`${urlKuizBaseApiWithTenant}/assessments/question/${id}`);
  }
  static createAnswer(data) {
    return Axios.post(urlKuizBaseApiWithTenant + "/assessments/answer/", data);
  }
  static updateAnswer(id, data) {
    return Axios.patch(`${urlKuizBaseApiWithTenant}/assessments/answer/${id}/`, data);
  }
  static getAnswer(id) {
    return Axios.get(`${urlKuizBaseApiWithTenant}/assessments/question/${id}/`);
  }
  static deleteAnswer(id) {
    return Axios.delete(`${urlKuizBaseApiWithTenant}/assessments/answer/${id}/`);
  }
  static getAssessmentsByPerson(data) {
    return WebApi.ApisType(
      `/person/person-assessments/my_profile/`,
      "post",
      data
    );
  }
  static getAssessmentResults(data) {
    return Axios.post(`${urlKuizBaseApiWithTenant}/sittings/assessment-results`, data);
  }
  static getCompetences (node) {
    return Axios.get(`${urlKuizBaseApiWithTenant}/sittings/competences/?competencenode__node_id=${node}`)
  }
  static getProfiles (node, query) {
    return Axios.get(`${urlKuizBaseApiWithTenant}/sittings/skills-profile/?node_id=${node}${query}`)
  }
  static addProfile (data) {
    return Axios.post(`${urlKuizBaseApiWithTenant}/sittings/skills-profile/`, data)
  }
  static editProfile (id, data){
    return Axios.patch(`${urlKuizBaseApiWithTenant}/sittings/skills-profile/${id}/`, data)
  }
  static deleteProfile (data) {
    return Axios.post(`${urlKuizBaseApiWithTenant}/sittings/skills-profile/delete_by_ids/`, data)
  }
  static getReportCompetences (data) {
    return Axios.post(`${urlKuizBaseApiWithTenant}/sittings/competence-report/`, data)
  }
  static getReportProfiles (data){
    /* return Axios.post(`${urlKuizBaseApiWithTenant}/sittings/profiles-report/`, data) */
    return WebApi.ApisType(`/person/profile-report/`, "post", data);
  }

  //Asignaciones por persona
  static getUserListAssessments(data){
    return WebApi.ApisType(`/person/person-assessments/user-assignments-list/`, "post", data);
  }
  static deleteAssessmentUser(data){
    return WebApi.ApisType(`/person/person-assessments/delete-apply/`, "post", data);
  }
  static restartAssessmentUser(data){
    return WebApi.ApisType(`/person/person-assessments/restart-apply/`, "post", data);
  }
  static resetAssessmentUser(data){
    return WebApi.ApisType(`/person/person-assessments/reset-apply/`, "post", data);
  }
  static deleteAssessmentPersonal(data){
    return WebApi.ApisType(`/person/person-assessments/delete_person_assessment/`, "post", data);
  }
}

export default WebApiAssessment;
