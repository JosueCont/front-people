import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Breadcrumb, Card, Button } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';

const index = ({
    currentNode
}) => {

    const router = useRouter();

    return (
        <MainLayout currentKey={'jb_settings'} defaultOpenKeys={['job_bank']}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className={'pointer'}
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Bolsa de trabajo</Breadcrumb.Item>
                <Breadcrumb.Item>Configuraciones</Breadcrumb.Item>
            </Breadcrumb>
            <div className='card-settings'>
                <div className='card-catalog'>Catálogos</div>
                <div className='card-catalog'>Otro</div>
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