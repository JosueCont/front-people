import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import DetailsVacancies from './DetailsVacancies';
import { connect } from 'react-redux';
import {
    getClientsOptions,
    getMainCategories,
    getSubCategories,
    getAcademics,
    getCompetences
} from '../../../redux/jobBankDuck';

const AddOrEditVacancies = ({
    action = 'add',
    currentNode,
    getClientsOptions,
    getMainCategories,
    getSubCategories,
    getAcademics,
    getCompetences
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){
            getClientsOptions(currentNode.id);
            getMainCategories(currentNode.id);
            getSubCategories(currentNode.id);
            getAcademics(currentNode.id);
            getCompetences(currentNode.id);
        }
    },[currentNode])

    return (
        <MainLayout currentKey='jb_vacancies' defaultOpenKeys={['job_bank']}>
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
                    onClick={() => router.push({ pathname: '/jobbank/vacancies'})}
                >
                    Vacantes
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nueva' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className={'container'}>
                <DetailsVacancies action={action}/>
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
        getClientsOptions,
        getMainCategories,
        getSubCategories,
        getAcademics,
        getCompetences
    }
)(AddOrEditVacancies);