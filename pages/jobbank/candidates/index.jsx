import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainInter';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import SearchCandidates from '../../../components/jobbank/candidates/SearchCandidates';
import TableCandidates from '../../../components/jobbank/candidates/TableCandidates';
import {
    getCandidates,
    getMainCategories,
    getListStates
} from '../../../redux/jobBankDuck';
import { getFiltersJB, verifyMenuNewForTenant } from '../../../utils/functions';

const index = ({
    currentNode,
    getCandidates,
    getListStates,
    getMainCategories
}) => {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState('');

    useEffect(()=>{
        if(currentNode){
            getMainCategories(currentNode.id);
            getListStates(currentNode.id);
        }
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getCandidates(currentNode.id, filters, page);
            setCurrentPage(page)
            setCurrentFilters(filters)
        }
    },[currentNode, router.query])

    return (
        <MainLayout currentKey={'jb_candidates'} defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                <Breadcrumb.Item>Candidatos</Breadcrumb.Item>
            </Breadcrumb>
            <div
                className={'container'}
                style={{
                    display: 'flex',
                    gap: 24,
                    flexDirection: 'column',
                }}>
                <SearchCandidates/>
                <TableCandidates currentPage={currentPage} currentFilters={currentFilters}/>
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
        getCandidates,
        getListStates,
        getMainCategories
    }
)(withAuthSync(index));