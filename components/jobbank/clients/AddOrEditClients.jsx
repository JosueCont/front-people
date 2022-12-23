import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainInter';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import DetailsClients from './DetailsClients';
import { connect } from 'react-redux';
import { getSectors } from '../../../redux/jobBankDuck';
import { deleteFiltersJb, verifyMenuNewForTenant } from '../../../utils/functions';

const AddOrEditClients = ({
    action = 'add',
    currentNode,
    getSectors
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        setNewFilters(deleteFiltersJb(router.query));
    },[router])

    useEffect(()=>{
        if(currentNode) getSectors(currentNode.id);
    },[currentNode])

    return (
        <MainLayout currentKey='jb_clients' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                    className='pointer'
                    onClick={() => router.push({
                        pathname: '/jobbank/clients',
                        query: newFilters
                    })}
                >
                    Clientes
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nuevo' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className='container'>
                <DetailsClients action={action} newFilters={newFilters}/>
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
)(AddOrEditClients);