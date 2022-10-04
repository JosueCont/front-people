import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { validateTokenKhonnect } from '../api/apiKhonnect';
import WebApiIntranet from '../api/WebApiIntranet';
import WebApiPeople from '../api/WebApiPeople';
import {
    doGetGeneralConfig,
    setUserPermissions
} from '../redux/UserDuck';
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


const validation = ({general_config, setUserPermissions, doGetGeneralConfig, ...props}) => {

    const router = useRouter();
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        doGetGeneralConfig()
    },[])

    useEffect(()=>{
        if(general_config && Object.keys(general_config).length > 0){
            if(router.query.token){
                validateToken(router.query.token)
            }
        }
    },[general_config])

    const accessDenied = () =>{
        setLoading(false)
        setError(true)
        setTimeout(()=>{
          logoutAuth()
        },2000)
    }

    const accessSuccess = (jwt) =>{
        if(jwt.perms) delete jwt.perms;
        Cookies.remove("token")
        Cookies.set("token", jwt)
        setLoading(false)
        setSuccess(true)
        delStorage("jwt")
        if(router.query.company){
            setTimeout(()=>{
                router.push({pathname: "/select-company", query:{company:router.query.company}})
            },2000)
        }else{
            setTimeout(()=>{
                router.push({pathname: "/select-company"})
            },2000)
        }
    }

    const validateToken = async (token) =>{
        try {
            let response = await validateTokenKhonnect(general_config, {token: token});
            // let jwt = jwtDecode(response.data.data.token);
            // setStorage("token", response.data.data.token);
            // setStorage("jwt", JSON.stringify(jwt));
            // validateIntranet(jwt.user_id)
            validateJWT(response.data.data.token)
        } catch (e) {
            console.log(e)
            accessDenied()
        }
    }

    const validateJWT = async (token) =>{
        try {
            let jwt = jwtDecode(token);
            setStorage("jwt", JSON.stringify(jwt));
            let response = await WebApiPeople.saveJwt({
                khonnect_id: jwt.user_id,
                jwt: {...jwt, metadata: [{token: token}]}
            });
            validateIntranet(jwt.user_id);
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
            validatePermissions()
        } catch (e) {
            console.log(e)
            accessDenied()
        }
    }

    const validatePermissions = async () =>{
        let jwt = JSON.parse(getStorage("jwt"))
        let resp = await setUserPermissions(jwt.perms);
        if(resp){
            accessSuccess(jwt)
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

export default connect(
    mapState, {
        setUserPermissions,
        doGetGeneralConfig
    }
)(validation);