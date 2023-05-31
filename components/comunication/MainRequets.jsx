import React from "react";
import esES from 'antd/lib/locale/es_ES';
import MainLayoutInter from "../../layout/MainInter";
import { Breadcrumb, ConfigProvider } from "antd";
import { useRouter } from "next/router";
import { verifyMenuNewForTenant } from "../../utils/functions";

const MainRequets = ({
    children,
    pageKey = '',
    extraBread = []
}) => {

    const router = useRouter();

    const breadProps = (item) => {
        if (!item.URL) return {};
        return {
            className: 'pointer',
            onClick: () => router.push(item.URL)
        }
    }

    return (
        <MainLayoutInter
            currentKey={pageKey}
            defaultOpenKeys={["managementRH", "concierge", "requests"]}
        >
            <Breadcrumb>
                <Breadcrumb.Item
                    className="pointer"
                    onClick={() => router.push({ pathname: "/home/persons/" })}
                >
                    Inicio
                </Breadcrumb.Item>
                {verifyMenuNewForTenant() &&
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
        </MainLayoutInter>
    );
};
export default MainRequets;
