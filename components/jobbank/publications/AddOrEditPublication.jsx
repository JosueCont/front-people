import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getProfilesOptions,
    getVacanciesOptions,
    getVacantFields,
    getConnections,
    getClientsOptions,
    getStrategiesOptions
} from '../../../redux/jobBankDuck';
import DetailsPublication from './DetailsPublication';
import { deleteFiltersJb } from '../../../utils/functions';

const AddOrEditPublication = ({
    action = 'add',
    currentNode,
    getProfilesOptions,
    getVacanciesOptions,
    getVacantFields,
    getConnections,
    getClientsOptions,
    getStrategiesOptions
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        setNewFilters(deleteFiltersJb(router.query));
    },[router])

    useEffect(()=>{
        if(currentNode){

            getProfilesOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
            getVacantFields(currentNode.id);
            getClientsOptions(currentNode.id);
            getStrategiesOptions(currentNode.id);
            //isOptions/true
            getConnections(currentNode.id, true);
        }
    },[currentNode])

    return (
        <MainLayout currentKey='jb_publications' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                        pathname: '/jobbank/publications',
                        query: newFilters
                    })}
                >
                    Publicaciones
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nueva' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className='container'>
               <DetailsPublication action={action} newFilters={newFilters}/>
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
        getProfilesOptions,
        getVacanciesOptions,
        getVacantFields,
        getConnections,
        getClientsOptions,
        getStrategiesOptions
    }
)(AddOrEditPublication);