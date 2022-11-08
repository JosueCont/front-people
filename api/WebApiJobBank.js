import WebApi from './webApi';

class WebApiJobBank {

    static getClients(id, query){
        return WebApi.ApisType(`/job-bank/customer/?node=${id}${query}`, 'get');
    }

    static createClient(data){
        return WebApi.ApisType('/job-bank/customer/', 'post', data);
    }

    static updateClient(id, data){
        return WebApi.ApisType(`/job-bank/customer/${id}/`, 'put', data);
    }

    static activeClient(id, data){
        return WebApi.ApisType(`/job-bank/customer/${id}/`, 'patch', data);
    }

    static deleteClient(data){
        return WebApi.ApisType('/job-bank/customer/massive_delete/', 'post', data);
    }

    static getSectors(id){
        return WebApi.ApisType(`/job-bank/sector/?node=${id}`, 'get');
    }

    static getVacancies(id, query){
        return WebApi.ApisType(`/job-bank/vacant/?node=${id}${query}`, 'get');
    }

    static getVacantFields(node){
        return WebApi.ApisType(`/job-bank/vacant/fields/?node=${node}`, 'post');
    }

    static getInfoVacant(id){
        return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'get');
    }

    static createVacant(data){
        return WebApi.ApisType('/job-bank/vacant/', 'post', data);
    }

    static updateVacant(id, data){
        return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'put', data);
    }

    static deleteVacant(data){
        // return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'patch', data);
        return WebApi.ApisType('job-bank/vacant/massive_delete/', 'post', data);
    }

    static getCompetences(id){
        return WebApi.ApisType(`/job-bank/competence/?node=${id}`, 'get');
    }

    static getAcademics(id){
        return WebApi.ApisType(`/job-bank/academics-degree/?node=${id}`, 'get');
    }

    static getMainCategories(id){
        return WebApi.ApisType(`/job-bank/main-category/?node=${id}`, 'get');
    }

    static getSubCategories(id){
        return WebApi.ApisType(`/job-bank/sub-category/?node=${id}`,'get');
    }

    static getStrategies(id, query){
        return WebApi.ApisType(`/job-bank/strategy/?node=${id}${query}`, 'get')
    }

    static getInfoStrategy(id){
        return WebApi.ApisType(`/job-bank/strategy/${id}/`, 'get');
    }

    static createStrategy(data){
        return WebApi.ApisType('/job-bank/strategy/', 'post', data);
    }

    static updateStrategy(id, data){
        return WebApi.ApisType(`/job-bank/strategy/${id}/`, 'put', data)
    }

    static deleteStrategy(data){
        return WebApi.ApisType('/job-bank/strategy/massive_delete/', 'post', data);
    }

    static getProfilesTypes(node){
        return WebApi.ApisType(`/job-bank/profile-template/?node=${node}`, 'get');
    }

    static getProfilesList(node, query){
        return WebApi.ApisType(`/job-bank/profile/?node=${node}${query}`, 'get');
    }

    static getInfoProfile (id){
        return WebApi.ApisType(`/job-bank/profile/${id}/`, 'get');
    }

    static createProfile(data){
        return WebApi.ApisType('/job-bank/profile/', 'post', data);
    }

    static updateProfile(id, data){
        return WebApi.ApisType(`/job-bank/profile/${id}/`, 'put', data);
    }

    static deleteProfile(data){
        return WebApi.ApisType('/job-bank/profile/massive_delete/', 'post', data);
    }

    static getCandidates(node, query){
        // return WebApi.ApisType(`/job-bank/candidates/?=${node}${query}`, 'get');
    }

    static getInfoCandidate(id){
        // return WebApi.ApisType(`/job-bank/candidates/${id}/`, 'get');
    }

    static createCandidate(data){
        // return WebApi.ApisType('/job-bank/candidates/', 'post', data);
    }

    static updateCandidate(id, data){
        // return WebApi.ApisType(`/job-bank/candidates/${id}/`, 'put', data);
    }

    static deleteCandidate(data){
        // return WebApi.ApisType('/job-bank/candidates/massive_delete/', 'post', data);
    }
}

export default WebApiJobBank;