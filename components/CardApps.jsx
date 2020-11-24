import { Card, Avatar, message } from "antd";
import { QqOutlined, PlusOutlined } from "@ant-design/icons";

const { Meta } = Card;

const messageDialog = () => message.info("Bienvenido a Khor+");

const messageAdd = () => message.success("Agregar nueva App");

export default function cardApps() {
  return (
    <>
      <Card
        hoverable={true}
        style={{ width: 300 }}
        actions={[<PlusOutlined onClick={messageAdd} key="setting" />]}
      >
        <QqOutlined onClick={messageDialog} style={{ fontSize: "30px" }} />
      </Card>
    </>
  );
}
