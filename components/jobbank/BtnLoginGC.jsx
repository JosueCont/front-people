import React, { useMemo, useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Button, notification, Tooltip } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import cookies from 'js-cookie';
import { InterviewContext } from './context/InterviewContext';

const BtnToLogin = () =>{
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    const SCOPES = 'https://www.googleapis.com/auth/calendar';
    const { setToken } = useContext(InterviewContext);

    const onLogin = (e) =>{
        cookies.remove('token_gc');
        cookies.set('token_gc',JSON.stringify(e));
        setToken(e)
        notification.success({
            message: 'Sesión iniciada',
            description: 'Por razones de seguridad la sesión expirará aproximadamente en 1 hora',
            placement: 'topLeft'
        });
    }

    const onFail = (e) =>{
       cookies.remove('token_gc')
       notification.error({
            message: 'Sesión no iniciada',
            description: 'Intente de nuevo',
            placement: 'topLeft'
        });
    }

    const login = useGoogleLogin({
        onSuccess: onLogin,
        onError: onFail,
        flow: 'implicit',
        scope: SCOPES
    })

    return  (
        <Button onClick={()=> login()}>
            <FcGoogle/>
        </Button>
    )
}

const BtnLoginGC = () => {

    const {
        list_connections_options,
        load_connections_options
    } = useSelector(state => state.jobBankStore);

    const msgGC = `La configuración no se encuentra activa o esta incompleta`;

    const config = useMemo(()=>{
        return list_connections_options?.length > 0
            ? list_connections_options?.at(-1)
            : null;
    },[list_connections_options])

    return config ? (
        <>{config.is_active && config?.data_config?.CLIENT_ID ? (
            <GoogleOAuthProvider clientId={config?.data_config?.CLIENT_ID}>
                <BtnToLogin/>
            </GoogleOAuthProvider>
        ):(
           <Tooltip title={msgGC}>
                <Button disabled={true}>
                    <FcGoogle/>
                </Button>
           </Tooltip>
        )}</>
    ) : null;
}

export default BtnLoginGC