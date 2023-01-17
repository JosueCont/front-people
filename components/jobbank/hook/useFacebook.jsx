import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';

export const useFacebook = () =>{

    const [isReadyFB, setIsReadyFB] = useState(false);

    useLayoutEffect(()=>{
        initialize();
    },[])

    const initialize = async () =>{
        try {
            await loadSDK();
            setIsReadyFB(true)
        } catch (e) {
            console.log(e)
            setIsReadyFB(false)
        }
    }

    const loadSDK = (
        id = 'facebook-jssdk',
        src = 'https://connect.facebook.net/en_US/sdk.js'
    ) =>{
        return new Promise((resolve) => {
            const fjs = document.getElementsByTagName('script')[0];
            if (document.getElementById(id)) return;
            const js = document.createElement('script');
            js.id = id;
            js.src = src;
            js.onload = resolve;
            fjs.parentNode.insertBefore(js, fjs);
        });
    }


    const initFB = (idApp) =>{
        window.FB?.init({
            appId: idApp,
            localStorage: false,
            version: 'v15.0',
            xfbml: true
        })
    }

    const onChangeStatusFB = () =>{
        return new Promise((resolve, reject) =>{
            const change_ = response => response.status == 'connected' ? resolve(response) : reject(response);
            window.FB?.Event?.subscribe('auth.statusChange', change_);
        })
    }

    const getStatus = () =>{
        return new Promise((resolve, reject) => {
            const status_ = response => response.status == 'connected' ? resolve(response) : reject(response);
            window.FB.getLoginStatus(status_);
        });
    }

    const loginFB = async ({
        scope = 'email, public_profile'
    }) =>{
        return new Promise((resolve, reject) => {
            const login_ = response => response.status == 'connected' ? resolve(response) : reject(response);
            window.FB?.login(login_, {scope, return_scopes: true});
        })
    }

    const logoutFB = () => {
        return new Promise((resolve, reject) => {
            const logout_ = response => resolve('logout');
            window.FB?.logout(logout_);
        });
    }

    const getProfileFB = () =>{
        const fields = 'first_name, last_name, email, picture, gender';
        return new Promise((resolve, reject) => {
            const profile = response => response.error ? resolve(response) : reject(response);
            window.FB?.api('/me', {fields}, profile);
        });
    }

    return{
        initFB,
        loginFB,
        logoutFB,
        getProfileFB,
        isReadyFB,
        onChangeStatusFB,
        getStatus
    }

}