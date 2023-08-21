import WebApi from './webApi';
import { axiosApi } from './axiosApi';

class WebApiOrgStructure {
    
    // NIVELES ORGANIZACIONALES
    
    static getOrgLevels(query = ''){
        return WebApi.ApisType(`/organizationalstructure/organizational-level/${query}`, 'get');
    }

    static getInfoOrgLevel(id){
        return WebApi.ApisType(`/organizationalstructure/organizational-level/${id}/`, 'get');
    }

    static createOrgLevel(data){
        return WebApi.ApisType('/organizationalstructure/organizational-level/', 'post', data);
    }

    static updateOrgLevel(id, data, method = 'put'){
        return WebApi.ApisType(`/organizationalstructure/organizational-level/${id}/`, method, data);
    }

    // NODOS ORGANIZACIONALES

    static getOrgNodes(node, query = ''){
        return WebApi.ApisType(`/organizationalstructure/organizational-node/?node=${node}${query}`, 'get');
    }
    
    static createOrgNode(data){
        return WebApi.ApisType('/organizationalstructure/organizational-node/', 'post', data);
    }

    static updateOrgNode(id, data, method = 'put'){
        return WebApi.ApisType(`/organizationalstructure/organizational-node/${id}/`, method, data);
    }
    
    static deleteOrgNode(id){
        return WebApi.ApisType(`/organizationalstructure/organizational-node/${id}/`, 'delete');
    }

    // NIVELES JERÁRQUICOS

    static getRanks(node, query = ''){
        return WebApi.ApisType(`/organizationalstructure/hierarchical-level/?node=${node}${query}`, 'get');
    }
    
    static createRank(data){
        return WebApi.ApisType('/organizationalstructure/hierarchical-level/', 'post', data);
    }

    static updateaRank(id, data, method = 'put'){
        return WebApi.ApisType(`/organizationalstructure/hierarchical-level/${id}/`, method, data);
    }
    
    static deleteRank(id){
        return WebApi.ApisType(`/organizationalstructure/hierarchical-level/${id}/`, 'delete');
    }
}

export default WebApiOrgStructure