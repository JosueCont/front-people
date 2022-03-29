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
    delStorage
} from '../libs/auth';


const validation = ({general_config, setUserPermissions}) => {

    const router = useRouter();
    const { token } = router.query;
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [infoExist, setInfoExist] = useState(false);
    const [userExist, setUserExist] = useState(false);

    useEffect(()=>{
        if(token){
            validateToken(token)
        }
    },[token])

    const validateToken = async (token) =>{
        let response = await validateTokenKhonnect(general_config, {token: token});
        if(response.status == 200){
            let jwt = jwtDecode(response.data.data.token);
            setStorage("token", response.data.data.token);
            setStorage("jwt", JSON.stringify(jwt));
            validateIntranet(jwt.user_id)
        }else{
            setLoading(false)
            setError(true)
        }
    }

    const validateIntranet = async (id) =>{
        let response = await WebApiIntranet.getUserIntranet(id);
        if(response.status == 200){
            validateProfile(response.data.at(-1).person.id)
        }else{
            setLoading(false)
            setError(true)
        }
    }

    const validateProfile = async (id) =>{
        let response = await WebApiPeople.getPerson(id);
        if(response.status == 200){
            validateJWT()
        }else{
            setLoading(false)
            setError(true)
        }
    }

    const validateJWT = async () =>{
        let jwt = JSON.parse(getStorage("jwt"))
        const data = {
            khonnect_id: jwt.user_id,
            jwt: jwt
        }
        let response = await WebApiPeople.saveJwt(data);
        if(response.status == 200){
            validatePermissions()
        }else{
            setLoading(false)
            setError(true)
        }
    }

    const validatePermissions = async () =>{
        let token = getStorage("token");
        let jwt = JSON.parse(getStorage("jwt"))
        let resp = await setUserPermissions(jwt.perms);
        if(resp){
            delete jwt.perms;
            Cookies.set("token", jwt)
            Cookies.set("token_user", token)
            setSuccess(true)
            setLoading(false)
            delStorage("token")
            delStorage("jwt")
            router.push({pathname: "/select-company"})
        }else{
            setLoading(false)
            setError(true)
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
            {/* {infoExist && (
                <ContentVertical>
                    <InfoCircleFilled style={{fontSize:50, color:"#17a2b8"}}/>
                    <p>Información no encontrada</p>
                </ContentVertical>
            )} */}
        </Content>
    )
}

const mapState = (state) => {
    return {
        general_config: state.userStore.general_config
    }
};

export default connect(mapState, {setUserPermissions})(validation);