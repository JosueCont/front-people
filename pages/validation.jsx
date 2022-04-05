import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { validateTokenKhonnect } from '../api/apiKhonnect';
import WebApiIntranet from '../api/WebApiIntranet';
import WebApiPeople from '../api/WebApiPeople';
import { setUserPermissions } from '../redux/UserDuck';
import {
    LoadingOutlined,
    CloseCircleFilled,
    CheckCircleFilled,
    InfoCircleFilled
} from '@ant-design/icons';
import {
    Content,
    ContentVerify,
    ContentVertical
} from '../components/validation/styled';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import {
    setStorage,
    getStorage,
    delStorage,
    logoutAuth
} from '../libs/auth';


const validation = ({general_config, setUserPermissions, ...props}) => {

    const router = useRouter();
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [generalConfig, setGeneralConfig] = useState({});

    useEffect(()=>{
        getConfigApp()
    },[])

    // useEffect(()=>{
    //     if(router.query.token && general_config){
    //         validateToken(router.query.token)
    //     }
    // },[router.query])

    useEffect(()=>{
        if(Object.keys(generalConfig).length > 0){
            if(router.query.token){
                validateToken(router.query.token)
            }
        }
    },[generalConfig])

    const getConfigApp = async () =>{
        try {
            let response = await WebApiPeople.getGeneralConfig();
            setGeneralConfig(response.data);
        } catch (e) {
            console.log(e)
        }
    }

    const accessDenied = () =>{
        setLoading(false)
        setError(true)
        setTimeout(()=>{
          logoutAuth()
        },2000)
    }

    const accessSuccess = (token, jwt) =>{
        delete jwt.perms;
        Cookies.set("token", jwt)
        Cookies.set("token_user", token)
        setLoading(false)
        setSuccess(true)
        delStorage("token")
        delStorage("jwt")
        setTimeout(()=>{
            router.push({pathname: "/select-company"})
        },2000)
    }

    const validateToken = async (token) =>{
        try {
            let response = await validateTokenKhonnect(general_config, {token: token});
            let jwt = jwtDecode(response.data.data.token);
            setStorage("token", response.data.data.token);
            setStorage("jwt", JSON.stringify(jwt));
            validateIntranet(jwt.user_id)
        } catch (e) {
            console.log(e)
            accessDenied()
        }
    }

    const validateIntranet = async (id) =>{
        try {
            let response = await WebApiIntranet.getUserIntranet(id);
            validateProfile(response.data.at(-1).person.id)
        } catch (e) {
            console.log(e)
            accessDenied()
        }
    }

    const validateProfile = async (id) =>{
        try {
            await WebApiPeople.getPerson(id);
            validateJWT()
        } catch (e) {
            console.log(e)
            accessDenied()
        }
    }

    const validateJWT = async () =>{
        try {
            let jwt = JSON.parse(getStorage("jwt"))
            await WebApiPeople.saveJwt({
                khonnect_id: jwt.user_id,
                jwt: jwt
            });
            validatePermissions()
        } catch (e) {
            console.log(e)
            accessDenied()
        }
    }

    const validatePermissions = async () =>{
        let token = getStorage("token");
        let jwt = JSON.parse(getStorage("jwt"))
        let resp = await setUserPermissions(jwt.perms);
        if(resp){
            accessSuccess(token, jwt)
        }else{
            accessDenied()
        }
    }

    return (
        <Content>
            {loading && (
                <ContentVerify>
                    <Spin indicator={<LoadingOutlined style={{fontSize:50, color:"white"}} spin />}/>
                    <p>Verificando los datos</p>
                </ContentVerify>
            )}
            {error && (
                <ContentVertical>
                    <CloseCircleFilled style={{fontSize:50, color:"#dc3545"}} />
                    <p>Acceso denegado</p>
                </ContentVertical>
            )}
            {success && (
                <ContentVertical>
                    <CheckCircleFilled style={{fontSize:50, color:"#28a745"}} />
                    <p>Acceso correcto</p>
                </ContentVertical>
            )}
        </Content>
    )
}

const mapState = (state) => {
    return {
        general_config: state.userStore.general_config
    }
};

export default connect(mapState, {setUserPermissions})(validation);