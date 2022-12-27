import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainInter';
import { Breadcrumb } from 'antd';
import DetailsCandidates from './DetailsCandidates';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import {
    getMainCategories,
    getSubCategories,
    getCompetences,
    getSectors,
    getListStates
} from '../../../redux/jobBankDuck';
import { deleteFiltersJb, verifyMenuNewForTenant } from '../../../utils/functions';

const AddOrEditCandidates = ({
    action = 'add',
    currentNode,
    getMainCategories,
    getSubCategories,
    getCompetences,
    getSectors,
    getListStates
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id','tab'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        if(currentNode){
            getMainCategories(currentNode.id);
            getSubCategories(currentNode.id);
            getCompetences(currentNode.id);
            getSectors(currentNode.id);
            getListStates(currentNode.id);
        }
    },[currentNode])

    return (
        <MainLayout currentKey='jb_candidates' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({
                        pathname: '/jobbank/candidates',
                        query: newFilters
                    })}
                >
                    Candidatos
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nuevo' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className='container'>
                <DetailsCandidates action={action} newFilters={newFilters}/>
            </div>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}
  
export default connect(
    mapState, {
        getMainCategories,
        getSubCategories,
        getCompetences,
        getSectors,
        getListStates
    }
)(AddOrEditCandidates);