import WebApi from './webApi';

class WebApiJobBank {

    static getClients(node, query){
        return WebApi.ApisType(`/job-bank/customer/?node=${node}${query}`, 'get');
    }

    static getInfoClient(id){
        return WebApi.ApisType(`/job-bank/customer/${id}/`, 'get');
    }

    static createClient(data){
        return WebApi.ApisType('/job-bank/customer/', 'post', data);
    }

    static updateClient(id, data){
        return WebApi.ApisType(`/job-bank/customer/${id}/`, 'put', data);
    }

    static updateClientStatus(id, data){
        return WebApi.ApisType(`/job-bank/customer/${id}/`, 'patch', data);
    }

    static deleteClient(data){
        return WebApi.ApisType('/job-bank/customer/massive_delete/', 'post', data);
    }

    static getVacancies(node, query){
        return WebApi.ApisType(`/job-bank/vacant/?node=${node}${query}`, 'get');
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

    static duplicateVacant(id){
        return WebApi.ApisType(`/job-bank/vacant/${id}/duplicate/`, 'get');
    }

    static updateVacant(id, data){
        return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'put', data);
    }

    static updateVacantStatus(id, data){
        return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'patch', data);
    }

    static deleteVacant(data){
        // return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'patch', data);
        return WebApi.ApisType('/job-bank/vacant/massive_delete/', 'post', data);
    }

    static getStrategies(node, query){
        return WebApi.ApisType(`/job-bank/strategy/?node=${node}${query}`, 'get')
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

    static getProfilesList(node, query){
        return WebApi.ApisType(`/job-bank/profile/?node=${node}${query}`, 'get');
    }

    static getInfoProfile (id){
        return WebApi.ApisType(`/job-bank/profile/${id}/`, 'get');
    }

    static createProfile(data){
        return WebApi.ApisType('/job-bank/profile/', 'post', data);
    }

    static duplicateProfile(id){
        return WebApi.ApisType(`/job-bank/profile/${id}/duplicate/`, 'get');
    }

    static updateProfile(id, data){
        return WebApi.ApisType(`/job-bank/profile/${id}/`, 'put', data);
    }

    static deleteProfile(data){
        return WebApi.ApisType('/job-bank/profile/massive_delete/', 'post', data);
    }

    static getCandidates(node, query){
        return WebApi.ApisType(`/job-bank/candidate/?=${node}${query}`, 'get');
    }

    static getInfoCandidate(id){
        return WebApi.ApisType(`/job-bank/candidate/${id}/`, 'get');
    }

    static createCandidate(data){
        return WebApi.ApisType('/job-bank/candidate/', 'post', data);
    }

    static updateCandidate(id, data){
        return WebApi.ApisType(`/job-bank/candidate/${id}/`, 'put', data);
    }

    static deleteCandidate(data){
        return WebApi.ApisType('/job-bank/candidate/massive_delete/', 'post', data);
    }

    static getCandidateEducation(id){
        return WebApi.ApisType(`/job-bank/candidate-education/?candidate=${id}`, 'get');
    }

    static createCandidateEducation(data){
        return WebApi.ApisType('/job-bank/candidate-education/', 'post', data);
    }

    static updateCandidateEducation(id, data){
        return WebApi.ApisType(`/job-bank/candidate-education/${id}/`, 'put', data);
    }

    static deleteCandidateEducation(id){
        return WebApi.ApisType(`/job-bank/candidate-education/${id}/`, 'delete');
    }

    static getCandidateExperience(id){
        return WebApi.ApisType(`/job-bank/candidate-experience/?candidate=${id}`, 'get');
    }

    static createCandidateExperience(data){
        return WebApi.ApisType('/job-bank/candidate-experience/', 'post', data);
    }

    static updateCandidateExperience(id, data){
        return WebApi.ApisType(`/job-bank/candidate-experience/${id}/`, 'put', data);
    }

    static deleteCandidateExperience(id){
        return WebApi.ApisType(`/job-bank/candidate-experience/${id}/`, 'delete');
    }

    static getCandidateLastJob(id){
        return WebApi.ApisType(`/job-bank/candidate-last-job/?candidate=${id}`, 'get');
    }

    static createCandidateLastJob(data){
        return WebApi.ApisType('/job-bank/candidate-last-job/', 'post', data);
    }

    static updateCandidateLastJob(id, data){
        return WebApi.ApisType(`/job-bank/candidate-last-job/${id}/`, 'put', data);
    }

    static deleteCandidateLastJob(id){
        return WebApi.ApisType(`/job-bank/candidate-last-job/${id}/`, 'delete');
    }

    static getConnections(node){
        return WebApi.ApisType(`/job-bank/sharin-setup/?node=${node}`, 'get');
    }

    static getTokenFB (data){
        return WebApi.ApisType('/job-bank/get-facebook-token/', 'post', data);
    }

    static updateConnection(id, data){
        return WebApi.ApisType(`/job-bank/sharin-setup/${id}/`, 'put', data);
    }

    static getPublications(node){
        return WebApi.ApisType(`/job-bank/post-vacant/?node=${node}`, 'get');
    }

    static getInfoPublication(id){
        return WebApi.ApisType(`/job-bank/post-vacant/${id}/`, 'get');
    }

    static createPublication(data){
        return WebApi.ApisType('/job-bank/post-vacant/', 'post', data);
    }

    static updatePublication(id, data){
        return WebApi.ApisType(`/job-bank/post-vacant/${id}/`, 'put', data);
    }

    static deletePublication(id, data){
        return WebApi.ApisType(`/job-bank/post-vacant/${id}/`, 'patch', data);
    }
     
    static sharePublication(id, data){
        return WebApi.ApisType(`/job-bank/post-vacant/${id}/share/`, 'post', data);
    }

    //LISTADO DE CATÁLOGOS

    static getMainCategories(node){
        return WebApi.ApisType(`/job-bank/main-category/?node=${node}`, 'get');
    }

    static createMainCategoy(data){
        return WebApi.ApisType('/job-bank/main-category/', 'post', data);
    }

    static updateMainCategory(id, data){
        return WebApi.ApisType(`/job-bank/main-category/${id}/`, 'put', data);
    }

    static deleteMainCategory(id){
        return WebApi.ApisType(`/job-bank/main-category/${id}/`, 'delete');
    }

    static getSubCategories(node){
        return WebApi.ApisType(`/job-bank/sub-category/?node=${node}`,'get');
    }

    static createSubCategory(data){
        return WebApi.ApisType('/job-bank/sub-category/', 'post', data);
    }

    static updateSubCategory(id, data){
        return WebApi.ApisType(`/job-bank/sub-category/${id}/`, 'put', data);
    }

    static deleteSubCategory(id){
        return WebApi.ApisType(`/job-bank/sub-category/${id}/`, 'delete');
    }

    static getCompetences(node){
        return WebApi.ApisType(`/job-bank/competence/?node=${node}`, 'get');
    }

    static createCompetence(data){
        return WebApi.ApisType('/job-bank/competence/', 'post', data);
    }

    static updateCompetence(id, data){
        return WebApi.ApisType(`/job-bank/competence/${id}/`, 'put', data);
    }

    static deleteCompetence(id){
        return WebApi.ApisType(`/job-bank/competence/${id}/`, 'delete');
    }

    static getAcademics(node){
        return WebApi.ApisType(`/job-bank/academics-degree/?node=${node}`, 'get');
    }

    static createAcademic(data){
        return WebApi.ApisType(`/job-bank/academics-degree/`, 'post', data);
    }

    static updateAcademic(id, data){
        return WebApi.ApisType(`/job-bank/academics-degree/${id}/`, 'put', data);
    }

    static deleteAcademic(id){
        return WebApi.ApisType(`/job-bank/academics-degree/${id}`, 'delete');
    }

    static getSectors(node){
        return WebApi.ApisType(`/job-bank/sector/?node=${node}`, 'get');
    }

    static createSector(data){
        return WebApi.ApisType('/job-bank/sector/', 'post', data);
    }

    static updateSector(id, data){
        return WebApi.ApisType(`/job-bank/sector/${id}/`, 'put', data);
    }

    static deleteSector(id){
        return WebApi.ApisType(`/job-bank/sector/${id}/`, 'delete');
    }

    static getProfilesTypes(node){
        return WebApi.ApisType(`/job-bank/profile-template/?node=${node}`, 'get');
    }

    static getInfoProfileType(id){
        return WebApi.ApisType(`/job-bank/profile-template/${id}/`, 'get');
    }

    static createProfileType(data){
        return WebApi.ApisType('/job-bank/profile-template/', 'post', data);
    }

    static updateProfileType(id, data){
        return WebApi.ApisType(`/job-bank/profile-template/${id}/`, 'put', data);
    }

    static deleteProfileType(id){
        return WebApi.ApisType(`/job-bank/profile-template/${id}/`, 'delete');
    }

    static getJobBoards(node){
        return WebApi.ApisType(`/job-bank/job-vacancies/?node=${node}`, 'get');
    }

    static createJobBoard(data){
        return WebApi.ApisType('/job-bank/job-vacancies/', 'post', data);
    }

    static updateJobBoard(id, data){
        return WebApi.ApisType(`/job-bank/job-vacancies/${id}/`, 'put', data);
    }

    static deleteJobBoard(id){
        return WebApi.ApisType(`/job-bank/job-vacancies/${id}/`, 'delete');
    }

    static getSpecializationArea(node){
        return WebApi.ApisType(`/job-bank/specialization-area-study/?node=${node}`, 'get');
    }

    static createSpecializationArea(data){
        return WebApi.ApisType('/job-bank/specialization-area-study/', 'post', data);
    }

    static updateSpecializationArea(id, data){
        return WebApi.ApisType(`/job-bank/specialization-area-study/${id}/`, 'put', data);
    }

    static deleteSpecializationArea(id){
        return WebApi.ApisType(`/job-bank/specialization-area-study/${id}/`, 'delete');
    }
}

export default WebApiJobBank;