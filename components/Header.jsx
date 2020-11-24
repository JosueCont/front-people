import { Layout, Menu, Avatar, Dropdown, message } from "antd";
import { AppstoreOutlined, UserOutlined } from "@ant-design/icons";
import CardUser from "./CardUser";
import CardApps from "./CardApps";

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
  return (
    <>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <div style={{ float: "left" }}>
            <Dropdown overlay={appsCardDisplay}>
              <div>
                <AppstoreOutlined style={{ fontSize: "26px", color: "#08c" }} />
              </div>
            </Dropdown>
          </div>
          <Menu.Item key="1" disabled="true">
            nav 1
          </Menu.Item>
          <Menu.Item key="2" disabled="true">
            nav 2
          </Menu.Item>
          <Menu.Item key="3" disabled="true">
            nav 3
          </Menu.Item>
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
