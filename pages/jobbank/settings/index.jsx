import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainInter';
import { Breadcrumb, Card, Button } from 'antd';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    LinkOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { verifyMenuNewForTenant } from '../../../utils/functions';

const index = ({
    currentNode
}) => {

    const router = useRouter();

    const listAccess = [
        {
            name: 'Catálogos',
            icon: <FileTextOutlined/>,
            redirect: () => router.push('/jobbank/settings/catalogs')
        },
        {
            name: 'Conexiones',
            icon: <LinkOutlined/>,
            redirect: () => router.push('/jobbank/settings/connections')
        }
    ]

    return (
        <MainLayout currentKey={'jb_settings'} defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                <Breadcrumb.Item>Configuraciones</Breadcrumb.Item>
            </Breadcrumb>
            <div className='list-access'>
                {listAccess.map((item, idx) => (
                    <div key={idx} className='card-access' onClick={()=> item.redirect()}>
                        {item.icon}<p>{item.name}</p>
                    </div>
                ))}
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