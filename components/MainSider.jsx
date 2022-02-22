import React, { useLayoutEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { css, Global } from "@emotion/core";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import {
  UserOutlined,
  MessageOutlined,
  ProfileOutlined,
  FormOutlined,
  DollarOutlined,
  UserAddOutlined,
  AreaChartOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import {
  BugReportOutlined,
  BusinessOutlined,
  SettingsOutlined,
  GroupOutlined,
} from "@material-ui/icons";

const { Sider } = Layout;

const MainSider = ({
  hideMenu,
  currentKey,
  defaultOpenKeys = null,
  hideProfile = true,
  onClickImage = true,
  ...props
}) => {
  const { SubMenu } = Menu;
  const router = useRouter();
  const [intranetAccess, setintanetAccess] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  useLayoutEffect(() => {
    if (props.config) {
      setintanetAccess(props.config.intranet_enabled);
    }
  }, [props.config]);

  return (
    <>
      <Global
        styles={css`
                .mainSideMenu, .ant-menu-inline-collapsed{
                    border-right: solid 1px #8070F2 !important;
                }

                .mainMenu .ant-menu-item{
                  text-align: ${collapsed ? "center;" : "left;"}
                }
                .mainSideMenu ul  li{
                  padding: ${collapsed ? "auto" : "0px 30px !important;"}
                }
                .mainSideMenu ul  li.ant-menu-item, li.ant-menu-submenu{
                    padding: ${collapsed ? "auto" : "0px 30px !important;"}
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

                .subMainMenu .ant-menu .ant-menu-item{
                    padding: 0px 0px 0px 20px !important;
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
                    opacity: 0.5
                }

                .mainMenu li ul.ant-menu-sub{
                    background: transparent !important;

                }
                .ant-menu-submenu-open ul.ant-menu-sub li.ant-menu-item-selected{
                    text-decoration: underline;
                    font-weight:500;
                }

                /* .mainMenu li:hover{
                    color: var(--fontColorSecondary) !important;
                } */
                

                .mainMenu li.ant-menu-item-selected, 
                .mainMenu li.ant-menu-submenu-selected  {
                    background: var(--secondaryColor) !important;
                    opacity: 1;
                }
                .mainMenu li.ant-menu-item-selected span,
                .mainMenu li.ant-menu-submenu-selected  > div,
                .mainMenu li.ant-menu-submenu-selected  > ul li {
                    color: var(--fontColorSecondary) !important;
                }
                .item_custom_icon .ant-menu-submenu-title{
                  white-space: break-spaces;  
                }
                .custom_icon{
                  font-size: ${
                    collapsed ? "19px !important;" : "16px !important;"
                  }
                }
                /* .ant-menu-item,  */

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
          defaultOpenKeys={defaultOpenKeys ? defaultOpenKeys : [""]}
          mode="inline"
        >
          {/* <Menu.Item
            key="dashboard"
            onClick={() => router.push({ pathname: "/dashboard" })}
            icon={<AppstoreOutlined />}
          >
            Dashboard
          </Menu.Item> */}
          {props.permissions.person.view && (
             <SubMenu
                key="people"
                title="People"
                className="subMainMenu"
                icon={<UserOutlined className="custom_icon" />}
              >
                <Menu.Item
                  key="persons"
                  onClick={() => router.push({ pathname: "/home/persons" })}
                >
                  Personas
                </Menu.Item>
              <Menu.Item
                key="groups_people"
                onClick={() => router.push({ pathname: "/home/groups" })}
              >
                Grupos
              </Menu.Item>
            </SubMenu>
          )}
          {props.permissions.company.view && (
            <Menu.Item
              key="business"
              icon={<BusinessOutlined />}
              onClick={() => router.push({ pathname: "/business" })}
            >
              Empresas
            </Menu.Item>
          )}
          <SubMenu
            key="config"
            title="Configuración"
            className="subMainMenu"
            icon={<SettingsOutlined className="custom_icon" />}
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
          {(props.permissions.comunication.view ||
            props.permissions.event.view) && (
            <SubMenu
              key="comuniction"
              title="Comunicación"
              className="subMainMenu"
              icon={<MessageOutlined />}
            >
              {props.permissions.comunication.view && (
                <Menu.Item
                  key="comunicados"
                  onClick={() =>
                    router.push({ pathname: "/comunication/releases" })
                  }
                >
                  Comunicados
                </Menu.Item>
              )}
              {props.permissions.event.view && (
                <Menu.Item
                  key="eventos"
                  onClick={() =>
                    router.push({ pathname: "/comunication/events" })
                  }
                >
                  Eventos
                </Menu.Item>
              )}
            </SubMenu>
          )}
          {props.permissions.report.view && (
            <Menu.Item
              icon={<ProfileOutlined />}
              key="reportes"
              onClick={() => router.push({ pathname: "/reports" })}
            >
              Reportes
            </Menu.Item>
          )}
          <SubMenu
            key="solicitudes"
            title="Solicitudes"
            className="subMainMenu"
            icon={<FormOutlined />}
          >
            {props.permissions.loan.view && (
              <Menu.Item
                key="prestamos"
                onClick={() => router.push({ pathname: "/lending" })}
              >
                Préstamos
              </Menu.Item>
            )}
            {props.permissions.vacation.view && (
              <Menu.Item
                key="vacaciones"
                onClick={() => router.push({ pathname: "/holidays" })}
              >
                Vacaciones
              </Menu.Item>
            )}
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
            key="nomina"
            title="Nómina"
            className="subMainMenu"
            icon={<DollarOutlined />}
          >
            {props.config && props.config.nomina_enabled && (
              <>
                <Menu.Item
                  key="asimilado"
                  onClick={() =>
                    router.push({ pathname: "/payroll/assimilatedSalary" })
                  }
                >
                  Calculadora
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
                  Calculo de nomina
                </Menu.Item>
              </>
            )}
            <Menu.Item
              key="recibos_nomina"
              onClick={() => router.push({ pathname: "/payrollvoucher" })}
            >
              Recibos de nómina
            </Menu.Item>
          </SubMenu>
          <Menu.Item
            key="asignar"
            onClick={() => router.push({ pathname: "/assignedCompanies" })}
            icon={<UserAddOutlined />}
          >
            Asignar empresa
          </Menu.Item>
          {intranetAccess && (
            <SubMenu
              key="intranet"
              title={<FormattedMessage id="header.intranet" />}
              icon={
                <img
                  className="anticon ant-menu-item-icon icon-intranet"
                  src={"/images/Intranet.svg"}
                />
              }
              className="subMainMenu"
            >
              {props.permissions.groups.view && (
                <Menu.Item
                  key="groups"
                  onClick={() => router.push({ pathname: "/intranet/groups" })}
                  icon={<GroupOutlined />}
                >
                  <FormattedMessage id="header.groups" />
                </Menu.Item>
              )}
              <Menu.Item
                key="config"
                onClick={() => router.push({ pathname: "/intranet/config" })}
                icon={<SettingsOutlined />}
              >
                <FormattedMessage id="header.config" />
              </Menu.Item>
              <Menu.Item
                key="statistics"
                onClick={() =>
                  router.push({ pathname: "/intranet/publications_statistics" })
                }
                icon={<AreaChartOutlined />}
              >
                <FormattedMessage id="header.statistics" />
              </Menu.Item>
            </SubMenu>
          )}

          <SubMenu
            key="uploads"
            title="Registro de errores"
            className="subMainMenu item_custom_icon"
            icon={<BugReportOutlined className="custom_icon" />}
          >
            <Menu.Item
              key="persons_upload"
              onClick={() => router.push({ pathname: "/bulk_upload" })}
            >
              Carga masiva de personas
            </Menu.Item>
            <Menu.Item
              key="documents"
              onClick={() => router.push({ pathname: "/log/documentsLog" })}
            >
              Carga de documentos
            </Menu.Item>
          </SubMenu>
          {props.config && props.config.kuiz_enabled && (
            <SubMenu
              key="kuis"
              title="Kuiz"
              className="subMainMenu"
              icon={<QuestionCircleOutlined className="custom_icon"/>}
            >
              <Menu.Item
                key="suverys"
                onClick={() => router.push({ pathname: "/assessment/surveys" })}
              >
                Encuestas
              </Menu.Item>
              <Menu.Item
                key="groups_kuiz"
                onClick={() => router.push({ pathname: "/assessment/groups" })}
              >
                Grupos
              </Menu.Item>
            </SubMenu>
          )}
        </Menu>
      </Sider>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    config: state.userStore.general_config,
    permissions: state.userStore.permissions,
  };
};
export default connect(mapState)(MainSider);
