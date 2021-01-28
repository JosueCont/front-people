import { Card, Col, message, Space } from "antd";
import {
  BankOutlined,
  PlusOutlined,
  TeamOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Router from "next/router";
import Link from "next/link";

const { Meta } = Card;

const cardApps = () => {
  const openApp = (appName) => {
    Router.push("/" + appName);
  };

  const openExternalUrl = (url) => {
    window.location.href = url;
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "15px",
            }}
          >
            <VideoCameraOutlined
              hoverable={true}
              onClick={() => openExternalUrl("https://demo.lms.ddns.me")}
              style={{ fontSize: "40px" }}
            />
            <span>LMS</span>
          </div>
        </Space>
      </Card>
    </>
  );
};

export default cardApps;
