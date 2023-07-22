import WebApi from './webApi';
import { axiosApi } from './axiosApi';

class WebApiTimeclock {
    
    static getCompanies(query) {
        return WebApi.ApisType(`/business/node/${query}`, 'get')
    }

    static getWorkCenters(query) {
        return WebApi.ApisType(`/timeclock/workcenter/${query}`, 'get');
    }

    static getInfoWorkCenter(id) {
        return WebApi.ApisType(`/timeclock/workcenter/${id}/`, 'get');
    }

    static createWorkCenter(data) {
        return WebApi.ApisType('/timeclock/workcenter/', 'post', data);
    }

    static updateWorkCenter(id, data) {
        return WebApi.ApisType(`/timeclock/workcenter/${id}/`, 'patch', data);
    }

    static deleteWorkCenter(id) {
        return WebApi.ApisType(`/timeclock/workcenter/${id}/`, 'delete');
    }

    // Logs de eventos

    static getLogsEvents(query) {
        return WebApi.ApisType(`/timeclock/entrylog/${query}`, 'get');
    }

    static getInfoLogEvent(id) {
        return WebApi.ApisType(`/timeclock/entrylog/${id}/`, 'get');
    }
}

export default WebApiTimeclock