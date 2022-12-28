import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import DetailsConnections from './DetailsConnections';
import { connect } from 'react-redux';
import { getSectors } from '../../../redux/jobBankDuck';
import { deleteFiltersJb, verifyMenuNewForTenant } from '../../../utils/functions';

const AddOrEditConnections = ({
    action = 'add',
    currentNode,
    getSectors
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id','code'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    return (
        <MainLayout currentKey='jb_settings' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                <Breadcrumb.Item>Configuraciones</Breadcrumb.Item>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({
                        pathname: '/jobbank/settings/connections',
                        query: newFilters
                    })}
                >
                    Conexiones
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nuevo' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className='container'>
                <DetailsConnections action={action} newFilters={newFilters}/>
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
    mapState, { getSectors }
)(AddOrEditConnections);