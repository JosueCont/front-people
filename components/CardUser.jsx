import { Card, Image, Button, Modal } from "antd";
import {
  EditOutlined,
  SettingOutlined,
  PoweroffOutlined,
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
          <Button>
            <SettingOutlined key="setting" />
          </Button>,
          <Button onClick={() => Router.push(`/home/${props.person.id}`)}>
            <EditOutlined key="edit" />
          </Button>,
          <Button onClick={() => props.acction(true)}>
            <PoweroffOutlined key="PoweroffOutlined" />
          </Button>,
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
