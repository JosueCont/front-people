import Axios from "axios";
import { API_ASSESSMENT, API_URL } from "../config/config";
import { userCompanyId, userId } from "../libs/auth";

const nodeId = Number.parseInt(userCompanyId());
const idUser = userId();

class WebApiAssessment {
    
    static getGroupsAssessments(data) {
      return Axios.get(`${API_URL}/person/group-assessments/?node=${data.nodeId}${data.name}${data.queryParam}`);
    }
    static getOnlyGroupAssessment(id) {
        return Axios.get(`${API_ASSESSMENT}/assessments/group/${id}/`);
    }
    static getListSurveys(nodeId){
        return Axios.get(`${API_ASSESSMENT}/assessments/assessment/?companies=${nodeId}`);
    }
    static createGroupAssessments(data){
        return Axios.post(`${API_URL}/person/group-assessments/`, data);
    }
    static updateGroupAssessments(data, id){
        return Axios.put(`${API_URL}/person/group-assessments/${id}/`, data);
    }
    static deleteGroupAssessments(data){
        return Axios.post(`${API_URL}/person/group-assessments/delete_by_ids/`, data);
    }

    static getListPersons(data) {
        return Axios.post(`${API_URL}/person/person/get_list_persons/`, data);
    }
    static getGroupsPersons(data) {
        return Axios.get(`${API_URL}/person/group/?node=${data.nodeId}${data.name}${data.queryParam}`);
    }
    static createGroupPersons(data){
        return Axios.post(`${API_URL}/person/group/`, data);
    }
    static updateGroupPersons(data, id){
        return Axios.put(`${API_URL}/person/group/${id}/`, data);
    }
    static deleteGroupPersons(data){
        return Axios.post(`${API_URL}/person/group/delete_by_ids/`, data);
    }
}

export default WebApiAssessment