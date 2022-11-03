import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../layout/MainLayout';
import WebApiPeople from '../../api/WebApiPeople';
import { companySelected } from '../../redux/UserDuck';
import { connect } from 'react-redux';

const AutoRegister = ({
    children,
    generalConfig,
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
                {children}
            </div>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        generalConfig: state.userStore.general_config
    }
}

export default connect(
    mapState, { companySelected }
)(AutoRegister);