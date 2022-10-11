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

    static getSectors(id){
        return WebApi.ApisType(`/job-bank/sector/?node=${id}`, 'get');
    }

    static getVacancies(id, query){
        return WebApi.ApisType(`/job-bank/vacant/?node=${id}${query}`, 'get')
    }

    static getInfoVacant(id){
        return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'get')
    }

    static createVacant(data){
        return WebApi.ApisType('/job-bank/vacant/', 'post', data);
    }

    static updateVacant(id, data){
        return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'put', data)
    }

    static deleteVacant(id, data){
        return WebApi.ApisType(`/job-bank/vacant/${id}/`, 'patch', data);
    }
}

export default WebApiJobBank;