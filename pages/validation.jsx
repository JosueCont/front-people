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
    const [personInfo, setPersonInfo] = useState();
    const [statusConfig, setStatusConfig] = useState(false);

    useEffect(()=>{
        doGetGeneralConfig()
    },[])

    useEffect(()=>{
        if(statusConfig){
            if(router.query.token){
                validateToken(router.query.token)
            }
        }
    },[statusConfig, router.query])

    useEffect(()=>{
        if(general_config && Object.keys(general_config).length > 0){
            if(!statusConfig){
                setStatusConfig(true)
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
        // if(jwt.perms) delete jwt.perms;
        Cookies.remove("token")
        Cookies.set("token", jwt)
        setLoading(false)
        setSuccess(true)
        delStorage("jwt")
        if(router.query.company){
            if(router.query.type){
                setTimeout(()=>{
                    router.push({pathname: "/select-company", query:{company:router.query.company, type:router.query.type}})
                },2000) 
            }else{
                setTimeout(()=>{
                    router.push({pathname: "/select-company", query:{company:router.query.company, app:router.query.app}})
                },2000)
            }          
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
            accessDenied()
        }
    }

    const validateJWT = async (token) =>{
        try {
            let jwt = jwtDecode(token);
            await setStorage("jwt", JSON.stringify(jwt));
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
            let personInfoResponse = await WebApiPeople.getPerson(id);
            if (personInfoResponse.data.sync_from_khor) {
                if (validateCompanyFromKhor(personInfoResponse.data)) {
                    validatePermissionsFromKhor(personInfoResponse.data)
                }
                else {
                    accessDenied()
                }
            }
            else {
                validatePermissions()
            }
        } catch (e) {
            console.log(e)
            accessDenied()
        }
    }

    const validatePermissionsFromKhor = (personData) => {
        if (personData.khor_perms != null) {
            if (router.query.app){
                switch (router.query.app) {
                    case 'ynl':
                        let ynlPermission = personData.khor_perms.filter(item => item === "Khor Plus YNL")
                        if (ynlPermission.length > 0) {
                            validatePermissions()
                        } else {
                            accessDenied()
                        }
                        break
    
                    case 'khorconnect':
                        let khorconnectPermission = personData.khor_perms.filter(item => item === "Khor Plus Red Social")
                        if (khorconnectPermission.length > 0) {
                            validatePermissions()
                        } else {
                            accessDenied()
                        }
                        break
    
                    default:
                        accessDenied()
                }
            }else{
                validatePermissions()
            }
        } else {
            validatePermissions()
        }
    }

    const validateCompanyFromKhor = (personData) => {
        let result = false
        if (personData.nodes != null) {
            for (let node in personData.nodes) {
                if (parseInt(personData.nodes[node].id) === parseInt(router.query.company) && personData.nodes[node].active) {
                    result = true
                    break
                }
            }
        }
        return result
    }

    const validatePermissions = async () =>{
        let jwt = JSON.parse(getStorage("jwt"))
        if(jwt){
            accessSuccess(jwt)
        }else{
            accessDenied()
        }

        // let resp = await setUserPermissions(jwt.perms);
        // if(resp){
        //     accessSuccess(jwt)
        // }else{
        //     accessDenied()
        // }
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
        general_config: state.userStore.general_config,
        userInfo: state.userStore
    }
};

export default connect(
    mapState, {
        setUserPermissions,
        doGetGeneralConfig
    }
)(validation);