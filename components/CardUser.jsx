import { Card, Image, Button } from "antd";
import {
  EditOutlined,
  SettingOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

import Router from "next/router";
import { logoutAuth } from "../libs/auth";

const { Meta } = Card;

const cardUser = (props) => {
  return (
    <>
      <Card
        key="card_user"
        hoverable={true}
        style={{ width: 250 }}
        cover={
          <Image
            key="img_user"
            alt="example"
            src={props.person.photo}
            height={250}
          />
        }
        actions={[
          <Button>
            <SettingOutlined key="setting" />
          </Button>,
          <Button onClick={() => Router.push(`/home/${props.person.id}`)}>
            <EditOutlined key="edit" />
          </Button>,
          <Button onClick={() => logoutAuth()}>
            <PoweroffOutlined key="PoweroffOutlined" />
          </Button>,
        ]}
      >
        <Meta title={props.person.fullName} description={props.person.email} />
      </Card>
    </>
  );
};

export default cardUser;
