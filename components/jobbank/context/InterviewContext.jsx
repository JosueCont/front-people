import React, {
    createContext,
    useMemo,
    useEffect,
    useState
} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import cookies from 'js-cookie';
import { valueToFilter } from '../../../utils/functions';

export const InterviewContext = createContext();

export const InterviewProvider = ({children}) =>{

    const {
        jobbank_filters,
        jobbank_page,
        list_connections_options,
        load_connections_options,
    } = useSelector(state => state.jobBankStore);
    const [token, setToken] = useState({});
    const [emailCreator, setEmailCreator] = useState('');
    const msgGC = `La configuración no se encuentra activa o esta incompleta`;
    const msgVoid = `No se ha encontrado ninguna configuración para Google Calendar`;

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
            setEmailCreator(response.data?.email)
            if(response.data?.expires_in <= 0){
                cookies.remove('token_gc')
                return 'EXPIRED';
            };
            if(response.data?.expires_in <= 200){
                cookies.remove('token_gc')
                return 'DECLINED';
            };
            return response;
        } catch (e) {
            console.log(e)
            cookies.remove('token_gc')
            return 'ERROR';
        }
    }

    const fetchAction  = async (callback = ()=>{}, item) =>{
        let token = getToken();
        let size = Object.keys(token).length;
        if(size <= 0){
            notification.error({
                message: 'No se ha detectado ninguna sesión iniciada',
                placement: 'topLeft'
            });
            return;
        }
        let resp = await isValidToken(token, item);
        if(resp == 'ERROR'){
            notification.error({
                message: 'Inicie sesión de nuevo',
                description: 'No se pudo validar la sesión',
                placement: 'topLeft'
            });
            return;
        }
        if(resp == 'EXPIRED'){
            notification.info({
                message: 'Inicie sesión de nuevo',
                description: 'La sessión actual ha expirado',
                placement: 'topLeft'
            });
            return;
        }
        if(resp == 'DECLINED'){
            notification.warning({
                message: 'Inicie sesión de nuevo',
                description: 'La sessión actual está por expirar',
                placement: 'topLeft'
            });
            return;
        }
        let emailValid = item?.all_data_response?.organizer?.email;
        if(item && resp.data?.email !== emailValid){
            notification.warning({
                message: 'Acción bloqueada',
                description: 'Solo el organizador del evento puede realizar esta acción',
                placement: 'topLeft'
            });
            return;
        }
        callback();
    }

    const createData = (values) =>{
        let obj = Object.assign({}, values);
        let emails = [...obj.attendees_list];
        const some_ = item => valueToFilter(item.email) == valueToFilter(emailCreator);
        obj.attendees_list = emails.some(some_) ? emails : [...emails, {email: emailCreator}];
        return obj;
    }

    const googleCalendar = useMemo(()=>{
        let config = list_connections_options?.length > 0
            ? list_connections_options?.at(-1)
            : null;
        return {
            config,
            valid: config ? config.is_active && config?.data_config?.CLIENT_ID ? true : false : false,
            msg: config ? config.is_active && config?.data_config?.CLIENT_ID ? '' : msgGC : msgVoid,
        }
    },[list_connections_options])

    return(
        <InterviewContext.Provider value={{
            setToken,
            fetchAction,
            googleCalendar,
            createData,
            token,
        }}>
            {children}
        </InterviewContext.Provider>
    )
}