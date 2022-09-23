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
  BugOutlined,
  DollarOutlined,
  BankOutlined,
  SettingOutlined,
  AlertOutlined,
  QuestionCircleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { GroupOutlined } from "@material-ui/icons";

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

  useLayoutEffect(() => {
    if (props.config) {
      setintanetAccess(props.config.intranet_enabled);
    }
  }, [props.config]);

  return (
    <>
      <Global
        styles={css`
          .mainSideMenu,
          .ant-menu-inline-collapsed {
            border-right: solid 1px #8070f2 !important;
          }

          .mainMenu .ant-menu-item {
            text-align: ${collapsed ? "center;" : "left;"};
          }
          .mainSideMenu ul li {
            padding: ${collapsed ? "auto" : "0px 30px !important;"};
          }
          .mainSideMenu ul li.ant-menu-item,
          li.ant-menu-submenu {
            padding: ${collapsed ? "auto" : "0px 30px !important;"};
          }
          .mainSideMenu ul li.ant-menu-submenu .ant-menu-submenu-title {
            padding: ${collapsed ? "auto" : "0% !important;"};
          }
          .mainMenu {
            margin-top: 50px;
          }

          //////Sider
          .ant-layout-sider {
            background: var(--secondaryColor) !important;
          }

          .ant-layout-sider .ant-menu {
            background: var(--secondaryColor) !important;
            color: white !important;
          }

          .mainMenu li:hover > div.ant-menu-submenu-title > i::before,
          .mainMenu li:hover > div.ant-menu-submenu-title > i::after {
            background: red !important;
          }

          .subMainMenu .ant-menu .ant-menu-item {
            padding: 0px 0px 0px 20px !important;
          }

          .mainMenu li:hover {
            background: var(--primaryColor) !important;
            opacity: 0.7;
            color: white !important;
          }
          .mainMenu li:hover > div.ant-menu-submenu-title {
            color: white !important;
          }

          .mainMenu li:hover > div.ant-menu-submenu-title > i::before,
          .mainMenu li:hover > div.ant-menu-submenu-title > i::after {
            background: white !important;
          }

          .mainMenu li:hover > ul.ant-menu-sub li.ant-menu-item {
            color: white !important;
          }

          .mainMenu li:hover > ul.ant-menu-sub li.ant-menu-item:hover {
            background: var(--secondaryColor) !important;
            color: white !important;
          }

          .ant-menu-submenu-open ul.ant-menu-sub li.ant-menu-item-selected {
            text-decoration: underline;
            font-weight: 500;
          }

          ///////Div sub menu selected
          .ant-menu-submenu-open ul.ant-menu-sub {
            background: var(--primaryColor) !important;
            color: white !important;
          }

          ///////Expandible menu selected
          .mainMenu li.ant-menu-submenu-selected {
            background: var(--primaryColor) !important;
            opacity: 1;
          }

          ///////Sub menu selected
          .mainMenu li.ant-menu-item-selected {
            background: var(--primaryAlternativeColor) !important;
            opacity: 1;
          }

          .mainMenu li.ant-menu-item-selected span,
          .mainMenu li.ant-menu-submenu-selected > div,
          .mainMenu li.ant-menu-submenu-selected > ul li {
            color: white !important;
          }

          .item_custom_icon .ant-menu-submenu-title {
            white-space: break-spaces;
          }

          .custom_icon {
            font-size: ${collapsed ? "19px !important;" : "16px !important;"};
          }

          .ant-layout-sider-trigger {
            background: var(--primaryColor) !important;
          }
        `}
      />
      <Sider className="mainSideMenu" width="250" collapsible>
        <div className="logo" />
        <Menu
          theme="dark"
          className="mainMenu"
          defaultSelectedKeys={currentKey}
          defaultOpenKeys={defaultOpenKeys ? defaultOpenKeys : [""]}
          mode="inline"
        >
          {/* {props.config && props.config.nomina_enabled && (
            <Menu.Item
              key="dashboard"
              onClick={() => router.push({ pathname: "/dashboard" })}
              icon={<AppstoreOutlined />}
            >
              Dashboard
            </Menu.Item>
          )} */}
          {props.permissions.company.view && (
            <SubMenu
              key="company"
              title="Empresa"
              className="subMainMenu"
              icon={<BankOutlined />}
            >
              <Menu.Item
                key="business"
                onClick={() => router.push({ pathname: "/business" })}
              >
                Empresas
              </Menu.Item>

              {props.config && props.config.nomina_enabled && (
                <Menu.Item
                  key="patronal"
                  onClick={() =>
                    router.push({
                      pathname: "/business/patronalRegistrationNode",
                    })
                  }
                >
                  Registros patronales
                </Menu.Item>
              )}

              <Menu.Item
                key="asign"
                onClick={() =>
                  router.push({ pathname: "/config/assignedCompanies" })
                }
              >
                Asignar empresa
              </Menu.Item>
            </SubMenu>
          )}
          {props.permissions.person.view && (
            <SubMenu
              key="people"
              title="Colaboradores"
              className="subMainMenu"
              icon={<UserOutlined />}
            >
              <Menu.Item
                key="persons"
                onClick={() => router.push({ pathname: "/home/persons" })}
              >
                Personas
              </Menu.Item>
              {props.config && props.config.kuiz_enabled && (
                <>
                  <Menu.Item
                    key="groups_people"
                    onClick={() => router.push({ pathname: "/home/groups" })}
                  >
                    Grupos
                  </Menu.Item>
                </>
              )}
            </SubMenu>
          )}
          <SubMenu
            key="config"
            title="Configuración"
            className="subMainMenu"
            icon={<SettingOutlined />}
          >
            <Menu.Item
              key="catalogos"
              onClick={() => router.push({ pathname: "/config/catalogs" })}
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
          {props.config &&
            props.config.nomina_enabled &&
            (props.permissions.comunication.view ||
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
          {props.config &&
            props.config.nomina_enabled &&
            props.permissions.report.view && (
              <Menu.Item
                icon={<ProfileOutlined />}
                key="reportes"
                onClick={() => router.push({ pathname: "/reports" })}
              >
                Reportes
              </Menu.Item>
            )}
          {props.config && props.config.nomina_enabled && (
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
          )}
          {props.config && props.config.nomina_enabled && (
            <SubMenu
              key="payroll"
              title="Nómina"
              className="subMainMenu"
              icon={<DollarOutlined />}
            >
              <>
                <Menu.Item
                  key="timbrar"
                  onClick={() =>
                    router.push({ pathname: "/payroll/calculatePayroll" })
                  }
                >
                  Calculo de nómina
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
                  key="voucher"
                  onClick={() =>
                    router.push({ pathname: "/payroll/payrollVoucher" })
                  }
                >
                  Comprobantes fiscales
                </Menu.Item>
                <Menu.Item
                  key="asimilado"
                  onClick={() =>
                    router.push({ pathname: "/payroll/calculatorSalary" })
                  }
                >
                  Calculadora
                </Menu.Item>
                <Menu.Item
                  key="importxml"
                  onClick={() =>
                    router.push({ pathname: "/payroll/importMasivePayroll" })
                  }
                >
                  Importar nómina con xml
                </Menu.Item>
                <Menu.Item
                  key="imssMovements"
                  onClick={() =>
                    router.push({ pathname: "/payroll/imssMovements" })
                  }
                >
                  Movientos IMSS
                </Menu.Item>
              </>
            </SubMenu>
          )}
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
                key="intranet2"
                onClick={() => router.push({ pathname: "/intranet/config" })}
                icon={<SettingOutlined />}
              >
                <FormattedMessage id="header.config" />
              </Menu.Item>
              <Menu.Item
                key="statistics"
                onClick={() =>
                  router.push({ pathname: "/intranet/publications_statistics" })
                }
                icon={<AlertOutlined />}
              >
                <FormattedMessage id="header.moderation" />
              </Menu.Item>
            </SubMenu>
          )}
          {props.config && props.config.nomina_enabled && (
            <SubMenu
              key="uploads"
              title="Registro de errores"
              className="subMainMenu item_custom_icon"
              icon={<BugOutlined />}
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
          )}
          {props.config && props.config.kuiz_enabled && (
            <SubMenu
              key="kuiss"
              title="Kuiz"
              className="subMainMenu"
              icon={<QuestionCircleOutlined />}
            >
              <Menu.Item
                key="surveys"
                onClick={() => router.push({ pathname: "/assessment/surveys" })}
              >
                Evaluaciones
              </Menu.Item>
              <Menu.Item
                key="groups_kuiz"
                onClick={() => router.push({ pathname: "/assessment/groups" })}
              >
                Grupos
              </Menu.Item>
              <Menu.Item
                key="perfiles_kuiz"
                onClick={() =>
                  router.push({ pathname: "/assessment/profiles" })
                }
              >
                Perfiles
              </Menu.Item>
              <Menu.Item
                key="reports_kuiz"
                onClick={() => router.push({ pathname: "/assessment/reports" })}
              >
                Reportes
              </Menu.Item>
              {/* <Menu.Item
                key="assignments"
                onClick={() =>
                  router.push({ pathname: "/assessment/assignments" })
                }
              >
                Asignaciones
              </Menu.Item> */}
            </SubMenu>
          )}
          <Menu.Item
            icon={<ProfileOutlined />}
            key="dashboard-ynl"
            onClick={() => router.push({ pathname: "/dashboard-ynl" })}
          >
            YNL
          </Menu.Item>
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
