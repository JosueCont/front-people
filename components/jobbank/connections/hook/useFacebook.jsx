import React, { useEffect } from 'react';

export const useFacebook = () =>{

    useEffect(()=>{
        (async()=>{
            await loadSDK();
        })()
    },[])

    const loadSDK = (
        id = 'facebook-jssdk',
        src = '//connect.facebook.net/en_US/sdk.js'
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

    const getFB = () =>{
        if (!window.FB) {
            console.warn('FB not found');
            return null;
        }
        return window.FB;
    }

    const init = (idApp) =>{
        getFB()?.init({
            appId: idApp,
            localStorage: false,
            version: 'v15.0',
            xfbml: true
        })
    }

    const getStatus = (
        callback = ()=>{},
        isForcingRoudtrip = false
    ) =>{
        const FB = getFB();
        if(!FB){
            callback({status: 'unknown'})
            return;
        }
        FB.getLoginStatus(callback, isForcingRoudtrip);
    }

    const login = (
        callback = ()=>{},
        params = {
            scope: 'public_profile, email',
            return_scopes: true
        }
    ) =>{
        getFB()?.login(callback, params)
    }

    const logout = (
        callback = () =>{}
    ) => {
        getStatus(resp => {
            if(resp.status == 'connected') getFB()?.logout(callback);
            else callback();
        })
    }

    const getProfile = (
        callback = () =>{},
        fields = 'name,email,picture'
    ) =>{
        getFB()?.api('me', {fields}, callback)
    }

    return{
        init,
        login,
        logout,
        getProfile
    }

}