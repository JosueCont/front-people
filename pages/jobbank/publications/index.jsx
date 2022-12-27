import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainInter';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    getPublications,
    getProfilesOptions,
    getVacanciesOptions,
    getConnections
} from '../../../redux/jobBankDuck';
import SearchPublications from '../../../components/jobbank/publications/SearchPublications';
import TablePublications from '../../../components/jobbank/publications/TablePublications';
import { getFiltersJB, verifyMenuNewForTenant } from '../../../utils/functions';

const index = ({
    currentNode,
    getPublications,
    getProfilesOptions,
    getVacanciesOptions,
    getConnections
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getProfilesOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
            getConnections(currentNode.id, true);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getPublications(currentNode.id, filters, page);
        }
    },[currentNode, router])

    return (
        <MainLayout currentKey='jb_publications' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                {verifyMenuNewForTenant() && 
                    <Breadcrumb.Item>Reclutamiento y selección</Breadcrumb.Item>
                }
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
        getVacanciesOptions,
        getConnections
    }
)(withAuthSync(index));