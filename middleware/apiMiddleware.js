import axios from "axios";
import { domainApi, typeHttp } from "../api/axiosApi";
import fetchAdapter from '@vespaiach/axios-fetch-adapter'

export const apiMiddleware = (req) =>{

    const tenant = req.headers.get('host').split('.')[0];

    const axiosApi = axios.create({
        baseURL: `${typeHttp}://${tenant}.${domainApi}`,
        headers: { "Content-Type": "application/json"},
        adapter: fetchAdapter
    })
    
    class WebApi {
        static personForKhonnectId(data) {
            return axiosApi.post('/person/person/person_for_khonnectid/', data);
        }
    }

    return WebApi;
}