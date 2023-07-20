import React, { useEffect, useLayoutEffect, useState } from "react";
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
  PieChartFilled
} from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import PermDataSettingOutlinedIcon from '@material-ui/icons/PermDataSettingOutlined';
import HowToRegOutlinedIcon from '@material-ui/icons/HowToRegOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import { GroupOutlined, WorkOutline } from "@material-ui/icons";
import { IntranetIcon } from "./CustomIcons";
import {
  getCurrentURL,
  redirectTo
} from "../utils/constant";
import {
  urlSocial,
  urlSukha,
  urlMyAccount,
  urlKhorflx,
  urlCareerlab
} from "../config/config";
import _ from "lodash";
const { Sider, Header, Content, Footer } = Layout;

const { useBreakpoint } = Grid;

const MainSider = ({
  user,
  hideMenu,
  currentKey,
  defaultOpenKeys = null,
  hideProfile = true,
  onClickImage = true,
  menuCollapsed,
  setMenuCollapsed,
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
  
  const routeSukha = () =>{
    const token = user?.jwt_data?.metadata?.at(-1)?.token;
    let tenant = process.env.NEXT_PUBLIC_TENANT_USE_DEMO_SUKHA;
    let current = getCurrentURL(true, true);
    if(tenant && tenant.includes(current)){
      let url = `${getCurrentURL(true)}.${urlSukha}/validation?token=${token}`;
      redirectTo(url)
      return;
    }
  }

  const routeKhorflix = () =>{
    const token = user?.jwt_data?.metadata?.at(-1)?.token;
    const url = `${getCurrentURL(true)}.${urlKhorflx}/validation?token=${token}`;
    redirectTo(url)
  }

  const routeCareerlab = () =>{
    const token = user?.jwt_data?.metadata?.at(-1)?.token;
    const url = `https://platform.${urlCareerlab}`;
    redirectTo(url)
  }

  const routeConnect = () =>{
    const token = user.jwt_data.metadata.at(-1).token;
    const url = `${getCurrentURL(true)}.${urlSocial}/validation?token=${token}`;
    redirectTo(url)
  }

  const pathRoutes = {
    sukha: routeSukha,
    khorflix: routeKhorflix,
    careerlab: routeCareerlab,
    connect: routeConnect,
    myEvaluation: '/user/assessments/',
    dashboard: '/user',
    holidays: '/user/requests/holidays'
  }

  // Rutas menú
  const onClickMenuItem = ({ key }) => {
    const action = pathRoutes[key] ? pathRoutes[key] : '#';
    if(typeof action == 'function'){
      action()
      return;
    }
    router.push(action)
  };

  let items = [];
  let children = [];

  // Función para obtener la lista de elementos del menú
  function getMenuItems() {
    if (typeof window !== "undefined") {
      // Estrategia y planeación
      // items.push(getItem("Estrategia y planeación", "strategyPlaning", <ApartmentOutlined />))

      // Administración de RH
      // items.push(getItem("Administración de RH", "managementRH", <GroupOutlined />))

      // Reclutamiento y selección
      // items.push(getItem("Reclutamiento y selección", "recruitmentSelection", <FunnelPlotOutlined />))

      // Dashboard
      items.push(getItem("Dashboard", "dashboard", <PieChartFilled />));

      if (props?.applications && (_.has(props.applications, "concierge") && props.applications["concierge"].active)) {
        let subMenuRequests = [getItem("Vacaciones", "holidays")];
        let subMenuConcierge = [getItem("Solicitudes", "requests", <></>, subMenuRequests)];
        let subMenuRH = [getItem("Concierge", "concierge",<></>, subMenuConcierge)];
        items.push(getItem("Administración de RH", "managementRH", <GroupOutlined />, subMenuRH));
      }


      // Evaluación y diagnóstico
      let children1 = [getItem("Mis evaluaciones", "myEvaluation")]
      items.push(getItem("Evaluación y diagnóstico", "evaluationDiagnosis", <SolutionOutlined />, children1))

      // Educación y desarrollo
      // let children2 = [
      //   getItem("Khorflix", "khorflix"),
      //   getItem("Sukha", "sukha"),
      //   getItem("Careerlab", "careerlab"),
      //   // getItem("Concieo", "concieo")
      // ]
      let children2 = [];
      if (props?.applications && (_.has(props.applications, "khorflix") && props.applications["khorflix"].active) && user?.khorflix_access) {
        children2.push(getItem("Khorflix", "khorflix"))
      }
      if (props?.applications && (_.has(props.applications, "sukhatv") && props.applications["sukhatv"].active) && user?.sukhatv_access) {
        children2.push(getItem("SukhaTV", "sukha"))
      }
      if (props?.applications && (_.has(props.applications, "careerlab") && props.applications["careerlab"].active) && user?.careerlab_access) {
        children2.push(getItem("Careerlab", "careerlab"))
      }
      if (children2.length > 0) {
        items.push(getItem("Educación y desarrollo", "education", <BankOutlined />, children2))
      }

      // desempeño
      // items.push(getItem("Desempeño", "performance", <PermDataSettingOutlinedIcon />))

      // Compromiso
      let children3 = []
      if ([2,3].includes(user?.intranet_access) && props.applications?.khorconnect?.active){
        children3.push(getItem("KHOR Connect", "connect"))
      }
      if(children3?.length > 0){
        items.push(getItem("Compromiso", "commitment", <HowToRegOutlinedIcon />, children3))
      }
      // Analytics
      // items.push(getItem("Analytics", "analytics", <AssessmentOutlinedIcon />))

      // Analytics
      // items.push(getItem("Utilidades/Configuración", "utilities", <SettingOutlined />))
    }

    return items;
  }

  return (<>
  {((!collapsed && screens.lg) || !menuCollapsed)
    && (screens.xs || screens.sm  || screens.md)
    && <div className={'sider-overlay'}/> }
    <Sider
      collapsible
      collapsed={screens.lg ? collapsed : menuCollapsed}
      onCollapse={(value) => screens.lg ? setCollapsed(value) : setMenuCollapsed(value)}
      theme={theme}
      width={250}
      breakpoint="lg"
      onBreakpoint={e =>{
        setCollapsed(false);
        setMenuCollapsed(false);
      }}
      collapsedWidth={screens.lg ? 80 : 0}
      trigger={!screens.lg && null}
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
  };
};
export default connect(mapState)(MainSider);
