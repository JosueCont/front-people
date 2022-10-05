import WebApi from './webApi';

class WebApiJobBank {

    static getClients(id){
        return WebApi.ApisType(`/job-bank/customer/?node=${id}`, 'get');
    }

    static createClient(data){
        return WebApi.ApisType('/job-bank/customer/', 'post', data);
    }

    static updateClient(id, data){
        return WebApi.ApisType(`/job-bank/customer/${id}/`, 'put', data);
    }

    static deleteClient(id, data){
        return WebApi.ApisType(`/job-bank/customer/${id}/`, 'patch', data);
    }

    static getSectors(id){
        return WebApi.ApisType(`/job-bank/sector/?node=${id}`, 'get');
    }
}

export default WebApiJobBank;