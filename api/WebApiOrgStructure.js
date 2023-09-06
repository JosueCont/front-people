import WebApi from './webApi';
import { axiosApi } from './axiosApi';

class WebApiOrgStructure {

    // NIVELES ORGANIZACIONALES

    static getOrgLevels(query = '') {
        return WebApi.ApisType(`/organizationalstructure/organizational-level/${query}`, 'get');
    }

    static createOrgLevel(data) {
        return WebApi.ApisType('/organizationalstructure/organizational-level/', 'post', data);
    }

    static updateOrgLevel(id, data, method = 'put') {
        return WebApi.ApisType(`/organizationalstructure/organizational-level/${id}/`, method, data);
    }

    // NODOS ORGANIZACIONALES

    static getOrgNodes(query = '') {
        return WebApi.ApisType(`/organizationalstructure/organizational-node/${query}`, 'get');
    }

    static createOrgNode(data) {
        return WebApi.ApisType('/organizationalstructure/organizational-node/', 'post', data);
    }

    static updateOrgNode(id, data, method = 'put') {
        return WebApi.ApisType(`/organizationalstructure/organizational-node/${id}/`, method, data);
    }

    // NIVELES JERÁRQUICOS

    static getRanks(query = '') {
        return WebApi.ApisType(`/organizationalstructure/hierarchical-level/${query}`, 'get');
    }

    static createRank(data) {
        return WebApi.ApisType('/organizationalstructure/hierarchical-level/', 'post', data);
    }

    static updateRank(id, data, method = 'put') {
        return WebApi.ApisType(`/organizationalstructure/hierarchical-level/${id}/`, method, data);
    }

    // PUESTOS DE TRABAJO

    static getJobs(query = '') {
        return WebApi.ApisType(`/organizationalstructure/job/${query}`, 'get');
    }

    static createJob(data) {
        return WebApi.ApisType('/organizationalstructure/job/', 'post', data);
    }

    static updateJob(id, data, method = 'put') {
        return WebApi.ApisType(`/organizationalstructure/job/${id}/`, method, data);
    }

    // PLAZAS LABORALES

    static getPlaces(query = '') {
        return WebApi.ApisType(`/organizationalstructure/position/${query}`, 'get');
    }

    static createPlace(data) {
        return WebApi.ApisType('/organizationalstructure/position/', 'post', data);
    }

    static updatePlace(id, data, method = 'put') {
        return WebApi.ApisType(`/organizationalstructure/position/${id}/`, method, data);
    }

    static getPlacesHistory(query = '') {
        return WebApi.ApisType(`/organizationalstructure/position-history/${query}`, 'get')
    }

    // TIPOS DE PERSONAS

    static getTypesPersons(node, query = '') {
        return WebApi.ApisType(`/person/person-type/?node=${node}${query}`, 'get');
    }

    static createTypePerson(data) {
        return WebApi.ApisType('/person/person-type/', 'post', data);
    }

    static updateTypePerson(id, data, method = 'put') {
        return WebApi.ApisType(`/person/person-type/${id}/`, method, data);
    }
}

export default WebApiOrgStructure