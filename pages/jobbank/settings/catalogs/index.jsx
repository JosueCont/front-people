import React, { useEffect } from 'react';
import MainLayout from '../../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../../libs/auth';
import { useRouter } from 'next/router';
import SearchCatalogs from '../../../../components/jobbank/catalogs/SearchCatalogs';
import TableCatalogs from '../../../../components/jobbank/catalogs/TableCatalogs';

const index = ({
    currentNode
}) => {

    const router = useRouter();

    return (
        <MainLayout currentKey='jb_settings' defaultOpenKeys={['job_bank']}>
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
                >Configuraciones</Breadcrumb.Item>
                <Breadcrumb.Item>Catálogos</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <SearchCatalogs/>
                <TableCatalogs/>
            </div>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(mapState)(withAuthSync(index));