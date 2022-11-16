import React, { useEffect, useContext } from 'react';
import MainLayout from '../../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../../libs/auth';
import { useRouter } from 'next/router';
import TableCatalogs from '../../../../components/jobbank/catalogs/TableCatalogs';
import { useCatalog } from '../../../../components/jobbank/catalogs/hook/useCatalog';

const catalog = ({
    currentNode
}) => {

    const router = useRouter();
    const { getCatalog, infoCatalog } = useCatalog();

    useEffect(()=>{
        if(currentNode) getCatalog(currentNode.id);
    },[currentNode])


    return (
        <MainLayout currentKey='jb_settings' defaultOpenKeys={['job_bank']}>
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
                <Breadcrumb.Item>{infoCatalog.titleBread}</Breadcrumb.Item>
            </Breadcrumb>
            <TableCatalogs/>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(mapState)(withAuthSync(catalog));