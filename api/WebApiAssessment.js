import Axios from "axios";
import { API_ASSESSMENT } from "../config/config";
import WebApi from "./webApi";

class WebApiAssessment {
  static getGroupsAssessments(data) {
    return WebApi.ApisType(
      `/person/group-assessments/?node=${data.nodeId}${data.name}${data.queryParam}`,
      "get"
    );
  }
  static getOnlyGroupAssessment(id) {
    return WebApi.ApisType(`/person/group-assessments/${id}`, "get");
  }
  static getListSurveys(nodeId, queryParam = "") {
    return WebApi.ApisType(
      `/person/assessment/?companies=${nodeId}${queryParam}`,
      "get"
    );
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
    return Axios.get(`${API_ASSESSMENT}/assessments/section/?assessment=${id}`);
  }
  static assessmentQuestions(id) {
    return Axios.get(`${API_ASSESSMENT}/assessments/question/?section=${id}`);
  }
  static assessmentDelete(id) {
    return Axios.delete(`${API_ASSESSMENT}/assessments/assessment/${id}`);
  }
  static assessmentStatus(id, data) {
    return Axios.patch(`${API_ASSESSMENT}/assessments/assessment/${id}/`, data);
  }
  static createSection(data) {
    return Axios.post(API_ASSESSMENT + "/assessments/section/", data);
  }
  static updateSection(id, data) {
    return Axios.patch(`${API_ASSESSMENT}/assessments/section/${id}/`, data);
  }
  static deleteSection(id) {
    return Axios.delete(`${API_ASSESSMENT}/assessments/section/${id}`);
  }
  static createQuestion(data) {
    return Axios.post(API_ASSESSMENT + "/assessments/question/", data);
  }
  static updateQuestion(id, data) {
    return Axios.patch(`${API_ASSESSMENT}/assessments/question/${id}/`, data);
  }
  static deleteQuestion(id) {
    return Axios.delete(`${API_ASSESSMENT}/assessments/question/${id}`);
  }
  static createAnswer(data) {
    return Axios.post(API_ASSESSMENT + "/assessments/answer/", data);
  }
  static updateAnswer(id, data) {
    return Axios.patch(`${API_ASSESSMENT}/assessments/answer/${id}/`, data);
  }
  static getAnswer(id) {
    return Axios.get(`${API_ASSESSMENT}/assessments/question/${id}/`);
  }
  static deleteAnswer(id) {
    return Axios.delete(`${API_ASSESSMENT}/assessments/answer/${id}/`);
  }
  static getAssessmentsByPerson(data) {
    return WebApi.ApisType(
      `/person/person-assessments/my_profile/`,
      "post",
      data
    );
  }
  static getAssessmentResults(data) {
    return Axios.post(`${API_ASSESSMENT}/sittings/assessment-results`, data);
  }
  static getCompetences () {
    return Axios.get(`${API_ASSESSMENT}/sittings/competences`)
  }
  static getProfiles (node, query) {
    return Axios.get(`${API_ASSESSMENT}/sittings/skills-profile/?node=${node}${query}`)
  }
  static addProfile (data) {
    return Axios.post(`${API_ASSESSMENT}/sittings/skills-profile/`, data)
  }
  static editProfile (id, data){
    return Axios.patch(`${API_ASSESSMENT}/sittings/skills-profile/${id}/`, data)
  }
  static deleteProfile (data) {
    return Axios.post(`${API_ASSESSMENT}/sittings/skills-profile/delete_by_ids/`, data)
  }
}

export default WebApiAssessment;
