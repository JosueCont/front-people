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
    static getListSurveys(nodeId){
        return Axios.get(`${API_ASSESSMENT}/assessments/assessment/?companies=${nodeId}`);
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

    static assignOneTest (data) {
        return WebApi.ApisType(`/person/person-assessments/`, "post", data);
    }

    static getAssignments (nodeId, queryParam) {
        return WebApi.ApisType(`/person/person-assessments/?node=${nodeId}${queryParam}`, "get");
    }
}

export default WebApiAssessment