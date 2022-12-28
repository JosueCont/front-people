import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainInter';
import { withAuthSync } from '../../../libs/auth';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Breadcrumb } from 'antd';
import { getFiltersJB, verifyMenuNewForTenant } from '../../../utils/functions';
import SearchSelection from '../../../components/jobbank/selection/SearchSelection';
import TableSelection from '../../../components/jobbank/selection/TableSelection';
import { getVacanciesOptions } from '../../../redux/jobBankDuck';

const index = ({
    currentNode,
    getVacanciesOptions
}) => {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState('');
    
    useEffect(()=>{
        if(currentNode) getVacanciesOptions(currentNode.id);
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            setCurrentPage(page)
            setCurrentFilters(filters)
        }
    },[currentNode, router.query])

    return (
        <MainLayout  currentKey='jb_selection' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className={'pointer'}
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                {verifyMenuNewForTenant() && 
                    <Breadcrumb.Item>Reclutamiento y selección</Breadcrumb.Item>
                }
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item>Template de vacante</Breadcrumb.Item>
            </Breadcrumb>
            <div className='container' style={{display: 'flex', gap: 24, flexDirection: 'column'}}>
                <SearchSelection/>
                <TableSelection/>
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
        getVacanciesOptions
    }
)(withAuthSync(index));