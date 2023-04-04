import axios from "axios";
import { domainApi, typeHttp, axiosApi } from "../api/axiosApi";
import fetchAdapter from '@vespaiach/axios-fetch-adapter'

export const apiMiddleware = (req) =>{

    const tenant = req.headers.get('host').split('.')[0];
    axiosApi.defaults.adapter = fetchAdapter;
    axiosApi.defaults.baseURL = `${typeHttp}://${tenant}.${domainApi}`;

    return axiosApi
}