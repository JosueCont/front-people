import React, { useEffect, useState } from 'react';
import MainLayout from '../../../../layout/MainInter';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { getVacantFields } from '../../../../redux/jobBankDuck';
import DetailsTemplate from './DetailsTemplate';
import { deleteFiltersJb, verifyMenuNewForTenant } from '../../../../utils/functions';

const AddOrEditTemplate = ({
    action = 'add',
    currentNode,
    getVacantFields
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router])

    useEffect(()=>{
        if(currentNode) getVacantFields(currentNode.id);
    },[currentNode])

    return (
        <MainLayout currentKey='jb_settings' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                    onClick={() => router.replace('/jobbank/settings')}
                >
                    Configuraciones
                </Breadcrumb.Item>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.replace('/jobbank/settings/catalogs')}
                >
                    Catálogos
                </Breadcrumb.Item>
                <Breadcrumb.Item
                     className='pointer'
                     onClick={() => router.replace('/jobbank/settings/catalogs/profiles')}
                >
                    Tipos de template
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nuevo' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <DetailsTemplate action={action} newFilters={newFilters}/>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState, { getVacantFields })(AddOrEditTemplate);