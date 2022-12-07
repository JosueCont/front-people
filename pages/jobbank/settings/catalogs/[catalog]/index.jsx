import React, { useEffect, useState } from 'react';
import MainLayout from '../../../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../../../libs/auth';
import { useRouter } from 'next/router';
import { catalogsJobbank } from '../../../../../utils/constant';
import GetViewCatalog from '../../../../../components/jobbank/catalogs/GetViewCatalog';

const catalog = ({
    currentNode
}) => {

    const router = useRouter();
    const [nameCatalog, setNameCatalog] = useState('');

    const getCatalog = () =>{
        const _find = item => item.catalog == router.query.catalog;
        let result = catalogsJobbank.find(_find);
        setNameCatalog(result.name);
    }

    useEffect(()=>{
        if(router.query.catalog) getCatalog();
    },[router])


    return (
        <MainLayout currentKey='jb_settings' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className={'pointer'}
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Reclutamiento y selección</Breadcrumb.Item>
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
                <Breadcrumb.Item>{nameCatalog}</Breadcrumb.Item>
            </Breadcrumb>
            <GetViewCatalog/>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {}
)(withAuthSync(catalog));