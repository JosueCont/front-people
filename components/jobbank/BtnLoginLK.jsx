import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { LinkedinOutlined } from '@ant-design/icons';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import WebApiJobBank from '../../api/WebApiJobBank';

const BtnLoginLK = ({
    loading,
    clientID = '',
    client_secret = '',
    redirect_uri = '',
    onSuccess = ()=>{},
}) => {

    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { linkedInLogin } = useLinkedIn({
        clientId: clientID,
        redirectUri: typeof window !== "undefined" ? window.location.origin + "/linkedin" : "" ,
        onSuccess: (code) => {
        //if (code!= ""){
        //      let response = WebApiJobBank.getTokenLK({
        //          code: code,
        //          client_id: clientID,
        //          client_secret: client_secret,
        //          redirect_uri: redirect_uri
        //      });
        //      onSuccess(response);
        //}
            onSuccess(code);
            setCode(code);
        },
        scope: 'r_emailaddress,openid,profile,w_member_social,email',
        onError: (error) => {
            setErrorMessage(error.errorMessage);
            message.error(`No fue posible iniciar LinkedIn, verificar que se han ingresado los datos correctos, o actualizar la página.`);
        }
    });

    const validateLinkLogin = () =>{
        if(!clientID){
            message.error('Configuración incompleta');
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