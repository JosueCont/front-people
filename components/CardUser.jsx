import { Card, Image, Button, Tooltip } from "antd";
import {
  EditOutlined,
  PoweroffOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { setNullCompany } from '../redux/UserDuck'

import Router from "next/router";
import { connect } from "react-redux";

const { Meta } = Card;

const cardUser = ({ currentNode, ...props }) => {
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
            <Button
              onClick={() => {
                Router.push({ pathname: "/select-company" });
              }}
            >
              <SwapOutlined />
            </Button>
          </Tooltip>,
          <Tooltip title="Editar perfil" color={"#3d78b9"} key={"#3d78b9"}>
            <Button
              onClick={() => {
                !props.person.nodes && currentNode
                  ? Router.push(`/ac/urn/${currentNode.permanent_code}`)
                  : Router.push(`/home/${props.person.id}`);
              }}
            >
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

const mapState = (state) => {
  return {
    userInfo: state.userStore.user
  };
};



export default connect(mapState, { setNullCompany })(cardUser);
