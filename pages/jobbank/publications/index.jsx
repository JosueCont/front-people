import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    getPublications,
    getProfilesOptions,
    getVacanciesOptions,
    getConnectionsOptions
} from '../../../redux/jobBankDuck';
import SearchPublications from '../../../components/jobbank/publications/SearchPublications';
import TablePublications from '../../../components/jobbank/publications/TablePublications';
import { getFiltersJB } from '../../../utils/functions';

const index = ({
    currentNode,
    getPublications,
    getProfilesOptions,
    getVacanciesOptions,
    getConnectionsOptions
}) => {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState('');

    useEffect(()=>{
        if(currentNode){
            getProfilesOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
            getConnectionsOptions(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getPublications(currentNode.id, filters, page);
            setCurrentPage(page)
            setCurrentFilters(filters)
        }
    },[currentNode, router.query])

    return (
        <MainLayout currentKey='jb_publications' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Reclutamiento y selección</Breadcrumb.Item>
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item>Publicaciones</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
                <SearchPublications/>
                <TablePublications currentPage={currentPage} currentFilters={currentFilters}/>
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
        getConnectionsOptions
    }
)(withAuthSync(index));