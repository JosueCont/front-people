import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    getStrategies,
    getClientsOptions,
    getVacanciesOptions
} from '../../../redux/jobBankDuck';
import TableStrategies from '../../../components/jobbank/strategies/TableStrategies';
import SearchStrategies from '../../../components/jobbank/strategies/SearchStrategies';
import { getFiltersJB } from '../../../utils/functions';

const index = ({
    currentNode,
    getStrategies,
    getClientsOptions,
    getVacanciesOptions
}) => {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState('');

    useEffect(()=>{
        if(currentNode){
            getClientsOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page
                ? parseInt(router.query.page)
                : 1;
            let filters = getFiltersJB(router.query);
            getStrategies(currentNode.id, filters, page);
            setCurrentPage(page)
            setCurrentFilters(filters)
        }
    },[currentNode, router])

    return (
        <MainLayout currentKey='jb_strategies' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Reclutamiento y selección</Breadcrumb.Item>
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item>Estrategias</Breadcrumb.Item>
            </Breadcrumb>
            <div className='container' style={{display: 'flex', gap: 24, flexDirection: 'column'}}>
                <SearchStrategies/>
                <TableStrategies currentPage={currentPage} currentFilters={currentFilters}/>
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
        getStrategies,
        getClientsOptions,
        getVacanciesOptions
    }
)(withAuthSync(index));