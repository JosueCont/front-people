import Axios from "axios";
import { API_ASSESSMENT, API_URL } from "../config/config";
import { userCompanyId, userId } from "../libs/auth";

const nodeId = Number.parseInt(userCompanyId());
const idUser = userId();

class WebApiAssessment {
    
    static getGroupsAssessments(queryParam) {
      return Axios.get(`${API_ASSESSMENT}/assessments/group/?company=${nodeId}${queryParam}`);
    }
    static getListSurveys(){
        return Axios.get(`${API_ASSESSMENT}/assessments/assessment/?companies=${nodeId}`);
    }
    static createGroupAssessments(data){
        // return Axios.post(`${API_ASSESSMENT}/assessments/group/`, {...data, company: nodeId});
        return Axios.post(`${API_URL}/person/group-assessments/`, data);
    }
    static updateGroupAssessments(data, id){
        return Axios.put(`${API_ASSESSMENT}/assessments/group/${id}/`, {...data, node: nodeId});
    }
    static deleteGroupAssessments(id){
        return Axios.delete(`${API_ASSESSMENT}/assessments/group/${id}/`);
    }

    static getListPersons() {
        return Axios.post(`${API_URL}/person/person/get_list_persons/`, {node: nodeId});
    }
    static getGroupsPersons(queryParam) {
        return Axios.get(`${API_URL}/person/group/?company=${nodeId}${queryParam}`);
    }
    static createGroupPersons(data){
        return Axios.post(`${API_URL}/person/group/`, {...data, node: nodeId});
    }
    static updateGroupPersons(data, id){
        return Axios.put(`${API_URL}/person/group/${id}/`, {...data, node: nodeId});
    }
    static deleteGroupPersons(data){
        return Axios.post(`${API_URL}/person/group/delete_by_ids/`, data);
    }
}

export default WebApiAssessment