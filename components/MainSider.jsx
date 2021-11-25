import React, { useEffect, useLayoutEffect, useState } from "react";
import { Layout, Row, Col, Avatar, Menu, Space } from "antd";
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
  DeploymentUnitOutlined,
  FormOutlined,
  DollarOutlined,
  UserAddOutlined,
  BugOutlined,
} from "@ant-design/icons";
import { BusinessCenterOutlined, BusinessOutlined } from "@material-ui/icons";

const { Sider } = Layout;

const MainSider = ({
  hideMenu,
  currentKey,
  hideProfile = true,
  onClickImage = true,
  ...props
}) => {
  const router = useRouter();
  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";
  const [person, setPerson] = useState({});
  const [logOut, setLogOut] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(null);
  const [secondaryColor, setSecondaryColor] = useState(null);
  const [intranet_access, setintanetAccess] = useState(null);

  const { SubMenu } = Menu;

  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  useEffect(() => {
    if (props.config) {
      setintanetAccess(props.config.intranet_enabled);
    }
  }, [props.config]);

  return (
    <>
      <Global
        styles={`
                .mainSideMenu, .ant-menu-inline-collapsed{
                    border-right: solid 1px #8070F2 !important;
                }
                .mainSideMenu ul  li.ant-menu-item, li.ant-menu-submenu{
                    padding: ${collapsed ? "auto" : "0px 50px !important;"}
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
                }
                .subMainMenu .ant-menu .ant-menu-item{
                    padding: 0px 0px 0px 20px !important;
                }
                .mainMenu li:hover{
                    background: var(--secondaryColor) !important;
                    opacity: 0.7;
                }
                .mainMenu li.ant-menu-item-selected{
                    background: var(--secondaryColor) !important;
                    opacity: 1;
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
          defaultSelectedKeys={[currentKey]}
          mode="inline"
        >
          {/* <Menu.Item key="applications" icon={<UserOutlined style={{opacity:0}} />} >
                        Aplicaciones
                    </Menu.Item> */}
          <Menu.Item
            key="persons"
            icon={<UserOutlined />}
            onClick={() => router.push({ pathname: "/home" })}
          >
            Personas
          </Menu.Item>
          <Menu.Item
            key="companies"
            icon={<BusinessOutlined />}
            onClick={() => router.push({ pathname: "/business" })}
          >
            Empresas
          </Menu.Item>
          <SubMenu
            key="3"
            title="Configuración"
            icon={<SettingOutlined />}
            className="subMainMenu"
          >
            <Menu.Item
              key="catalogos"
              onClick={() => router.push({ pathname: "/config/business" })}
            >
              Catálogos
            </Menu.Item>
            <Menu.Item
              key="perfiles"
              onClick={() => router.push({ pathname: "/config/groups" })}
            >
              Perfiles de seguridad
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="4"
            title="Comunicación"
            icon={<MessageOutlined />}
            className="subMainMenu"
          >
            <Menu.Item
              key="comunicados"
              onClick={() =>
                router.push({ pathname: "/comunication/releases" })
              }
            >
              Comunicados
            </Menu.Item>
            <Menu.Item
              key="eventos"
              onClick={() => router.push({ pathname: "/comunication/events" })}
            >
              Eventos
            </Menu.Item>
          </SubMenu>
          <Menu.Item
            icon={<ProfileOutlined />}
            key="reportes"
            onClick={() => router.push({ pathname: "/reports" })}
          >
            Reportes
          </Menu.Item>
          <SubMenu
            key="7"
            title="Solicitudes"
            icon={<FormOutlined />}
            className="subMainMenu"
          >
            <Menu.Item
              key="prestamos"
              onClick={() => router.push({ pathname: "/lending" })}
            >
              Préstamos
            </Menu.Item>
            <Menu.Item
              key="vacaciones"
              onClick={() => router.push({ pathname: "/holidays" })}
            >
              Vacaciones
            </Menu.Item>
            <Menu.Item
              key="permisos"
              onClick={() => router.push({ pathname: "/permission" })}
            >
              Permisos
            </Menu.Item>
            <Menu.Item
              key="incapacidad"
              onClick={() => router.push({ pathname: "/incapacity" })}
            >
              Incapacidad
            </Menu.Item>
            <Menu.Item
              key="cuentas"
              onClick={() => router.push({ pathname: "/bank_accounts" })}
            >
              Cuentas bancarias
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="9"
            title="Nómina"
            icon={<DollarOutlined />}
            className="subMainMenu"
          >
            <Menu.Item
              key="nomina_empresarial"
              onClick={() =>
                router.push({ pathname: "/payrollvoucher/statisticsPayroll" })
              }
            >
              Nómina empresarial
            </Menu.Item>
            <Menu.Item
              key="recibos_nomina"
              onClick={() => router.push({ pathname: "/payrollvoucher" })}
            >
              Recibos de nómina
            </Menu.Item>
            {props.config && props.config.nomina_enabled && (
              <>
                <Menu.Item
                  key="asimilado"
                  onClick={() =>
                    router.push({ pathname: "/payroll/assimilatedSalary" })
                  }
                >
                  Salario asimilado
                </Menu.Item>
                <Menu.Item
                  key="calendario"
                  onClick={() =>
                    router.push({ pathname: "/payroll/paymentCalendar" })
                  }
                >
                  Calendario de pagos
                </Menu.Item>
                <Menu.Item
                  key="timbrar"
                  onClick={() =>
                    router.push({ pathname: "/payroll/stampPayroll" })
                  }
                >
                  Timbrar nomina
                </Menu.Item>
              </>
            )}
          </SubMenu>
          <Menu.Item
            key="asignar"
            onClick={() => router.push({ pathname: "/assignedCompanies" })}
            icon={<UserAddOutlined />}
          >
            Asignar empresa
          </Menu.Item>
          {intranet_access && (
            <SubMenu
              key="intranet"
              title={<FormattedMessage id="header.intranet" />}
              className="subMainMenu"
            >
              <Menu.Item
                key="groups"
                onClick={() => router.push({ pathname: "/intranet/groups" })}
              >
                <FormattedMessage id="header.groups" />
              </Menu.Item>
              <Menu.Item
                key="config"
                onClick={() => router.push({ pathname: "/intranet/config" })}
              >
                <FormattedMessage id="header.config" />
              </Menu.Item>
            </SubMenu>
          )}

          <SubMenu
            key="12"
            title="Registro de errores"
            icon={<BugOutlined />}
            className="subMainMenu"
          >
            <Menu.Item
              key="12.1"
              onClick={() => router.push({ pathname: "/bulk_upload" })}
            >
              Carga masiva de personas
            </Menu.Item>
            <Menu.Item
              key="12.2"
              onClick={() => router.push({ pathname: "/log/documentsLog" })}
            >
              Carga de documentos
            </Menu.Item>
          </SubMenu>
          {/* {props.config && props.config.kuiz_enabled && (
                        <Menu.Item
                        key="13"
                        onClick={() => router.push({ pathname: "/assessment" })}
                        >
                        Encuestas
                        </Menu.Item>
                    )} */}
        </Menu>
      </Sider>
    </>
  );
};

export default MainSider;
