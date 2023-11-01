import React, { useLayoutEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Icon, {
  UserOutlined,
  MessageOutlined,
  ProfileOutlined,
  FormOutlined,
  BugOutlined,
  DollarOutlined,
  BankOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { GroupOutlined, WorkOutline } from "@material-ui/icons";
import { IntranetIcon } from "./CustomIcons";
import {getCompanyFiscalInformation} from "./../redux/fiscalDuck"

const { Sider, Header, Content, Footer } = Layout;

const MainSider = ({
  hideMenu,
  currentKey,
  defaultOpenKeys = null,
  hideProfile = true,
  onClickImage = true,
  getCompanyFiscalInformation,
  companyFiscalInformation = null,
  ...props
}) => {
  const router = useRouter();
  const [intranetAccess, setintanetAccess] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");

  useLayoutEffect(() => {
    if (props.config) {
      setintanetAccess(props.config.intranet_enabled);
      getCompanyFiscalInformation();
    }
  }, [props.config]);

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  // Rutas menú
  const onClickMenuItem = ({ key }) => {
    const pathRoutes = {
      dashboard: "/dashboard",
      chartOrg: "/org",
      business: "/business/companies",
      // asign: "/config/assignedCompanies",
      patronal: "/business/patronalRegistrationNode",
      persons: "/home/persons",
      groups_people: "/home/groups",
      catalogs: "/config/catalogs",
      securityGroups: "/config/groups",
      // config_roles: "/config/roles",
      security_roles: "/security/roles",
      security_assign: "/security/assign",
      releases: "/comunication/releases",
      events: "/comunication/events",
      reports: "/reports",
      lending: "/comunication/requests/lending",
      holidays: "/comunication/requests/holidays",
      permission: "comunication/requests/permission",
      incapacity: "/comunication/requests/incapacity",
      bank_accounts: "/comunication/requests/bank_accounts",
      calculatePayroll: "/payroll/calculatePayroll",
      extraordinaryPayroll: "/payroll/extraordinaryPayroll",
      extraordinaryPayment: "/payroll/extraordinaryPayment",
      paymentCalendar: "/payroll/paymentCalendar",
      payrollVoucher: "/payroll/payrollVoucher",
      calculatorSalary: "/payroll/calculatorSalary",
      integrationFactors: "/business/integrationFactors",
      importMassivePayroll: "/payroll/importMasivePayroll/?action=addxmls",
      imssMovements: "/payroll/imssMovements",
      bulk_upload: "/bulk_upload",
      documentsLog: "/log/documentsLog",
      systemLog: "/log/LogSystem",
      intranet_groups: "/intranet/groups",
      intranet_configuration: "/intranet/config",
      publications_statistics: "/intranet/publications_statistics",
      surveys: "/assessment/surveys",
      assessment_groups: "/assessment/groups",
      assessment_profiles: "/assessment/profiles",
      assessment_reports: "/assessment/reports",
      ynl_general_dashboard: "/ynl/general-dashboard",
      ynl_personal_dashboard: "/ynl/personal-dashboard",
      ynl_people_dashboard: '/ynl/people-dashboard',
      jb_clients: "/jobbank/clients",
      jb_vacancies: "/jobbank/vacancies",
      jb_strategies: "/jobbank/strategies",
      jb_profiles: "/jobbank/profiles",
      jb_candidates: "/jobbank/candidates",
      jb_settings: "/jobbank/settings",
      jb_publications: "/jobbank/publications",
      jb_selection: "/jobbank/selection",
      jb_preselection: "/jobbank/preselection",
      jb_interviews: "/jobbank/interviews",
      jb_applications: "/jobbank/applications"
    };
    router.push(pathRoutes[key]);
  };

  let items = [];
  let children = [];

  // Función para obtener la lista de elementos del menú
  function getMenuItems() {
    if (typeof window !== "undefined") {
      // Menú Empresas
      if (props?.permissions?.company?.view) {
        let children = [
          getItem("Dashboard", "dashboard"),
          getItem("Organigrama", "chartOrg"),
          getItem("Empresas", "business"),
          getItem("Prestaciones", "integrationFactors")
        ];        
        if (props?.config && props?.config?.nomina_enabled && companyFiscalInformation?.assimilated_pay == false) {          
          children.push(getItem("Registros patronales", "patronal"));
        }
        items.push(getItem("Empresa", "company", <BankOutlined />, children));
      }

      // Menú People
      if (props?.permissions?.person?.view) {
        let children = [
          getItem("Personas", "persons"),
          getItem("Grupos", "groups_people"),
        ];
        items.push(
          getItem("Colaboradores", "people", <UserOutlined />, children)
        );
      }

      // Menú Configuración
      // children = [
      //   getItem("Asignar empresa", "asign"),
      //   getItem("Catálogos", "catalogs"),
      //   getItem("Perfiles de seguridad", "securityGroups"),
      // ];
      // items.push(
      //   getItem("Configuración", "config", <SettingOutlined />, children)
      // );

      // Agregar división
      items.push({ type: "divider" });

      // Menú Comunicación
      if (
        props?.config &&
        props?.config?.nomina_enabled &&
        (props?.permissions?.comunication?.view ||
          props?.permissions?.event?.view)
      ) {
        let children = [];
        if (props?.permissions?.comunication?.view) {
          children.push(getItem("Comunicados", "releases"));
        }
        if (props?.permissions?.event?.view) {
          children.push(getItem("Eventos", "events"));
        }
        items.push(
          getItem("Comunicación", "comunication", <MessageOutlined />, children)
        );
      }

      // Menú Reportes
      if (
        props?.config &&
        props?.config?.nomina_enabled &&
        props?.permissions?.report?.view
      ) {
        items.push(getItem("Reportes", "reports", <ProfileOutlined />));
      }

      // Menú Solicitudes
      if (props?.config && props?.config?.nomina_enabled) {
        let children = [];
        if (props?.permissions?.loan?.view) {
          children.push(getItem("Préstamos", "lending"));
        }
        if (props?.permissions?.vacation?.view) {
          children.push(getItem("Vacaciones", "holidays"));
        }
        children.push(getItem("Permisos", "permission"));
        children.push(getItem("Incapacidad", "incapacity"));
        children.push(getItem("Cuentas bancarias", "bank_accounts"));
        items.push(
          getItem("Solicitudes", "requests", <FormOutlined />, children)
        );
      }

      // Menú Nómina
      if (props?.config && props?.config?.nomina_enabled) {
        let children = [
          getItem("Cálculo de nómina", "calculatePayroll"),
          getItem("Nóminas extraordinarias", "extraordinaryPayroll"),
          getItem("Pagos extraordinarios", "extraordinaryPayment"),
          getItem("Calendario de pagos", "paymentCalendar"),
          getItem("Comprobantes fiscales", "payrollVoucher"),
          getItem("Calculadora", "calculatorSalary"),
          getItem("Importar nómina con XML", "importMassivePayroll"),
          // getItem("Movimientos IMSS", "imssMovements"),
        ];
        // Solo se muestra si la empresa no paga asimilados
        if (companyFiscalInformation?.assimilated_pay == false){
          children.push(
            getItem("Movimientos IMSS", "imssMovements"),
          )
        }
        items.push(getItem("Nómina", "payroll", <DollarOutlined />, children));
      }


      // Menú Configuración
      children = [
        getItem("Catálogos", "catalogs"),
        getItem("Perfiles de seguridad", "securityGroups"),
        // getItem("Roles de administrador", "config_roles"),
        // getItem("Asignar empresa", "asign"),
      ];
      items.push(
          getItem("Configuración", "config", <SettingOutlined />, children)
      );

      // Menú Registro de errores
      if (props?.config && props?.config?.nomina_enabled) {
        let children = [
          // getItem("Carga masiva de personas", "bulk_upload"),
          // getItem("Carga de documentos", "documentsLog"),
          getItem("Log de sistema", "systemLog"),
        ];
        items.push(
          getItem("Registro de logs", "uploads", <BugOutlined />, children)
        );
      }

      // Menú Khor Connect
      if (intranetAccess) {
        let children = [
          getItem("Configuración", "intranet_configuration"),
          getItem("Grupos", "intranet_groups"),
          getItem("Moderación", "publications_statistics"),
        ];
        /* items.push(getItem('Khor Connect', 'intranet', <img
            className="anticon ant-menu-item-icon icon-intranet"
            src={"/images/Intranet.svg"}
        />, children)) */
        items.push(
          getItem("Khor Connect", "intranet", <IntranetIcon />, children)
        );
      }

      // Menú Kuiz
      if (props?.applications) {
        let show_kuiz_module = false;
        for (let item in props.applications) {
          if (item === "kuiz") {
            if (props.applications[item].active) {
              show_kuiz_module = true;
            }
          }
        }
        if (show_kuiz_module) {
          children = [
            getItem("Evaluaciones", "surveys"),
            getItem("Grupos de evaluaciones", "assessment_groups"),
            getItem("Perfiles de competencias", "assessment_profiles"),
            getItem("Reportes de competencias", "assessment_reports"),
          ];
          items.push(
              getItem("Psicometría", "kuiz", <QuestionCircleOutlined />, children)
          );
        }
      }

      // Menú YNL
      if (props?.applications) {
        let show_ynl_module = false;
        for (let item in props.applications) {
          if (item === "ynl") {
            if (props.applications[item].active) {
              show_ynl_module = true;
            }
          }
        }
        if (show_ynl_module) {
          children = [
            getItem("Dashboard general", "ynl_general_dashboard"),
            getItem("Dashboard personal", "ynl_personal_dashboard"),
            props?.applications?.ynl?.showFilterSite?.allow_view_users_non_site  && getItem('Personas YNL', 'ynl_people_dashboard')
          ];
          items.push(getItem("YNL", "ynl", <UserOutlined />, children));
        }
      }

      //Menú Bolsa de trabajo
      if (props?.applications) {
        let show_jobbank_module = false;
        for (let item in props.applications) {
          if (item === "jobbank") {
            if (props.applications[item].active) {
              show_jobbank_module = true;
            }
          }
        }
        if (show_jobbank_module) {
          children = [
            getItem("Clientes", "jb_clients"),
            getItem("Vacantes", "jb_vacancies"),
            getItem("Estrategias", "jb_strategies"),
            getItem("Template de vacante", "jb_profiles"),
            getItem("Postulaciones", "jb_applications"),
            getItem("Candidatos", "jb_candidates"),
            getItem("Publicaciones", "jb_publications"),
            getItem("Preselección", "jb_preselection"),
            getItem("Proceso de selección", "jb_selection"),
            getItem("Calendario", "jb_interviews"),
            getItem("Configuraciones", "jb_settings")
          ];
          items.push(
            getItem("Bolsa de trabajo", "job_bank", <WorkOutline />, children)
          );
        }
      }

      let subSecurity = [
        getItem("Roles de administrador", "security_roles"),
        getItem("Asignar empresa", "security_assign")
      ];

      items.push(getItem("Seguridad","security", <SafetyCertificateOutlined />, subSecurity))
    }

    return items;
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme={theme}
      width={250}
    >
      <div className="logo" />
      <Menu
        theme={theme}
        defaultSelectedKeys={currentKey}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        onClick={onClickMenuItem}
        items={getMenuItems()}
      />
    </Sider>
  );

  /*return (
    <>
      <Sider className="mainSideMenu" width="250" collapsible>
        <div className="logo" />
        <Menu
          theme="light"
          className="mainMenu"
          defaultSelectedKeys={currentKey}
          defaultOpenKeys={defaultOpenKeys ? defaultOpenKeys : [""]}
          mode="inline"
        >
          {/!* {props.config && props.config.nomina_enabled && (
            <Menu.Item
              key="dashboard"
              onClick={() => router.push({ pathname: "/dashboard" })}
              icon={<AppstoreOutlined />}
            >
              Dashboard
            </Menu.Item>
          )} *!/}
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
                  Movimientos IMSS
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
              {/!* <Menu.Item
                key="assignments"
                onClick={() =>
                  router.push({ pathname: "/assessment/assignments" })
                }
              >
                Asignaciones
              </Menu.Item> *!/}
            </SubMenu>
          )}
          <SubMenu
              key="ynl"
              title="YNL"
              className="subMainMenu"
              icon={<UserOutlined />}
            >
              <Menu.Item
                icon={<ProfileOutlined />}
                key="general-dashboard"
                onClick={() => router.push({ pathname: "/general-dashboard" })}
              >
                General
              </Menu.Item>
              <Menu.Item
                icon={<ProfileOutlined />}
                key="general-dashboard-personal"
                onClick={() => router.push({ pathname: "/general-dashboard-personal" })}
              >
                Personal
              </Menu.Item>
            </SubMenu>
        </Menu>
      </Sider>
    </>
  );*/
};

const mapState = (state) => {  
  return {
    currentNode: state.userStore.current_node,
    config: state.userStore.general_config,
    permissions: state.userStore.permissions,
    applications: state.userStore.applications,
    companyFiscalInformation: state.fiscalStore.company_fiscal_information
  };
};
export default connect(mapState, {getCompanyFiscalInformation})(MainSider);
