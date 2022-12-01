import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import DetailsCandidates from './DetailsCandidates';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import {
    getMainCategories,
    getSubCategories,
    getCompetences,
    getSectors,
    getSpecializationArea
} from '../../../redux/jobBankDuck';

const AddOrEditCandidates = ({
    action = 'add',
    currentNode,
    getMainCategories,
    getSubCategories,
    getCompetences,
    getSectors,
    getSpecializationArea
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getMainCategories(currentNode.id);
            getSubCategories(currentNode.id);
            getCompetences(currentNode.id);
            getSectors(currentNode.id);
            getSpecializationArea(currentNode.id);
        }
    },[currentNode])

    return (
        <MainLayout currentKey={'jb_candidates'} defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className={'pointer'}
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item
                    className={'pointer'}
                    onClick={() => router.push({ pathname: '/jobbank/candidates'})}
                >
                    Candidatos
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nuevo' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className='container'>
                <DetailsCandidates action={action}/>
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
        getSpecializationArea
    }
)(AddOrEditCandidates);