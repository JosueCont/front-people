import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import { Content, ContentVerify, ContentVertical } from '../components/validation/styled';
import { LoadingOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import WebApiPeople from '../api/WebApiPeople';
import { redirectTo } from '../utils/constant';
import { useRouter } from 'next/router';

const validationKhor = ({userInfo, appsInfo, ...props}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [urlKhor, setUrlKhor] = useState("");
    const [IsViewAdmin, setIsViewAdmin] = useState(false);

    useEffect(() => {
       if(router?.query?.is_admin != undefined){
            setIsViewAdmin(router?.query?.is_admin)
       }
    }, [router.query]);

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
        const url =  IsViewAdmin == "true" ?  `${urlKhor}/apiPerNavigate.asp?type=admin&token=${response.token}` : `${urlKhor}/apiPerNavigate.asp?type=&token=${response.token}`
        setTimeout(()=>{
            redirectTo(url)
        },2000)
    }
    const deniedAccessAdmin = () => {
        setIsLoading(false)
        setIsError(true)
    }
    const successAccessUser = (response) => {
        setIsLoading(false)
        setIsSuccess(true)
        const url = `${urlKhor}/apiPerNavigate.asp?type=&token=${response.token}`;
        setTimeout(()=>{
            redirectTo(url)
        },2000)
    }
    const deniedAccessUser = () => {
        setIsLoading(false)
        setIsError(true)
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