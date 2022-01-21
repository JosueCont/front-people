import React, { useEffect, useLayoutEffect, useState } from "react";
import { Layout, Row, Col, Avatar, Menu, Space } from "antd";
import { css, Global } from "@emotion/core";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import {UserOutlined, DollarCircleOutlined, CalculatorOutlined, CalendarOutlined, FileTextOutlined, FileProtectOutlined} from '@ant-design/icons';

const SiderNomina = ({ currentKey, ...props }) => {
    const { Sider } = Layout;
    const { SubMenu } = Menu;

    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    return (
        <>
            <Global
                styles={`
                .mainSideMenu, .ant-menu-inline-collapsed{
                    border-right: solid 1px #8070F2 !important;
                }
                .mainSideMenu ul  li.ant-menu-item{
                    padding: ${collapsed ? "auto;" : "0px 30px !important;"}
                    margin:  ${collapsed ? "10px 0px !important;" : "10px 10px !important;"}
                    width: ${collapsed ? "100% !important;" : "90% !important;"} 
                    border-radius: 9px;
                }
                .mainSideMenu ul li.ant-menu-submenu .ant-menu-submenu-title{
                    padding: ${collapsed ? "auto" : "0% !important;"}
                }
                .mainMenu{
                    margin-top:50px;
                }
                .ant-layout-sider{
                    background: var(--primaryColor) !important;
                }
                .ant-layout-sider .ant-menu {
                    background: var(--primaryColor) !important;
                    color: varl(--fontSpanColor) !important
                }
                
                .mainMenu li:hover > div.ant-menu-submenu-title > i::before,
                .mainMenu li:hover > div.ant-menu-submenu-title > i::after{
                    background: var(--fontSpanColor) !important;
                }

                
                .mainMenu li:hover{
                    background: var(--secondaryColor) !important;
                    opacity: 0.7;
                    color: var(--fontColorSecondary) !important;
                }
                .mainMenu li:hover > div.ant-menu-submenu-title{
                    color: var(--fontColorSecondary) !important;
                }

                .mainMenu li:hover > div.ant-menu-submenu-title > i::before,
                .mainMenu li:hover > div.ant-menu-submenu-title > i::after{
                    background: var(--fontColorSecondary) !important;
                }

                .mainMenu li:hover > ul.ant-menu-sub li.ant-menu-item{
                    color: var(--fontColorSecondary) !important;
                }
                .mainMenu li:hover > ul.ant-menu-sub li.ant-menu-item:hover{
                    color: var(--fontColorSecondary) !important;
                    opacity: 0.5;
                }

                .mainMenu li ul.ant-menu-sub{
                    background: transparent !important;

                }
                                

                .mainMenu li.ant-menu-item-selected {
                    background: var(--secondaryColor) !important;
                    opacity: 1;
                }
                .mainMenu li.ant-menu-item-selected span,
                .mainMenu li.ant-menu-submenu-selected  > div,
                .mainMenu li.ant-menu-submenu-selected  > ul li {
                    color: var(--fontColorSecondary) !important;
                }
                

            `}
            />
            <Sider
                className="mainSideMenu"
                width="250"
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
            >
                <div className="logo" />
                <Menu
                    theme="dark"
                    className="mainMenu"
                    defaultSelectedKeys={currentKey}
                    mode="inline"
                >
                    <Menu.Item
                        key="dashboard"
                        icon={<DollarCircleOutlined />}
                        onClick={() => router.push({ pathname: "/payroll/" })}
                    >
                        Nomina
                    </Menu.Item>
                    <Menu.Item
                        key="calculator"
                        icon={<CalculatorOutlined />}
                        onClick={() =>
                        router.push({ pathname: "/payroll/assimilatedSalary" })
                        }
                    >
                        Calculadora
                    </Menu.Item>
                    <Menu.Item
                        key="calendario"
                        icon={<CalendarOutlined />}
                        onClick={() =>
                            router.push({ pathname: "/payroll/paymentCalendar" })
                        }
                    >
                        Calendario de pagos
                    </Menu.Item>
                    <Menu.Item
                        key="calculo_nomina"
                        icon={<FileTextOutlined />}
                        onClick={() =>
                            router.push({ pathname: "/payroll/paymentCalendar" })
                        }
                    >
                        Calculo de nómina
                    </Menu.Item>
                    <Menu.Item
                        key="recibos_nomina"
                        icon={<FileProtectOutlined />}
                        onClick={() =>
                            router.push({ pathname: "/payroll/paymentCalendar" })
                        }
                    >
                        Recibos de nomina
                    </Menu.Item>
                </Menu>
            </Sider>
        </>
    )
}

export default SiderNomina
