import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layout/MainInter';
import { Breadcrumb } from 'antd';
import TableClients from '../../../components/jobbank/clients/TableClients';
import SearchClients from '../../../components/jobbank/clients/SearchClients';
import { connect } from 'react-redux';
import {
    getClients,
    getSectors
} from '../../../redux/jobBankDuck';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import { getFiltersJB, verifyMenuNewForTenant } from '../../../utils/functions';

const index = ({
    currentNode,
    getClients,
    getSectors
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode) getSectors(currentNode.id);
    },[currentNode])

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getClients(currentNode.id, filters, page)
        }
    },[currentNode, router])

    return (
        <MainLayout currentKey={'jb_clients'} defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                <Breadcrumb.Item>Clientes</Breadcrumb.Item>
            </Breadcrumb>
            <div
                className={'container'}
                style={{
                    display: 'flex',
                    gap: 24,
                    flexDirection: 'column',
                }}>
                <SearchClients/>
                <TableClients/>
            </div>
        </MainLayout>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
        getClients,
        getSectors
    }
)(withAuthSync(index));