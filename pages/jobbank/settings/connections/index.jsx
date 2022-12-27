import React, { useEffect, useState } from 'react';
import MainLayout from '../../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../../libs/auth';
import { useRouter } from 'next/router';
import { getConnections } from '../../../../redux/jobBankDuck';
import SearchConnections from '../../../../components/jobbank/connections/SearchConnections';
import TableConnections from '../../../../components/jobbank/connections/TableConnections';
import { getFiltersJB } from '../../../../utils/functions';

const index = ({
    currentNode,
    getConnections
}) => {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilters, setCurrentFilters] = useState('');

    useEffect(()=>{
        if(currentNode){
            let page = router.query.page ? parseInt(router.query.page) : 1;
            let filters = getFiltersJB(router.query);
            getConnections(currentNode.id, filters, page);
            setCurrentPage(page)
            setCurrentFilters(filters)
        }
    },[currentNode, router.query])

    return (
        <MainLayout currentKey='jb_settings' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Reclutamiento y selección</Breadcrumb.Item>
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({ pathname: '/jobbank/settings'})}
                >
                    Configuraciones
                </Breadcrumb.Item>
                <Breadcrumb.Item>Conexiones</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
                <SearchConnections/>
                <TableConnections currentPage={currentPage} currentFilters={currentFilters}/>
            </div>
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