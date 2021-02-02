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
    <Header >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[props.currentKey]}
      >
        <Menu.Item key="1" onClick={() => router.push({ pathname: "/home" })}>
          Personas
        </Menu.Item>
        <div style={{ float: "left" }}>

          <Dropdown overlay={appsCardDisplay}>

            <div>

              <AppstoreOutlined style={{ fontSize: "26px", color: "#08c" }} />

            </div>

          </Dropdown>

        </div>
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

        <div style={{ float: "right" }}>
          <Dropdown overlay={userCardDisplay}>
            <div>
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </div>
          </Dropdown>
        </div>
      </Menu>
    </Header>
  );
}
