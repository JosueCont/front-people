import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../layout/MainInter';
import WebApiPeople from '../../api/WebApiPeople';
import { saveCurrentNode } from '../../redux/UserDuck';
import { connect } from 'react-redux';

const AutoRegister = ({
    children,
    generalConfig,
    saveCurrentNode
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(router.query?.code) getCompay(router.query.code);
    },[router.query?.code])

    const getCompay = async (code) =>{
        try {
            let response = await WebApiPeople.getCompanyPermanentCode(code);
            saveCurrentNode(response.data.results.at(-1))       
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <MainLayout
            hideMenu={true}
            onClickImage={false}
        >
            {children}
        </MainLayout>
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