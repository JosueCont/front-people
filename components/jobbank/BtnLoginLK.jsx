import React, { useState } from 'react';
import { Button, message } from 'antd';
import { LinkedinOutlined } from '@ant-design/icons';
import { useLinkedIn } from 'react-linkedin-login-oauth2';

const BtnLoginLK = ({
    loading,
    clientID = '',
    redirectURL = '',
    onSuccess = ()=>{},
}) => {

    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { linkedInLogin } = useLinkedIn({
        clientId: clientID,
        redirectUri: redirectURL,
        onSuccess: (code) => {
            onSuccess(code);
            setCode(code);
        },
        scope: 'openid,profile,w_member_social,email',
        onError: (error) => {
            console.log(error);
            setErrorMessage(error.errorMessage);
            message.error(`No fue posible iniciar LinkedIn,por autorización`);
        }
    });

    const validateLinkLogin = () =>{
        if(!clientID){
            message.error('Configuración incompleta: Identificador (ClientID)');
            return;
        }
        if(!redirectURL){
            message.error('Configuración incompleta: Url de redirección');
            return;
        }
        linkedInLogin();
    }

    return (
        <Button
            className='btn-login-facebook'
            onClick={()=> validateLinkLogin()}
            disabled={loading}
            icon={<LinkedinOutlined />}
        >
            Iniciar sesión
        </Button>
    )
}

export default BtnLoginLK