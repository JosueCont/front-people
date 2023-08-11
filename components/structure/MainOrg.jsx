import React, {
    useEffect,
    useState,
    useMemo,
    useCallback
} from 'react';
import esES from 'antd/lib/locale/es_ES';
import MainInter from '../../layout/MainInter';
import { Breadcrumb, ConfigProvider } from 'antd';
import { useRouter } from 'next/router';

const MainORG = ({
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
    },[newFilters])

    return (
        <MainInter
            currentKey={pageKey}
            defaultOpenKeys={["org_structure"]}
        >
            <Breadcrumb>
                <Breadcrumb.Item
                    className='pointer'
                    onClick={() => router.push({ pathname: '/home/persons/'})}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Estructura organizacional</Breadcrumb.Item>
                {extraBread.map((item, idx) =>(
                    <Breadcrumb.Item key={"bread_"+idx} {...breadProps(item)}>
                        {item.name}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
            <div style={{display: 'flex', gap: 24, flexDirection: 'column'}}>
                <ConfigProvider locale={esES}>
                    {children}
                </ConfigProvider>
            </div>
        </MainInter>
    )
}
  
export default MainORG;