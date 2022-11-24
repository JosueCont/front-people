import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    getPublications,
    getProfilesOptions,
    getVacanciesOptions
} from '../../../redux/jobBankDuck';
import SearchPublications from '../../../components/jobbank/publications/SearchPublications';
import TablePublications from '../../../components/jobbank/publications/TablePublications';

const index = ({
    currentNode,
    getPublications,
    getProfilesOptions,
    getVacanciesOptions
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getPublications(currentNode.id);
            getProfilesOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
        }
    },[currentNode])

    return (
        <MainLayout currentKey='jb_publications' defaultOpenKeys={['job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item>Publicaciones</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
                <SearchPublications/>
                <TablePublications/>
            </div>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState,{
        getPublications,
        getProfilesOptions,
        getVacanciesOptions
    }
)(withAuthSync(index));