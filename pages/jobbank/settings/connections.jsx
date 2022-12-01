import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import { getConnections } from '../../../redux/jobBankDuck';
import TabsConnections from '../../../components/jobbank/connections/TabsConnections';

const index = ({
    currentNode,
    getConnections
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode) getConnections(currentNode.id);
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
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({ pathname: '/jobbank/settings'})}
                >
                    Configuraciones
                </Breadcrumb.Item>
                <Breadcrumb.Item>Conexiones</Breadcrumb.Item>
            </Breadcrumb>
            <TabsConnections/>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, { getConnections }
)(withAuthSync(index));