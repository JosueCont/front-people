import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { withAuthSync } from '../../../libs/auth';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Breadcrumb } from 'antd';
import SearchProfiles from '../../../components/jobbank/profiles/SearchProfiles';
import TableProfiles from '../../../components/jobbank/profiles/TableProfiles';
import {
    getProfilesList,
    getClientsOptions
} from '../../../redux/jobBankDuck';
import { getFiltersJB } from '../../../utils/functions';

const index = ({
    currentNode,
    getProfilesList,
    getClientsOptions
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getClientsOptions(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getProfilesList(currentNode.id, filters, page);
        }
    },[currentNode, router])

    return (
        <MainLayout  currentKey={'jb_profiles'} defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className={'pointer'}
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item>Template de vacante</Breadcrumb.Item>
            </Breadcrumb>
            <div
                className='container'
                style={{
                    display: 'flex',
                    gap: 24,
                    flexDirection: 'column',
                }}
            >
                <SearchProfiles/>
                <TableProfiles/>    
            </div>
        </MainLayout>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
        getProfilesList,
        getClientsOptions
    }
)(withAuthSync(index));