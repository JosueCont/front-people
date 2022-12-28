import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainInter';
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
import { deleteFiltersJb, verifyMenuNewForTenant } from '../../../utils/functions';

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
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id', 'client', 'tab'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

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
        <MainLayout currentKey='jb_vacancies' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                <Breadcrumb.Item
                    className={'pointer'}
                    onClick={() => router.push({
                        pathname: '/jobbank/vacancies',
                        query: newFilters
                    })}
                >
                    Vacantes
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nueva' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className={'container'}>
                <DetailsVacancies action={action} newFilters={newFilters}/>
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