import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import DetailsClients from './DetailsClients';
import { connect } from 'react-redux';
import { getSectors } from '../../../redux/jobBankDuck';

const AddOrEditClients = ({
    action = 'add',
    currentNode,
    getSectors
}) => {

    const router = useRouter();

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
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({ pathname: '/jobbank/clients'})}
                >
                    Clientes
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nuevo' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className='container'>
                <DetailsClients action={action}/>
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