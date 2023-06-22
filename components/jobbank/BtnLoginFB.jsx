import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import { FacebookFilled } from '@ant-design/icons';
import { FacebookLoginClient } from '@greatsumini/react-facebook-login';

const BtnLoginFB = ({
    loading,
    appID = '',
    onSuccess = ()=>{},
}) => {

    useEffect(()=>{
        (async ()=>{
            await FacebookLoginClient.loadSdk('en_US', false);
        })();
    },[])

    useEffect(()=>{
        if(!appID) return;
        FacebookLoginClient.init({
            appId: appID,
            version: 'v14.0',
            localStorage: false,
            xfbml: true
        });
    },[appID])

    const onFail = (response) =>{
        let msgError = {
            'facebookNotLoaded': 'No fue posible iniciar facebook, actualizar la página',
            'loginCancelled': 'Inicio de sesión cancelado/fallido',
            'appIDVoid': 'Configuración incompleta',
        }
        message.error(msgError[response.status])
    }

    const onLogout = (response) =>{
        console.log('logout', response)
    }

    const validateResp = (resp) =>{
        if(!resp.authResponse){
            onFail({status: 'loginCancelled'});
            return;
        }
        onSuccess(resp.authResponse);
        /* FacebookLoginClient.logout(onLogout); */
    }

    const validateLogin = () =>{
        if(!appID){
            onFail({status: 'appIDVoid'})
            return;
        }
        if (!window.FB){
            onFail({status: 'facebookNotLoaded'});
            return;
        }
        try {
            FacebookLoginClient.login(validateResp, {
                scope: `email,
                    public_profile,
                    pages_show_list,
                    pages_manage_posts,
                    instagram_basic,
                    instagram_content_publish,
                `
            });
        } catch (e) {
            console.log(e)
            message.error(`No fue posible iniciar facebook,
                verificar que se han ingresado los datos correctos, o
                actualizar la página.`);
        }
    }

    return (
        <Button
            className='btn-login-facebook'
            onClick={()=> validateLogin()}
            disabled={loading}
            icon={<FacebookFilled />}
        >
            Iniciar sesión
        </Button>
    )
}

export default BtnLoginFB