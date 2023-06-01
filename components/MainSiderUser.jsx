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
import { getCurrentURL } from "../utils/constant";
import { urlSocial, urlSukha, urlMyAccount, urlKhorflx, urlCareerlab} from "../config/config";
import _ from "lodash"
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

  // Rutas menú
  const onClickMenuItem = ({ key }) => {
    const pathRoutes = {};
    switch (key){
      case "sukha":
        const token1 = user.jwt_data.metadata.at(-1).token;
        let url1;
        if (process.env.NEXT_PUBLIC_TENANT_USE_DEMO_SUKHA){
          if (process.env.NEXT_PUBLIC_TENANT_USE_DEMO_SUKHA.includes(getCurrentURL(true, true))){
            url1 = `https://demo.${urlSukha}/validation?token=${token1}`;
          }else{
            url1 = `${getCurrentURL(true)}.${urlSukha}/validation?token=${token1}`;
          }
        }else{
          url1 = `${getCurrentURL(true)}.${urlSukha}/validation?token=${token1}`;
        }
        // const url1 = `https://demo.${urlSukha}/validation?token=${token1}`;
        const link1 = document.createElement('a');
        link1.href = url1;
        link1.click();
        break;
      case "khorflix":
        const token2 = user.jwt_data.metadata.at(-1).token;
        const url2 = `${getCurrentURL(true)}.${urlKhorflx}/validation?token=${token2}`;
        // const url1 = `https://demo.${urlSukha}/validation?token=${token1}`;
        const link2 = document.createElement('a');
        link2.href = url2;
        link2.click();
        break;
      case "careerlab":
        const token3 = user.jwt_data.metadata.at(-1).token;
        const link3 = document.createElement('a');
        // link3.href = `https://platform.${urlCareerlab}/validation?token=${token3}`;
        link3.href = `https://platform.${urlCareerlab}`;
        link3.target = '_blank';
        link3.click();
        break;
      case "connect":
        const token4 = user.jwt_data.metadata.at(-1).token;
        const url4 = `${getCurrentURL(true)}.${urlSocial}/validation?token=${token4}`;
        const link4 = document.createElement('a');
        link4.href = url4;
        link4.click();
        break;
      case "myEvaluation":
        // const token5 = user.jwt_data.metadata.at(-1).token;
        // const url5 = `${getCurrentURL(true)}.${urlMyAccount}/validation?token=${token5}`;
        // const link5 = document.createElement('a');
        // link5.href = url5;
        // link5.target = '_blank';
        // link5.click();
        router.push("/user/assessments/")
        break;
      case "dashboard":
        router.push("/user")
        break;
      default:
        router.push('#');
    }
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
