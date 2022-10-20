import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../layout/MainLayout';
import RegisterClient from '../../../components/jobbank/clients/RegisterClient';
import WebApiPeople from '../../../api/WebApiPeople';
import { companySelected } from '../../../redux/UserDuck';
import { getSectors } from '../../../redux/jobBankDuck';
import { connect } from 'react-redux';

const index = ({
    currentNode,
    generalConfig,
    getSectors,
    companySelected
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(router.query.uid) getCompay(router.query.uid);
    },[router])

    const getCompay = async (uid) =>{
        try {
            let response = await WebApiPeople.getCompanyPermanentCode(uid);
            const idNode = response.data.results.at(-1).id;
            getSectors(idNode);
            companySelected(idNode, generalConfig);            
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <MainLayout
            hideMenu={true}
            onClickImage={false}
        >
            <div className='content-center'>
                <RegisterClient/>   
            </div>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
        generalConfig: state.userStore.general_config
    }
}

export default connect(
    mapState, {
        companySelected,
        getSectors
    }
)(index);