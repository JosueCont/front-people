import { Layout, Menu, Avatar, Dropdown, message } from "antd";
import { AppstoreOutlined, UserOutlined } from "@ant-design/icons";
import CardUser from "./CardUser";
import CardApps from "./CardApps";
import { Router } from "next/router";
import { useRouter } from "next/router";

const { Header } = Layout;

const { SubMenu } = Menu;

const userCardDisplay = () => (
  <>
    <CardUser />
  </>
);

const appsCardDisplay = () => (
  <>
    <CardApps />
  </>
);

export default function headerCustom(props) {
  const router = useRouter();
  return (
    <Header>
      <div className="logo" key="content_logo" />
      <Menu
        key="main_menu"
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[props.currentKey]}
      >
        {/* <Menu.Item>
            <div style={{ float: "left" }} key={'app_'+props.currentKey}>
                <Dropdown overlay={appsCardDisplay} key="drop_icon">
                    <div key="app_icon_content">
                        <AppstoreOutlined key="icon_app" style={{ fontSize: "26px", color: "#08c" }} />
                    </div>
                </Dropdown>
            </div>
        </Menu.Item> */}
        <Menu.Item key="1" onClick={() => router.push({ pathname: "/home" })}>
          Personas
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => router.push({ pathname: "/business" })}
        >
          Empresas
        </Menu.Item>
        <Menu.Item key="3">Configuración</Menu.Item>

        <SubMenu key="4" title="Comunicación">
          <Menu.Item
            key="4.1"
            onClick={() => router.push({ pathname: "/comunication/releases" })}
          >
            Comunicados
          </Menu.Item>
          <Menu.Item
            key="4.2"
            onClick={() => router.push({ pathname: "/comunication/events" })}
          >
            Eventos
          </Menu.Item>
        </SubMenu>
        {/* <Menu.Item
          key="5"
          onClick={() => router.push({ pathname: "/holidays" })}
        >
          Vacaciones
        </Menu.Item> */}
        <Menu.Item key="6" onClick={() => router.push({ pathname: "/groups" })}>
          Perfiles de seguridad
        </Menu.Item>
        <SubMenu key="8" title="Reportes">
          <Menu.Item
            key="8.1"
            onClick={() => router.push({ pathname: "/reports/collaborator" })}
          >
            Empleados
          </Menu.Item>
          <Menu.Item key="8.2">Nómina</Menu.Item>
          <Menu.Item
            key="8.3"
            onClick={() =>
              router.push({ pathname: "/reports/payrollDepartament" })
            }
          >
            Nómina por departamento/área
          </Menu.Item>
          <Menu.Item
            key="8.4"
            onClick={() => router.push({ pathname: "/reports/loan_tracking" })}
          >
            Seguimiento de préstamos
          </Menu.Item>
          <Menu.Item
            key="8.5"
            onClick={() => router.push({ pathname: "/reports/holidays" })}
          >
            Solicitudes de vacaciones
          </Menu.Item>
          <Menu.Item
            key="8.6"
            onClick={() => router.push({ pathname: "/reports/inability" })}
          >
            Solicitudes de incapacidad
          </Menu.Item>
        </SubMenu>
        <SubMenu key="7" title="Solicitudes">
          <Menu.Item
            key="7.1"
            onClick={() => router.push({ pathname: "/lending" })}
          >
            Prestamos
          </Menu.Item>
          <Menu.Item
            key="7.2"
            onClick={() => router.push({ pathname: "/holidays" })}
          >
            Vacaciones
          </Menu.Item>
        </SubMenu>

        <div
          className={"pointer"}
          style={{ float: "right" }}
          key={"menu_user_" + props.currentKey}
        >
          <Dropdown overlay={userCardDisplay} key="dropdown_user">
            <div key="menu_user_content">
              <Avatar
                key="avatar_key"
                icon={
                  <UserOutlined />
                } /* src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" */
              />
            </div>
          </Dropdown>
        </div>
      </Menu>
    </Header>
  );
}
