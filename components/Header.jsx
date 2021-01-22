import { Layout, Menu, Avatar, Dropdown, message } from "antd";
import { AppstoreOutlined, UserOutlined } from "@ant-design/icons";
import CardUser from "./CardUser";
import CardApps from "./CardApps";
import { Router } from "next/router";
import { useRouter } from "next/router";

const { Header } = Layout;

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

export default function headerCustom() {
  const router = useRouter();
  return (
    <>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <div style={{ float: "left" }}>
            <Dropdown overlay={appsCardDisplay}>
              <div>
                <AppstoreOutlined style={{ fontSize: "26px", color: "#08c" }} />
              </div>
            </Dropdown>
          </div>
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
          <div style={{ float: "right" }}>
            <Dropdown overlay={userCardDisplay}>
              <div>
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              </div>
            </Dropdown>
          </div>
        </Menu>
      </Header>
    </>
  );
}
