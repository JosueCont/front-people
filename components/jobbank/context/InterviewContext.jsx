import React, { createContext, useMemo, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getInterviews } from '../../../redux/jobBankDuck';
import { typeHttp, domainApiWithTenant } from '../../../api/axiosApi';
import { notification, message } from 'antd';
import cookies from 'js-cookie';

export const InterviewContext = createContext();

export const InterviewProvider = ({children}) =>{

    const {
        jobbank_filters,
        jobbank_page
    } = useSelector(state => state.jobBankStore);
    const getNode = state => state.userStore.current_node;
    const currentNode = useSelector(getNode);
    const dispatch = useDispatch();
    const [token, setToken] = useState({});
    const baseURL = `${typeHttp}://${domainApiWithTenant}/job-bank/calendar-events/`;
    const headers = {'Content-Type': 'application/json', 'access-token': token.access_token};

    useEffect(()=>{
       let token = getToken();
       setToken(token); 
    },[])

    const getToken = () =>{
        let token_gc = cookies.get('token_gc');
        let jsonToken = token_gc ? JSON.parse(token_gc) : {};
        return jsonToken;
    }

    const isValidToken = async (token) =>{
        try {
            let url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';
            let response = await axios.get(`${url}${token.access_token}`);
            if(response.data?.expires_in <= 0){
                cookies.remove('token_gc')
                return 'EXPIRED';
            };
            if(response.data?.expires_in <= 200){
                cookies.remove('token_gc')
                return 'DECLINED';
            };
            return 'VALID';
        } catch (e) {
            console.log(e)
            cookies.remove('token_gc')
            return 'ERROR';
        }
    }

    const checkToken = async () =>{
        let token = getToken();
        let size = Object.keys(token).length;
        if(size <= 0) return 'EMPTY';
        return await isValidToken(token);
    }

    const fetchAction  = async (callback = ()=>{}) =>{
        let resp = await checkToken();
        if(resp == 'EMPTY'){
            notification.error({
                message: 'No se ha detectado ninguna sesión iniciada',
                description: 'Inicie sesión',
                placement: 'topLeft'
            });
            return;
        }
        if(resp == 'ERROR'){
            notification.error({
                message: 'No se pudo validar la sesión',
                description: 'Inicie sesión de nuevo',
                placement: 'topLeft'
            });
            return;
        }
        if(resp == 'EXPIRED'){
            notification.info({
                message: 'La sessión actual ha expirado',
                description: 'Inicie sesión de nuevo',
                placement: 'topLeft'
            });
            return;
        }
        if(resp == 'DECLINED'){
            notification.warning({
                message: 'La sessión actual está por expirar',
                description: 'Inicie sesión de nuevo',
                placement: 'topLeft'
            });
            return;
        }
        callback();
    }

    const actionCreate = async (values) =>{
        try {
            let body = {...values, node:currentNode.id};
            await axios.post(baseURL, body, {headers});
            dispatch(getInterviews(currentNode.id, jobbank_filters, jobbank_page))
            message.success('Evento registrado');
        } catch (e) {
            console.log(e)
            message.error('Evento no registrado')
        }
    }

    const actionUpdate = async (id, values) =>{
        try {
            await axios.put(`${baseURL}${id}/`, values, {headers});
            dispatch(getInterviews(currentNode.id, jobbank_filters, jobbank_page))
            message.success('Evento actualizado');
        } catch (e) {
            console.log(e)
            message.error('Evento no actualizado');
        }
    }

    const actionDelete = async (event_id) =>{
        try {
            await axios.post(`${baseURL}delete_event/`, {event_id}, {headers});
            dispatch(getInterviews(currentNode.id, jobbank_filters, jobbank_page))
            message.success('Evento eliminado');
        } catch (e) {
            console.log(e)
            message.error('Evento no eliminado')
        }
    }

    return(
        <InterviewContext.Provider value={{
            fetchAction,
            actionCreate,
            actionUpdate,
            actionDelete
        }}>
            {children}
        </InterviewContext.Provider>
    )
}