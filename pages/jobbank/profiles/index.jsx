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

const index = ({
    currentNode,
    getProfilesList,
    getClientsOptions
}) => {

    useEffect(()=>{
        if(currentNode){
            getProfilesList(currentNode.id);
            getClientsOptions(currentNode.id);
        }
    },[currentNode])

    return (
        <MainLayout  currentKey={'jb_profiles'} defaultOpenKeys={['job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className={'pointer'}
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item>Perfiles de vacante</Breadcrumb.Item>
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