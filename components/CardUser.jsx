import { Card, Image, Button, Modal, Tooltip } from "antd";
import {
  EditOutlined,
  SettingOutlined,
  PoweroffOutlined,
  SwapOutlined,
} from "@ant-design/icons";

import Router from "next/router";

const { Meta } = Card;

const cardUser = (props) => {
  return (
    <>
      <Card
        key="card_user"
        hoverable={true}
        style={{ width: 180 }}
        cover={
          <Image
            key="img_user"
            alt="example"
            src={props.person.photo}
            height={180}
          />
        }
        actions={[
          <Tooltip title="Cambiar empresa" color={"#3d78b9"} key={"#3d78b9"}>
            <Button onClick={() => Router.push({ pathname: "/selectCompany" })}>
              <SwapOutlined />
            </Button>
          </Tooltip>,
          <Tooltip title="Editar perfil" color={"#3d78b9"} key={"#3d78b9"}>
            <Button onClick={() => Router.push(`/home/${props.person.id}`)}>
              <EditOutlined key="edit" />
            </Button>
          </Tooltip>,
          <Tooltip title="Cerrar sesión" color={"#3d78b9"} key={"#3d78b9"}>
            <Button onClick={() => props.acction(true)}>
              <PoweroffOutlined key="PoweroffOutlined" />
            </Button>
          </Tooltip>,
        ]}
      >
        <Meta
          style={{ fontSize: "10px" }}
          title={props.person.fullName}
          description={props.person.email}
        />
      </Card>
    </>
  );
};

export default cardUser;
