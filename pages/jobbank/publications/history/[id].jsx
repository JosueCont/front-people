import React, { useEffect, useState } from 'react';
import MainLayout from '../../../../layout/MainInter';
import { Breadcrumb } from 'antd';
import { withAuthSync } from '../../../../libs/auth';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import TableHistory from '../../../../components/jobbank/publications/TableHistory';
import { deleteFiltersJb, verifyMenuNewForTenant } from '../../../../utils/functions';
import { getConnectionsOptions } from '../../../../redux/jobBankDuck';

const index = ({
    currentNode,
    getConnectionsOptions
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deletekeys = ['id', 'start', 'end', 'account'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deletekeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        if(currentNode) getConnectionsOptions(currentNode.id);
    },[currentNode])

    return (
        <MainLayout currentKey='jb_publications' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                    onClick={() => router.push({
                        pathname: '/jobbank/publications',
                        query: newFilters
                    })}
                >
                    Publicaciones
                </Breadcrumb.Item>
                <Breadcrumb.Item>Historial</Breadcrumb.Item>
            </Breadcrumb>
            <TableHistory newFilters={newFilters}/>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState,{
        getConnectionsOptions
    }
)(withAuthSync(index));