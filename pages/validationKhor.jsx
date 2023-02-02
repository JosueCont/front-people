import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import {
    Content,
    ContentVerify,
    ContentVertical
} from '../components/validation/styled';
import {
    LoadingOutlined,
    CloseCircleFilled,
    CheckCircleFilled,
    InfoCircleFilled
} from '@ant-design/icons';
import WebApiPeople from '../api/WebApiPeople';
import { getCurrentURL, redirectTo } from '../utils/constant';
import { urlPeople } from '../config/config';

const validationKhor = ({userInfo, appsInfo, ...props}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [urlKhor, setUrlKhor] = useState("");

    useEffect(() => {
        if(userInfo != null){
            let data = {
                email: userInfo?.email,
                khonnect_id: userInfo?.khonnect_id,
                node_id: userInfo?.node
            }
            validateUser(data, userInfo?.is_admin)
        }
    }, [userInfo]);

    useEffect(() => {
        if(appsInfo != null){
            setUrlKhor(appsInfo?.khor?.front)
        }
    }, [appsInfo]);

    const validateUser = async (data, isAdmin) =>{
        try {
            let response = await WebApiPeople.validateKhor(data);
            if(response.status == 200){
                redirectUser(response.data, isAdmin)
            }
        } catch (e) {
            setIsLoading(false)
            setIsError(true)
            console.log(e)
            let url = isAdmin ? `${getCurrentURL(true)}.${urlPeople}/home/persons` : `${getCurrentURL(true)}.${urlPeople}/user`;
            // let url = isAdmin ? `${getCurrentURL(true)}.localhost:3000/home/persons` : `${getCurrentURL(true)}.localhost:3000/user`;
            setTimeout(()=>{
                redirectTo(url)
            },2000)
        }
    }


    const redirectUser = (response, isAdmin) =>{
        if(isAdmin){
            if(response.level == "success"){
                successAccessAdmin(response);
            }else{
                deniedAccessAdmin();
            }
        }else{           
            if(response.level == "success"){
                successAccessUser(response);
            }else{
                deniedAccessUser();
            }
        }
    }

    const successAccessAdmin = (response) => {
        setIsLoading(false)
        setIsSuccess(true)
        const url = `${urlKhor}/apiPerNavigate.asp?type=admin&token=${response.token}`;
        setTimeout(()=>{
            redirectTo(url, true)
        },2000)
        setTimeout(()=>{
            // redirectTo(`${getCurrentURL(true)}.localhost:3000/home/persons`)
            redirectTo(`${getCurrentURL(true)}.${urlPeople}/home/persons`)
        },2000)
    }
    const deniedAccessAdmin = () => {
        setIsLoading(false)
        setIsError(true)
        const url = `${getCurrentURL(true)}.${urlPeople}/home/persons`
        // const url = `${getCurrentURL(true)}.localhost:3000/home/persons`;
        setTimeout(()=>{
            redirectTo(url)
        },2000)
    }
    const successAccessUser = (response) => {
        setIsLoading(false)
        setIsSuccess(true)
        const url = `${urlKhor}/apiPerNavigate.asp?type=&token=${response.token}`;
        setTimeout(()=>{
            redirectTo(url, true)
        },2000)
        setTimeout(()=>{
            // redirectTo(`${getCurrentURL(true)}.localhost:3000/user`)
            redirectTo(`${getCurrentURL(true)}.${urlPeople}/user`)
        },2000)
    }
    const deniedAccessUser = () => {
        setIsLoading(false)
        setIsError(true)
        const url = `${getCurrentURL(true)}.${urlPeople}/user`
        // const url = `${getCurrentURL(true)}.localhost:3000/user`;
        setTimeout(()=>{
            redirectTo(url)
        },2000)
    }


  return (
    <Content>
        {isLoading && (
            <ContentVerify>
                <Spin indicator={<LoadingOutlined style={{fontSize:50, color:"white"}} spin />}/>
                <p>Verificando los datos</p>
            </ContentVerify>
        )}
        {isError && (
            <ContentVertical>
                <CloseCircleFilled style={{fontSize:50, color:"#dc3545"}} />
                <p>Acceso denegado</p>
            </ContentVertical>
        )}
        {isSuccess && (
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
        userInfo: state.userStore.user,
        appsInfo: state.userStore.applications
    }
};

export default connect(mapState)(validationKhor);