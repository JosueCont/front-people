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
  ApartmentOutlined,
  FunnelPlotOutlined,
  SolutionOutlined
} from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import PermDataSettingOutlinedIcon from '@material-ui/icons/PermDataSettingOutlined';
import HowToRegOutlinedIcon from '@material-ui/icons/HowToRegOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import { GroupOutlined, WorkOutline } from "@material-ui/icons";
import { IntranetIcon } from "./CustomIcons";

const { Sider, Header, Content, Footer } = Layout;

const MainSider = ({
  hideMenu,
  currentKey,
  defaultOpenKeys = null,
  hideProfile = true,
  onClickImage = true,
  ...props
}) => {
  const router = useRouter();
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
    const pathRoutes = {
      business: "/business",
      asign: "/config/assignedCompanies",
      patronal: "/business/patronalRegistrationNode",
      persons: "/home/persons",
      groups_people: "/home/groups",
      catalogs: "/config/catalogs",
      securityGroups: "/config/groups",
      releases: "/comunication/releases",
      events: "/comunication/events",
      reports: "/reports",
      lending: "/lending",
      holidays: "/holidays",
      permission: "/permission",
      incapacity: "/incapacity",
      bank_accounts: "/bank_accounts",
      calculatePayroll: "/payroll/calculatePayroll",
      extraordinaryPayroll: "/payroll/extraordinaryPayroll",
      paymentCalendar: "/payroll/paymentCalendar",
      payrollVoucher: "/payroll/payrollVoucher",
      calculatorSalary: "/payroll/calculatorSalary",
      integrationFactors: "/business/integrationFactors",
      importMassivePayroll: "/payroll/importMasivePayroll",
      imssMovements: "/payroll/imssMovements",
      bulk_upload: "/bulk_upload",
      documentsLog: "/log/documentsLog",
      intranet_groups: "/intranet/groups",
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
      jb_publications: "/jobbank/publications"
    };
    router.push("#");
  };

  let items = [];
  let children = [];

  // Función para obtener la lista de elementos del menú
  function getMenuItems() {
    if (typeof window !== "undefined") {
      // Estrategia y planeación
      let children0 = [
        getItem("Empresa", "company"),
        getItem("Colaboradores", "colab")
      ]
      items.push(getItem("Estrategia y planeación", "strategyPlaning", <ApartmentOutlined />, children0))

      // Administración de RH
      let children001 = [
        getItem("Cálculo de nómina", "nomina_calc"),
        getItem("Nóminas extraordinarias", "nomina_extra"),
        getItem("Calendario de pagos", "nomina_calendario"),
        getItem("Comprobantes fiscales", "nomina_comprob"),
        getItem("Calculadora", "nomina_calculadora"),
        getItem("Importar nómina con XML", "nomina_importador"),
        getItem("Movimientos IMSS", "nomina_imss"),
      ]
      let children0001 =[
        getItem("Préstamos", "prestamos"),
        getItem("Vacaciones", "vacaciones"),
        getItem("Permisos", "permisos"),
        getItem("Incapacidad", "incapacidad"),
        getItem("Cuentas bancarias", "cuentas_bancarias"),
      ]
      let children002 = [
        getItem("Solicitudes", "solicitudes", <></>, children0001),
        getItem("Comunicados", "comunicados"),
        getItem("Eventos", "eventos")
      ]
      let children01 = [
        getItem("Nómina", "nomina",<></>, children001),
        getItem("Concierge", "concierge",<></>, children002)
      ]
      items.push(getItem("Administración de RH", "managementRH", <GroupOutlined />, children01))

      // Reclutamiento y selección
      let children021 = [
        getItem("Clientes", "btClientes"),
        getItem("Vacantes", "btVacantes"),
        getItem("Estrategias", "btEstrategias"),
        getItem("Template de vacante", "btTemplateVacante"),
        getItem("Publicaciones", "btPublicaciones"),
        getItem("Candidatos", "btClientes"),
        getItem("Configuraciones", "btConfig"),
      ]
      let children02 = [
        getItem("Bolsa de trabajo", "bolsa", <></>, children021)
      ]
      items.push(getItem("Reclutamiento y selección", "recruitmentSelection", <FunnelPlotOutlined />, children02))

      // Evaluación y diagnóstico
      let children11 = [
        getItem("Evaluaciones", "eval"),
        getItem("Grupo de evaluaciones", "groupEval"),
        getItem("Perfiles de competencias", "perfCompetencias"),
        getItem("Reporte de competencias", "repCompetencias")
      ]
      let children1 = [getItem("PsiKHORmetría", "psikhormetria", <></>, children11)]
      items.push(getItem("Evaluación y diagnóstico", "evaluationDiagnosis", <SolutionOutlined />, children1))

      // Educación y desarrollo
      let children2 = [
        getItem("Khorflix", "khorflix"),
        getItem("Sukha", "sukha"),
        getItem("Careerlab", "careerlab"),
        getItem("Concieo", "concieo")
      ]
      items.push(getItem("Educación y desarrollo", "education", <BankOutlined />, children2))

      // desempeño
      items.push(getItem("Desempeño", "performance", <PermDataSettingOutlinedIcon />))

      // Compromiso
      let children31 = [
        getItem("Dashboard general", "ynlgral"),
        getItem("Dashboard personal", "ynlpers")
      ]
      let children3 = [
        getItem("KHOR Connect", "connect"),
        getItem("YNL", "ynl", <></>, children31),
        getItem("Notificaciones", "notificaciones"),
      ]
      items.push(getItem("Compromiso", "commitment", <HowToRegOutlinedIcon />, children3))

      // Analytics
      items.push(getItem("Analytics", "analytics", <AssessmentOutlinedIcon />))

      // Analytics
      let children4 = [
        getItem("Registro de errores", "logsErrors"),
        getItem("Configuración", "config")
      ]
      items.push(getItem("Utilidades/Configuración", "utilities", <SettingOutlined />, children4))
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
  };
};
export default connect(mapState)(MainSider);
