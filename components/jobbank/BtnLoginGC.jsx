import React, { useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Button, notification, Tooltip } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
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
       <Tooltip title='Iniciar sesión'>
            <Button onClick={()=> login()}>
                <FcGoogle/>
            </Button>
       </Tooltip>
    )
}

const BtnLoginGC = () => {

    const { googleCalendar } = useContext(InterviewContext);

    return googleCalendar.valid ? (
        <GoogleOAuthProvider clientId={googleCalendar?.config?.data_config?.CLIENT_ID}>
            <BtnToLogin/>
        </GoogleOAuthProvider>
    ) : (
        <Tooltip title={googleCalendar.msg}>
            <Button disabled={true}>
                <FcGoogle/>
            </Button>
        </Tooltip>
    );
}

export default BtnLoginGC;