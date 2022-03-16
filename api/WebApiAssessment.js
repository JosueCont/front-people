import Axios from "axios";
import { API_ASSESSMENT, API_URL } from "../config/config";
import { userCompanyId, userId } from "../libs/auth";
import WebApi from "./webApi";

const nodeId = Number.parseInt(userCompanyId());
const idUser = userId();

class WebApiAssessment {
    static getGroupsAssessments(data) {
        return WebApi.ApisType(`/person/group-assessments/?node=${data.nodeId}${data.name}${data.queryParam}`, "get");
    }
    static getOnlyGroupAssessment(id) {
        return Axios.get(`${API_ASSESSMENT}/assessments/group/${id}/`);
    }
    static getListSurveys(nodeId, queryParam){
        return Axios.get(`${API_ASSESSMENT}/assessments/assessment/?companies=${nodeId}${queryParam}`);
    }
    static createGroupAssessments(data){
        return WebApi.ApisType(`/person/group-assessments/`, "post", data)
    }
    static updateGroupAssessments(data, id){
        return WebApi.ApisType(`/person/group-assessments/${id}/`, "put", data);
    }
    static deleteGroupAssessments(data){
        return WebApi.ApisType(`/person/group-assessments/delete_by_ids/`, "post", data);
    }

    static getListPersons(data) {
        return WebApi.ApisType(`/person/person/get_list_persons/`, "post", data);
    }
    static getGroupsPersons(data) {
        return WebApi.ApisType(`/person/group/?node=${data.nodeId}${data.name}${data.queryParam}`, "get");
    }
    static createGroupPersons(data){
        return WebApi.ApisType(`/person/group/`, "post", data);
    }
    static updateGroupPersons(data, id){
        return WebApi.ApisType(`/person/group/${id}/`, "put", data);
    }
    static deleteGroupPersons(data){
        return WebApi.ApisType(`/person/group/delete_by_ids/`, "post", data);
    }

    static assignAssessments (data) {
        return WebApi.ApisType(`/person/person-assessments/`, "post", data);
    }
    static getAssignments (nodeId, queryParam) {
        return WebApi.ApisType(`/person/person-assessments/?node=${nodeId}${queryParam}`, "get");
    }
    static deletePersonAssessment (data) {
        return WebApi.ApisType(`/person/person-assessments/delete_by_ids/`, "post", data);
    }
    static getDetailsAssessment (id) {
        return Axios.get(`${API_ASSESSMENT}/assessments/assessment/${id}/`);
    }

    static getAssignByPerson (id, queryParam, type) {
        return WebApi.ApisType(`/person/person-assessments/?person=${id}${queryParam}${type}`, "get");
    }
    static getAssignByGroup (id, queryParam, type) {
        return WebApi.ApisType(`/person/group-person-assessment/?group_person=${id}${queryParam}${type}`, "get");
    }
    static getCategoriesAssessment () {
        return Axios.get(`${API_ASSESSMENT}/assessments/category-assessment/`);
    }
    static assignAssessmentsGroup (data) {
        return WebApi.ApisType(`/person/group-person-assessment/`, "post", data);
    }
    static createAssessments (data) {
        return WebApi.ApisType(`/person/assessment/`, "post", data);
    }
    static updateAssessments (id, data) {
        return WebApi.ApisType(`/person/assessment/${id}/`, "put", data);
    }
    static getOnlyGroupAssessment(id) {
        return Axios.get(`${API_ASSESSMENT}/assessments/group/${id}/`);
    }
    static assessmentLoadAssessment(id) {
        return  Axios.get( `${API_ASSESSMENT}/assessments/assessment/?companies=${id}`);
    }
    static assessmentSections(id) {
        return  Axios.get(`${API_ASSESSMENT}/assessments/section/?assessment=${id}`);
    }
    static assessmentQuestions(id) {
        return Axios.get(`${API_ASSESSMENT}/assessments/question/?section=${id}`);
    }
    static assessmentDelete(id) {
        return  Axios.delete(`${API_ASSESSMENT}/assessments/assessment/${id}`);
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
    static deleteAnswer(id){
        return Axios.delete(`${API_ASSESSMENT}/assessments/answer/${id}/`);
    }

}

export default WebApiAssessment