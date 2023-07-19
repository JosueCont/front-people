import React, { useLayoutEffect, useState } from "react";
import {Grid, Layout, Menu} from "antd";
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
  ApartmentOutlined,
  FunnelPlotOutlined,
  SolutionOutlined,
  PieChartFilled,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import PermDataSettingOutlinedIcon from '@material-ui/icons/PermDataSettingOutlined';
import HowToRegOutlinedIcon from '@material-ui/icons/HowToRegOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import { GroupOutlined, WorkOutline } from "@material-ui/icons";
import { IntranetIcon } from "./CustomIcons";
import _ from "lodash"
import { urlSocial, urlSukha, urlMyAccount, urlKhorflx, urlCareerlab} from "../config/config";
import { getCurrentURL } from "../utils/constant";
import {getCompanyFiscalInformation} from "./../redux/fiscalDuck"

const { Sider, Header, Content, Footer } = Layout;

const { useBreakpoint } = Grid;

const MainSider = ({
  hideMenu,
  currentKey,
  defaultOpenKeys = 'null',
  hideProfile = true,
  onClickImage = true,
  user,
  getCompanyFiscalInformation,
  companyFiscalInformation = null,
  ...props
}) => {
  const router = useRouter();
  const screens = useBreakpoint();
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
      permission: "/comunication/requests/permission",
      incapacity: "/comunication/requests/incapacity",
      bank_accounts: "/comunication/requests/bank_accounts",
      calculatePayroll: "/payroll/calculatePayroll",
      extraordinaryPayroll: "/payroll/extraordinaryPayroll",
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
    switch (key){
      case "sukha":
        const token1 = user.jwt_data.metadata.at(-1).token;
        const link1 = document.createElement('a');
        if (process.env.NEXT_PUBLIC_TENANT_USE_DEMO_SUKHA){
          if (process.env.NEXT_PUBLIC_TENANT_USE_DEMO_SUKHA.includes(getCurrentURL(true, true))){
            link1.href = `https://admin.demo.${urlSukha}/validation?token=${token1}`;
          }else{
            link1.href = `https://admin.${getCurrentURL(true, true)}.${urlSukha}/validation?token=${token1}`;
          }
        }else{
          link1.href = `https://admin.${getCurrentURL(true, true)}.${urlSukha}/validation?token=${token1}`;
        }
        // link1.href = "https://admin.demo.sukhatv.com/";
        link1.click();
        break;
      case "khorflix":
        const token2 = user.jwt_data.metadata.at(-1).token;
        const link2 = document.createElement('a');
        link2.href = `https://admin.${getCurrentURL(true, true)}.${urlKhorflx}/validation?token=${token2}`;
        // link1.href = "https://admin.demo.sukhatv.com/";
        link2.click();
        break;

        // const link2 = document.createElement('a');
        // link2.href = "https://admin.iu.khorflix.com/";
        // link2.target = '_blank';
        // link2.click();
        // break;
      case "careerlab":
        const token3 = user.jwt_data.metadata.at(-1).token;
        const link3 = document.createElement('a');
        // link3.href = `https://admin.platform.${urlCareerlab}/validation?token=${token3}`;
        link3.href = `https://admin.platform.${urlCareerlab}`;
        link3.target = '_blank';
        link3.click();
        break;
      default:
        router.push(pathRoutes[key]);
    }
  };

  let items = [];
  let children = [];

  // Función para obtener la lista de elementos del menú
  function getMenuItems() {
    if (typeof window !== "undefined") {
      // Dashboard
      items.push(getItem("Dashboard", "dashboard", <PieChartFilled />));
      // Estrategia y planeación
      let children0 = [
        getItem("Empresas", "business"),
        getItem("Prestaciones", "integrationFactors"),
        // getItem("Registros patronales", "patronal"),

      ]
      if(companyFiscalInformation?.assimilated_pay == false){
        children0.push(getItem("Registros patronales", "patronal"))
      }
      let children0101 = [
        getItem("Personas", "persons"),
        getItem("Grupos de personas", "groups_people"),
      ];
      let children90 = [
        getItem("Empresa", "company", <></>, children0),
        getItem("Colaboradores", "people", <></>, children0101)
      ]
      items.push(getItem("Estrategia y planeación", "strategyPlaning", <ApartmentOutlined />, children90));



      // Administración de RH
      let children01 = []
      if (props?.applications && (_.has(props.applications, "payroll") && props.applications["payroll"].active)) {
        let children001 = [
          getItem("Cálculo de nómina", "calculatePayroll"),
          getItem("Nóminas extraordinarias", "extraordinaryPayroll"),
          getItem("Calendario de pagos", "paymentCalendar"),
          getItem("Comprobantes fiscales", "payrollVoucher"),
          getItem("Calculadora", "calculatorSalary"),
          getItem("Importar nómina con XML", "importMassivePayroll"),
          // getItem("Movimientos IMSS", "imssMovements"),
        ];
        if(companyFiscalInformation?.assimilated_pay == false){
          children001.push(getItem("Movimientos IMSS", "imssMovements"))
        }
        children01.push(getItem("Nómina", "payroll",<></>, children001))
      }
      let children0001 =[
        getItem("Préstamos", "lending"),
        getItem("Vacaciones", "holidays"),
        getItem("Permisos", "permission"),
        getItem("Incapacidad", "incapacity"),
        getItem("Cuentas bancarias", "bank_accounts"),
      ]
      let children002 = [
        getItem("Solicitudes", "requests", <></>, children0001),
        getItem("Comunicados", "releases"),
        getItem("Eventos", "events")
      ]

      if (props?.applications && (_.has(props.applications, "concierge") && props.applications["concierge"].active)) {
        children01.push(getItem("Concierge", "concierge",<></>, children002))
      }

      if(children01.length>0){
        items.push(getItem("Administración de RH", "managementRH", <GroupOutlined />, children01))
      }




      // Reclutamiento y selección
      if (props?.applications && (_.has(props.applications, "jobbank") && props.applications["jobbank"].active)) {
        let children021 = [
          getItem("Clientes", "jb_clients"),
          getItem("Vacantes", "jb_vacancies"),
          getItem("Estrategias", "jb_strategies"),
          getItem("Template de vacante", "jb_profiles"),
          getItem("Postulaciones", "jb_applications"),
          getItem("Candidatos", "jb_candidates"),
          getItem("Publicaciones", "jb_publications"),
          getItem("Preselección", "jb_preselection"),
          getItem("Proceso de selección", "jb_selection"),
          getItem("Calendario","jb_interviews"),
          getItem("Configuraciones", "jb_settings")
        ]
        let children02 = [
          getItem("Bolsa de trabajo", "job_bank", <></>, children021)
        ]
        items.push(getItem("Reclutamiento y selección", "recruitmentSelection", <FunnelPlotOutlined />, children02))
      }

      // Evaluación y diagnóstico
      if (props?.applications && (_.has(props.applications, "kuiz") && props.applications["kuiz"].active)) {
        let children11 = [
          getItem("Evaluaciones", "surveys"),
          getItem("Grupos de evaluaciones", "assessment_groups"),
          getItem("Perfiles de competencias", "assessment_profiles"),
          getItem("Reportes de competencias", "assessment_reports"),
        ]
        let children1 = [getItem("Psicometría", "kuiz", <></>, children11)]
        items.push(getItem("Evaluación y diagnóstico", "evaluationDiagnosis", <SolutionOutlined />, children1))
      }

      // Educación y desarrollo
      let children2 = [];
      if (props?.applications && (_.has(props.applications, "khorflix") && props.applications["khorflix"].active) && user?.is_khorflix_admin) {
        children2.push(getItem("Khorflix", "khorflix"))
      }
      if (props?.applications && (_.has(props.applications, "sukhatv") && props.applications["sukhatv"].active) && user?.is_sukhatv_admin) {
        children2.push(getItem("SukhaTV", "sukha"))
      }
      if (props?.applications && (_.has(props.applications, "careerlab") && props.applications["careerlab"].active) && user?.is_careerlab_admin) {
        children2.push(getItem("Careerlab", "careerlab"))
      }
      if (children2.length > 0) {
        items.push(getItem("Educación y desarrollo", "education", <BankOutlined />, children2))
      }

      // desempeño
      // items.push(getItem("Desempeño", "performance", <PermDataSettingOutlinedIcon />))

      // Compromiso
      let children3 = []
      if (props?.applications && (_.has(props.applications, "khorconnect") && props.applications["khorconnect"].active)) {
        let children32 = [
          getItem("Configuración", "intranet_configuration"),
          getItem("Grupos", "intranet_groups"),
          getItem("Moderación", "publications_statistics"),
        ];
        children3.push(
          getItem("KHOR Connect", "intranet",  <></>, children32 ),
        )
      }
      if (props?.applications && (_.has(props.applications, "ynl") && props.applications["ynl"].active)) {
        let children31 = [
          getItem("Dashboard general", "ynl_general_dashboard"),
          getItem("Dashboard personal", "ynl_personal_dashboard"),
        ]
        children3.push(
          getItem("YNL", "ynl", <></>, children31),
        )
      }
      if (children3.length > 0) {
        items.push(getItem("Compromiso", "commitment", <HowToRegOutlinedIcon />, children3))
      }

      // Analytics
      // items.push(getItem("Analytics", "analytics", <AssessmentOutlinedIcon />))

      // Analytics

      let children7 = [
        getItem("Catálogos", "catalogs"),
        getItem("Perfiles de seguridad", "securityGroups"),
        // getItem("Roles de administrador", "config_roles"),
        // getItem("Asignar empresa", "asign"),
      ];
      let children8 = [
        // getItem("Carga masiva de personas", "bulk_upload"),
        // getItem("Carga de documentos", "documentsLog"),
        getItem("Log de sistema", "systemLog"),
      ];
      let children4 = [
        getItem("Registro de log", "uploads",  <></>, children8 ),
        getItem("Configuración", "config",  <></>, children7),
        getItem("Reportes", "reports")
      ]


      items.push(getItem("Utilidades/Configuración", "utilities", <SettingOutlined />, children4))

      let subSecurity = [
        getItem("Roles de administrador", "security_roles"),
        getItem("Asignar empresa", "security_assign")
      ];

      items.push(getItem("Seguridad","security", <SafetyCertificateOutlined />, subSecurity))
    }

    return items;
  }

  return (<>
    {!collapsed && (screens.xs || screens.sm  || screens.md) && <div className={'sider-overlay'}/> }
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme={theme}
      width={250}
      breakpoint="lg"
      collapsedWidth="80"
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
  </>);

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
    user: state.userStore.user,
    currentNode: state.userStore.current_node,
    config: state.userStore.general_config,
    permissions: state.userStore.permissions,
    applications: state.userStore.applications,
    companyFiscalInformation: state.fiscalStore.company_fiscal_information,
  };
};
export default connect(mapState, {getCompanyFiscalInformation})(MainSider);
