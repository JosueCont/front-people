import React, { useEffect, useState } from 'react';
import MainLayout from '../../../../layout/MainLayout';
import { Breadcrumb } from 'antd';
import { withAuthSync } from '../../../../libs/auth';
import { useRouter } from 'next/router';
import TableHistory from '../../../../components/jobbank/publications/TableHistory';
import { deleteFiltersJb } from '../../../../utils/functions';

const index = () => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        setNewFilters(deleteFiltersJb(router.query));
    },[router])

    return (
        <MainLayout currentKey='jb_publications' defaultOpenKeys={["recruitmentSelection",'job_bank']}>
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
                    onClick={() => router.push({
                        pathname: '/jobbank/publications',
                        query: newFilters
                    })}
                >
                    Publicaciones
                </Breadcrumb.Item>
                <Breadcrumb.Item>Historial</Breadcrumb.Item>
            </Breadcrumb>
            <TableHistory/>
        </MainLayout>
    )
}

export default withAuthSync(index);