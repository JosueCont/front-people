import WebApi from './webApi';
import { axiosApi } from './axiosApi';

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

    static getVacanciesSearch(node, query){
        return WebApi.ApisType(`/job-bank/vacant-search/?node=${node}${query}`, 'get');
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

    static updateShowCustomerNameVacant(id, data){
        return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'patch', data);
    }

    static deleteVacant(data){
        // return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'patch', data);
        return WebApi.ApisType('/job-bank/vacant/massive_delete/', 'post', data);
    }

    // Evaluaciones de las vacantes

    static getEvaluationsVacant(id){
        return WebApi.ApisType(`/job-bank/vacant-assessment/?vacant=${id}`, 'get')
    }

    static addEvaluationVacant(data){
        return WebApi.ApisType('/job-bank/vacant-assessment/', 'post', data)
    }

    static updateEvaluation(id, data){
        return WebApi.ApisType(`/job-bank/vacant-assessment/${id}/`, 'put', data)
    }

    static updateStatusEvaluation(id, data){
        return WebApi.ApisType(`/job-bank/vacant-assessment/${id}/`, 'patch', data)
    }

    static deleteEvaluation(id){
        return WebApi.ApisType(`/job-bank/vacant-assessment/${id}/`, 'delete')
    }

    //////////////////////////////

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
        return WebApi.ApisType(`/job-bank/candidate/?node=${node}${query}`, 'get');
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

    static updateCandidateStatus(id, data){
        return WebApi.ApisType(`/job-bank/candidate/${id}/`, 'patch', data);
    }

    static deleteCandidate(data){
        return WebApi.ApisType('/job-bank/candidate/massive_delete/', 'post', data);
    }

    static getCandidateEducation(id, query){
        return WebApi.ApisType(`/job-bank/candidate-education/?candidate=${id}${query}`, 'get');
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

    static getCandidateExperience(id, query){
        return WebApi.ApisType(`/job-bank/candidate-experience/?candidate=${id}${query}`, 'get');
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

    static getCandidateLastJob(id, query){
        return WebApi.ApisType(`/job-bank/candidate-last-job/?candidate=${id}${query}`, 'get');
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

    static getConnections(node, query){
        return WebApi.ApisType(`/job-bank/sharin-setup/?node=${node}${query}`, 'get');
    }

    static createConnection(data){
        return WebApi.ApisType('/job-bank/sharin-setup/', 'post', data);
    }

    static getDetailsConnection(id){
        return WebApi.ApisType(`/job-bank/sharin-setup/${id}/`, 'get');
    }

    static updateConnection(id, data){
        return WebApi.ApisType(`/job-bank/sharin-setup/${id}/`, 'put', data);
    }

    static updateConnectionStatus(id, data){
        return WebApi.ApisType(`/job-bank/sharin-setup/${id}/`, 'patch', data);
    }

    static getTokenFB (data){
        return WebApi.ApisType('/job-bank/get-facebook-token/', 'post', data);
    }

    static getPublications(node, query){
        return WebApi.ApisType(`/job-bank/post-vacant/?node=${node}${query}`, 'get');
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

    static deletePublication(data){
        return WebApi.ApisType('/job-bank/post-vacant/massive_delete/', 'post', data);
    }
     
    static sharePublication(id, data){
        return WebApi.ApisType(`/job-bank/post-vacant/${id}/share/`, 'post', data);
    }

    static getListSelection(node, query){
        return WebApi.ApisType(`/job-bank/candidates-vacancy/?node=${node}${query}`, 'get');
    }

    static createSelection(data){
        return WebApi.ApisType(`/job-bank/candidates-vacancy/`, 'post', data);
    }

    static updateSelection(id, data){
        return WebApi.ApisType(`/job-bank/candidates-vacancy/${id}/`, 'put', data);
    }

    static updateDetailSelection(id, data){
        return WebApi.ApisType(`/job-bank/candidates-vacancy/${id}/`, 'patch', data);
    }

    static updateSelectionStatus(id, data){
        return WebApi.ApisType(`/job-bank/candidates-vacancy/${id}/`, 'patch', data);
    }

    static deleteSelection(id){
        return WebApi.ApisType(`/job-bank/candidates-vacancy/${id}/`, 'delete');
    }

    static getInfoSelection(id){
        return WebApi.ApisType(`/job-bank/candidates-vacancy/${id}/`, 'get');
    }

    //AGENGAS - ENTREVISTAS

    static getInterviews(node, query){
        return WebApi.ApisType(`/job-bank/calendar-events/?node=${node}${query}`, 'get')
    }

    static getDetailInterview(id, headers){
        return axiosApi.get(`/job-bank/calendar-events/${id}/`, {headers});
    }

    static createInterview(data, headers){
        // return WebApi.ApisType('/job-bank/calendar-events/', 'post', data);
        return axiosApi.post('/job-bank/calendar-events/', data, {headers});
    }

    static updateInterview(id, data, headers){
        // return WebApi.ApisType(`/job-bank/calendar-events/${id}/`, 'put', data);
        return axiosApi.put(`/job-bank/calendar-events/${id}/`, data, {headers});
    }

    static deleteInterview(data, headers){
        // return WebApi.ApisType('/job-bank/calendar-events/delete_event/', 'post', data);
        return axiosApi.post('/job-bank/calendar-events/delete_event/', data, {headers});
    }

    //REFERENCIAS, ESTUDIO SOCIOECONOMICO DE CANDIDATOS

    static getReferences(id, query){
        return WebApi.ApisType(`/job-bank/references/?candidate=${id}${query}`, 'get')
    }

    static createReferences(data){
        return WebApi.ApisType('/job-bank/references/', 'post', data)
    }

    static updateReference(id, data){
        return WebApi.ApisType(`/job-bank/references/${id}/`, 'put', data)
    }

    static deleteReference(id){
        return WebApi.ApisType(`/job-bank/references/${id}/`, 'delete')
    }

    //POSTULACIONES

    static getApplications(node, query){
        return WebApi.ApisType(`/job-bank/applications/?node=${node}${query}`, 'get');
    }

    static getInfoApplication(id){
        return WebApi.ApisType(`/job-bank/applications/${id}/`, 'get');
    }

    static getApplicationsCandidates(node, query){
        return WebApi.ApisType(`/job-bank/applications/get_candidates/?node=${node}${query}`, 'get');
    }

    static updateApplications(id, data){
        return WebApi.ApisType(`/job-bank/applications/${id}/`, 'patch', data);
    }

    //LISTADO DE CATÁLOGOS

    static getMainCategories(node, query){
        return WebApi.ApisType(`/job-bank/main-category/?node=${node}${query}`, 'get');
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

    static getSubCategories(node, query){
        return WebApi.ApisType(`/job-bank/sub-category/?node=${node}${query}`,'get');
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

    static getCompetences(node, query){
        return WebApi.ApisType(`/job-bank/competence/?node=${node}${query}`, 'get');
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

    static getAcademics(node, query){
        return WebApi.ApisType(`/job-bank/academics-degree/?node=${node}${query}`, 'get');
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

    static getSectors(node, query){
        return WebApi.ApisType(`/job-bank/sector/?node=${node}${query}`, 'get');
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

    static getProfilesTypes(node, query){
        return WebApi.ApisType(`/job-bank/profile-template/?node=${node}${query}`, 'get');
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

    static updateProfileTypeForm(id, data){
        return WebApi.ApisType(`/job-bank/profile-template/${id}/`, 'patch', data);
    }

    static deleteProfileType(id){
        return WebApi.ApisType(`/job-bank/profile-template/${id}/`, 'delete');
    }

    //BOLSAS DE EMPLEO

    static getJobBoards(node, query){
        return WebApi.ApisType(`/job-bank/job-vacancies/?node=${node}${query}`, 'get');
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

    //ESTADOS

    static getListStates(node, query){
        return WebApi.ApisType(`/job-bank/states/?node=${node}${query}`, 'get');
    }

    // ESCOLARIDAD

    static getScholarship(node, query){
        return WebApi.ApisType(`/job-bank/study-level/?node=${node}${query}`, 'get');
    }

    static createScholarship(data){
        return WebApi.ApisType('/job-bank/study-level/', 'post', data);
    }

    static updateScholarship(id, data){
        return WebApi.ApisType(`/job-bank/study-level/${id}/`, 'put', data);
    }

    static deleteScholarship(id){
        return WebApi.ApisType(`/job-bank/study-level/${id}/`, 'delete');
    }

    //TEMPLATE DE NOTIFICACIONES

    static getTemplateNotification(node, query){
        return WebApi.ApisType(`/job-bank/notification/?node=${node}${query}`, 'get');
    }

    static getInfoNotification(id){
        return WebApi.ApisType(`/job-bank/notification/${id}/`, 'get');
    }

    static createTemplateNotification(data){
        return WebApi.ApisType('/job-bank/notification/', 'post', data);
    }

    static updateTemplateNotification(id, data){
        return WebApi.ApisType(`/job-bank/notification/${id}/`, 'put', data);
    }

    static updateTemplateStatus(id, data){
        return WebApi.ApisType(`/job-bank/notification/${id}/`, 'patch', data);
    }

    static deleteTemplateNotification(id){
        return WebApi.ApisType(`/job-bank/notification/${id}/`, 'delete');
    }

    //TAGS DE NOTIFICACIONES

    static getTagsNotification(node, query){
        return WebApi.ApisType(`/job-bank/notification-tags/?node=${node}${query}`, 'get')
    }

    //LOGS DE PROCESO

    static getProcessLog(id){
        return WebApi.ApisType(`/job-bank/selection-process-log/?process=${id}`, 'get');
    }

    static createProcessLog(data){
        return WebApi.ApisType(`/job-bank/selection-process-log/`, 'post', data);
    }

    static deleteProcessLog(id){
        return WebApi.ApisType(`/job-bank/selection-process-log/${id}/`, 'delete');
    }

    static updateProcessLog(id, data){
        return WebApi.ApisType(`/job-bank/selection-process-log/${id}/`, 'patch', data);
    }

    //EVALUACIONES VACANTE

    static getVacancyAssesmentCandidateVacancy(id){
        return WebApi.ApisType(`/job-bank/vacant-assessment-candidate-vacancy/?candidate_vacancy=${id}`, 'get')
    }

    static addVacancyAssesmentCandidateVacancy(values){
        return WebApi.ApisType('/job-bank/vacant-assessment-candidate-vacancy/', 'post', values)
    }

    static deleteVacancyAssesmentCandidateVacancy(id){
        return WebApi.ApisType(`/job-bank/vacant-assessment-candidate-vacancy/${id}/`, 'delete')
    }
    
    static editVacancyAssesmentCandidateVacancy(id, values){
        return WebApi.ApisType(`/job-bank/vacant-assessment-candidate-vacancy/${id}/`, 'put', values)
    }
}

export default WebApiJobBank;