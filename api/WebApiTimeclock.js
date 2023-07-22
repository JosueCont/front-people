import WebApi from './webApi';
import { axiosApi } from './axiosApi';

class WebApiTimeclock {
    
    static getCompanies(query = '') {
        return WebApi.ApisType(`/business/node/${query}`, 'get')
    }

    static getWorkCenters(node, query = '') {
        return WebApi.ApisType(`/timeclock/workcenter/?node=${node}${query}`, 'get');
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

    static getLogsEvents(node, query) {
        return WebApi.ApisType(`/timeclock/entrylog/?node=${node}${query}`, 'get');
    }

    static getInfoLogEvent(id) {
        return WebApi.ApisType(`/timeclock/entrylog/${id}/`, 'get');
    }
}

export default WebApiTimeclock