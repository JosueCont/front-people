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
        window.FB.init({
            appId: idApp,
            localStorage: false,
            version: 'v15.0',
            xfbml: true,
            status: false
        })
    }

    const onChangeStatusFB = () =>{
        return new Promise((resolve, reject) =>{
            window.FB.Event.subscribe('auth.statusChange', (response) =>{
                response.status === 'connected' ? resolve(response) : reject(response);
            })
        })
    }

    const getStatus = () =>{
        return new Promise((resolve, reject) => {
            window.FB.getLoginStatus((response) => {
                response.status === 'connected' ? resolve(response) : reject(response);
            });
        });
    }

    const loginFB = () =>{
        return new Promise((resolve, reject) => {
            window.FB.login((response) => {
                response.status === 'connected' ? resolve(response) : reject(response);
            }, {scope: 'public_profile, email', return_scopes: true});
        });
    }

    const logoutFB = () => {
        return new Promise((resolve, reject) => {
            window.FB.logout(resolve);
        });
    }

    const getProfileFB = () =>{
        let fields = 'first_name, last_name, email, picture, gender';
        return new Promise((resolve, reject) => {
            window.FB.api('/me', {fields}, response => response.error ? reject(response) : resolve(response));
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