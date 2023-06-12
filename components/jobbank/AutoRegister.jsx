import React, { useEffect } from 'react';
import MainInter from '../../layout/MainInter';
import WebApiPeople from '../../api/WebApiPeople';
import { saveCurrentNode } from '../../redux/UserDuck';
import { connect } from 'react-redux';
import esES from 'antd/lib/locale/es_ES';
import { ConfigProvider } from 'antd';

const AutoRegister = ({
    children,
    saveCurrentNode,
    currentCode = null,
    currentNode = null
}) => {

    useEffect(()=>{
        if(currentNode && !currentCode){
            getCompanyByNode();
            return;
        }
        if(currentCode && !currentNode){
            getCompanyByCode();
            return;
        }
    },[currentNode, currentCode])

    const getCompanyByNode = async () =>{
        try {
            let response = await WebApiPeople.getCompany(currentNode);
            saveCurrentNode(response.data)
        } catch (e) {
            console.log()
        }
    }

    const getCompanyByCode = async () =>{
        try {
            let response = await WebApiPeople.getCompanyPermanentCode(currentCode);
            saveCurrentNode(response.data?.results?.at(-1))       
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <MainInter
            hideMenu={true}
            onClickImage={false}
            autoregister={true}
            hideProfile={true}
        >
            <ConfigProvider locale={esES}>
                {children}
            </ConfigProvider>
        </MainInter>
    )
}

const mapState = (state) =>{
    return{
        generalConfig: state.userStore.general_config
    }
}

export default connect(
    mapState, { saveCurrentNode }
)(AutoRegister);