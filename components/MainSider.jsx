import React, { useEffect, useLayoutEffect, useState } from "react";
import {Layout, Row, Col, Avatar, Menu, Space } from 'antd'
import { css, Global } from "@emotion/core";
import { useRouter } from "next/router";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  MessageOutlined,
  ProfileOutlined,
  DeploymentUnitOutlined
} from '@ant-design/icons';

const {  Sider } = Layout;

const MainSider = () => {

    const router = useRouter();
    const { SubMenu } = Menu;

    const [collapsed, setCollapsed] = useState(false)
    const onCollapse = collapsed => {
        console.log(collapsed);
        setCollapsed(collapsed)
    };

    return (
        <>
        <Global 
            styles={`
                .mainSideMenu ul  li.ant-menu-item, li.ant-menu-submenu{
                    padding: ${collapsed?"auto": "0px 50px !important;"}
                }
                .mainSideMenu ul li.ant-menu-submenu .ant-menu-submenu-title{
                    padding: ${collapsed ? "auto" : "0% !important;"}
                }
                .ant-layout-sider-children ul.ant-menu{
                    margin-top:50px;
                }

                .ant-layout-sider{
                background: var(--secondaryColor) !important;
                }
                .ant-layout-sider .ant-menu {
                background: var(--secondaryColor) !important;
                }

            `}
        />
        <Sider className="mainSideMenu" width="250" collapsible collapsed={collapsed} onCollapse={onCollapse}>
              <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="applications" icon={<UserOutlined style={{opacity:0}} />} >
                        Aplicaciones
                    </Menu.Item>
                    <Menu.Item key="persons" icon={<UserOutlined/> } >
                        Personas
                    </Menu.Item>
                    <Menu.Item key="companies" icon={<UserOutlined style={{opacity:0}} /> } >
                        Empresas
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<SettingOutlined /> } >
                        Configuración
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<MessageOutlined /> } >
                        Comunicación
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<ProfileOutlined /> } >
                        Reportes
                    </Menu.Item>
                    <Menu.Item key="requests" icon={<UserOutlined style={{opacity:0}} />} >
                        Solicitudes
                    </Menu.Item>
                    <Menu.Item key="payroll" icon={<UserOutlined style={{opacity:0}} />} >
                        Nomina
                    </Menu.Item>
                    <Menu.Item key="assign_company" icon={<UserOutlined style={{opacity:0}} />} >
                        Assignar empresa
                    </Menu.Item>
                    <Menu.Item key="settings" icon={<DeploymentUnitOutlined /> } >
                        Intranet
                    </Menu.Item>
                    
                  {/* <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
                  </Menu.Item>
                  <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                  </Menu.Item>
                  <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                  </SubMenu>
                  <Menu.Item key="9" icon={<FileOutlined />}>
                    Files
                  </Menu.Item> */}
                </Menu>
              </Sider>
              </>
    )
}

export default MainSider
