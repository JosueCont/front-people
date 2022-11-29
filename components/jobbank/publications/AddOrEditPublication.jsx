import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
    getProfilesOptions,
    getVacanciesOptions,
    getVacantFields,
    getConnections,
    getClientsOptions
} from '../../../redux/jobBankDuck';
import DetailsPublication from './DetailsPublication';

const AddOrEditPublication = ({
    action = 'add',
    currentNode,
    getProfilesOptions,
    getVacanciesOptions,
    getVacantFields,
    getConnections,
    getClientsOptions
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode){

            getProfilesOptions(currentNode.id);
            getVacanciesOptions(currentNode.id);
            getVacantFields(currentNode.id);
            getClientsOptions(currentNode.id);
            //isOptions/true
            getConnections(currentNode.id, true);
        }
    },[currentNode])

    return (
        <MainLayout currentKey='jb_publications' defaultOpenKeys={['job_bank']}>
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
                    onClick={() => router.push({ pathname: '/jobbank/publications'})}
                >
                    Publicaciones
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nueva' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className='container'>
               <DetailsPublication action={action}/>
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
        getClientsOptions
    }
)(AddOrEditPublication);