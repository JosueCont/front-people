import React, { useEffect } from 'react';
import MainLayout from '../../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { getVacantFields } from '../../../../redux/jobBankDuck';
import DetailsTemplate from './DetailsTemplate';

const AddOrEditTemplate = ({
    action = 'add',
    currentNode,
    getVacantFields
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode) getVacantFields(currentNode.id);
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
                <Breadcrumb.Item
                     className='pointer'
                     onClick={() => router.replace('/jobbank/settings/catalogs/profiles')}
                >
                    Tipos de template
                </Breadcrumb.Item>
                <Breadcrumb.Item>{action == 'add' ? 'Nuevo' : 'Expediente'}</Breadcrumb.Item>
            </Breadcrumb>
            <DetailsTemplate action={action}/>
        </MainLayout>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState, { getVacantFields })(AddOrEditTemplate);