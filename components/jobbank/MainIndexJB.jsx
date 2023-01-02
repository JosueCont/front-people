import React, {
    useEffect,
    useState,
    useMemo,
    useCallback
} from 'react';
import MainLayout from '../../layout/MainInter';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import { verifyMenuNewForTenant } from '../../utils/functions';

const MainIndexJB = ({
    children,
    newFilters = {},
    pageKey = '',
    extraBread = []
}) => {

    const router = useRouter();

    const breadProps = useCallback((item)=>{
        return item.URL ? {
            className: 'pointer',
            onClick: ()=> router.push({
                pathname: item.URL,
                query: newFilters
            })
        } : {};
    },[])

    return (
        <MainLayout
            currentKey={pageKey}
            defaultOpenKeys={["recruitmentSelection",'job_bank']}
        >
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
                {extraBread.map((item, idx) =>(
                    <Breadcrumb.Item key={"bread_"+idx} {...breadProps(item)}>
                        {item.name}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
            <div
                className='container'
                style={{display: 'flex', gap: 24, flexDirection: 'column'}}
            >
                {children}
            </div>
        </MainLayout>
    )
}
  
export default MainIndexJB;