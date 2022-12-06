import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { getPersonsCompany } from '../../../redux/UserDuck';
import {
    getClientsOptions,
    getVacanciesOptions,
    getJobBoards
} from '../../../redux/jobBankDuck';
import DetailsStrategies from './DetailsStrategies';
import { deleteFiltersJb } from '../../../utils/functions';

const AddOrEditStrategies = ({
    action = 'add',
    currentNode,
    getPersonsCompany,
    getClientsOptions,
    getVacanciesOptions,
    getJobBoards
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        setNewFilters(deleteFiltersJb(router.query));
    },[router])

    useEffect(()=>{
        if(currentNode){
            getClientsOptions(currentNode.id);
            getVacanciesOptions(currentNode.id,'&has_strategy=0');
            getPersonsCompany(currentNode.id);
            getJobBoards(currentNode.id);
        }
    },[currentNode])

    return (
        <MainLayout currentKey={'jb_strategies'} defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className={'pointer'}
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Reclutamiento y selección</Breadcrumb.Item>
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item
                    className={'pointer'}
                    onClick={() => router.push({
                        pathname: '/jobbank/strategies',
                        query: newFilters
                    })}
                >
                    Estrategias
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nueva' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className={'container'}>
                <DetailsStrategies action={action} newFilters={newFilters}/>
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
  mapState,{
    getPersonsCompany,
    getClientsOptions,
    getVacanciesOptions,
    getJobBoards
  }
)(AddOrEditStrategies);