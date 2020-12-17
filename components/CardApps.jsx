import { Card, message, Space } from "antd";
import { BankOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import Router from "next/router";

const { Meta } = Card;

const cardApps = () => {
  const openApp = (appName) => {
    Router.push("/" + appName);
  };

  const messageAdd = () => message.success("Agregar nueva App");

  return (
    <>
      <Card
        hoverable={true}
        style={{ width: 300 }}
        actions={[<PlusOutlined onClick={messageAdd} key="setting" />]}
      >
        <Space>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <BankOutlined
              hoverable={true}
              onClick={() => openApp("business")}
              style={{ fontSize: "40px" }}
            />
            <span>Business</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <TeamOutlined
              hoverable={true}
              onClick={() => openApp("home")}
              style={{ fontSize: "40px" }}
            />
            <span>People</span>
          </div>
        </Space>
      </Card>
    </>
  );
};

export default cardApps;
