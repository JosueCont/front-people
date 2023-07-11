import React, { useCallback } from "react";
import esES from 'antd/lib/locale/es_ES';
import MainLayoutInter from "../../layout/MainInter";
import MainLayoutUser from "../../layout/MainLayout_user";
import { Breadcrumb, ConfigProvider } from "antd";
import { useRouter } from "next/router";
import { verifyMenuNewForTenant } from "../../utils/functions";

const MainRequets = ({
    children,
    pageKey = '',
    extraBread = [],
    isAdmin = true,
    newFilters = {}
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

    const Main = isAdmin ? MainLayoutInter : MainLayoutUser;

    return (
        <Main
            currentKey={pageKey}
            defaultOpenKeys={["managementRH", "concierge", "requests"]}
        >
            <Breadcrumb>
                <Breadcrumb.Item
                    className="pointer"
                    onClick={() => router.push({
                        pathname: isAdmin ? "/home/persons/" : "/user"
                    })}
                >
                    Inicio
                </Breadcrumb.Item>
                {verifyMenuNewForTenant() && isAdmin &&
                    <>
                        <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
                        <Breadcrumb.Item>Concierge</Breadcrumb.Item>
                    </>
                }
                <Breadcrumb.Item>Solicitudes</Breadcrumb.Item>
                {extraBread.map((item, idx) => (
                    <Breadcrumb.Item key={"bread_" + idx} {...breadProps(item)}>
                        {item.name}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
            <div style={{ display: 'flex', gap: 24, flexDirection: 'column' }}>
                <ConfigProvider locale={esES}>
                    {children}
                </ConfigProvider>
            </div>
        </Main>
    );
};
export default MainRequets;
