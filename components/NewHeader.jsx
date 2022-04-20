import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Avatar,
  Menu,
  Dropdown,
  Card,
  Button,
  Typography,
  Divider,
  Modal,
  Space,
  Badge,
} from "antd";
import { UserOutlined, MenuOutlined, BellOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { css, Global } from "@emotion/core";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import Cookie from "js-cookie";
import WebApiPeople from "../api/WebApiPeople";
import { logoutAuth } from "../libs/auth";
import CardApps from "./dashboards-cards/CardApp";

const NewHeader = ({ hideSearch, mainLogo, hideLogo, ...props }) => {
  const { Text } = Typography;
  const router = useRouter();
  const { pathname } = router;
  const { Header } = Layout;
  const [logOut, setLogOut] = useState(false);
  const [person, setPerson] = useState({});
  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

  useEffect(() => {
    getPerson();
  }, []);

  const getPerson = async () => {
    try {
      const user = JSON.parse(Cookie.get("token"));
      let response = await WebApiPeople.personForKhonnectId({
        id: user.user_id,
      });
      if (!response.data.photo) response.data.photo = defaulPhoto;
      let personName =
        response.data.first_name + " " + response.data.flast_name;
      if (response.data.mlast_name)
        personName = personName + " " + response.data.mlast_name;
      response.data.fullName = personName;
      setPerson(response.data);
    } catch (error) {
      console.log(error);
      setPerson({ photo: defaulPhoto });
    }
  };

  const editProfile = () => {
    !person.nodes && props.currentNode
      ? router.push(`/ac/urn/${props.currentNode.permanent_code}`)
      : router.push(`/home/persons/${person.id}`);
  };

  const userCardDisplay = () => (
    <>
      <Card className="card_menu">
        <div style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
          <Row gutter={[20]}>
            <Col style={{ display: "flex" }}>
              <Avatar
                key="avatar_key"
                icon={<UserOutlined />}
                src={person.photo}
                style={{ margin: "auto" }}
              />
            </Col>
            <Col>
              <Text strong>{person.fullName}</Text>
              <br />
              <Text>{person.email}</Text>
              <br />
              <small>
                <b>{props.currentNode ? props.currentNode.name : ""}</b>
              </small>
            </Col>
          </Row>
          <Divider className="divider-primary" style={{ margin: "10px 0px" }} />
        </div>
        <Row>
          <Col span={24} style={{ padding: 10 }}>
            <p
              className="text-menu"
              onClick={() => {
                !person.nodes && props.currentNode
                  ? router.push(`/ac/urn/${props.currentNode.permanent_code}`)
                  : router.push(`/home/persons/${person.id}`);
              }}
            >
              <Text>Editar perfil</Text>
            </p>
            {pathname !== "/select-company" && (
              <p
                className="text-menu"
                onClick={() => router.push("/select-company")}
              >
                <Text>Cambiar de empresa</Text>
              </p>
            )}
            <p className="text-menu" onClick={() => setLogOut(true)}>
              <Text>Cerrar sesión</Text>
            </p>
          </Col>
        </Row>
      </Card>
    </>
  );

  return (
    <>
      <Global
        styles={css`
          .ant-layout-header {
            background-color: transparent !important;
          }
          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: var(--primaryColor) !important;
            opacity: 0.9;
          }
          /* .ant-menu .ant-menu-item {
            margin: 0px !important;
            padding: 0px !important;
          } */
          .text-menu {
            padding-bottom: 5px;
            padding-top: 5px;
            margin: 0px;
            padding: 5px;
            cursor: pointer;
          }
          .text-menu:hover {
            background-color: var(--primaryColor);
            opacity: 0.6;
            border-radius: 20px;
            padding: 5px;
          }
          .text-menu:hover span {
            color: var(--fontSpanColor);
          }
          .card_menu .ant-card-body {
            padding: 0px;
          }
        `}
      />
      <Header
        style={{
          position: "relative",
          backgroundColor: "transparent !important",
        }}
      >
        <div className="overlay" />
        <div className="container-fluid">
          <Row justify="space-between">
            <Col style={{ width: 250, display: "flex" }}>
              <object
                style={{ maxWidth: 100, margin: "auto", maxHeight: 50 }}
                data="/images/LogoKhorconnect.svg"
                type="image/svg+xml"
              >
                <img
                  style={{ maxWidth: 100, margin: "auto", maxHeight: 50 }}
                  src={!hideLogo ? mainLogo : "/images/LogoKhorconnect.svg"}
                />
              </object>
            </Col>
            <Col style={{ width: 250, textAlign: "end" }}>
              <div
                className={"pointer"}
                style={{ float: "right" }}
                key={"menu_user_" + props.currentKey}
              >
                <Space size={"middle"}>
                  {/* <Badge dot>
                    <BellOutlined
                      style={{ color: "white", fontSize: 20 }}
                      onClick={() => props.setShowEvents(true)}
                    />
                  </Badge> */}
                  <Dropdown overlay={<CardApps />} key="dropdown_apps">
                    <div key="menu_apps_content">
                      <BsFillGrid3X3GapFill
                        style={{
                          color: "white",
                          fontSize: 30,
                          display: "flex",
                          margin: "auto",
                        }}
                      />
                    </div>
                  </Dropdown>
                  <Dropdown overlay={userCardDisplay} key="dropdown_user">
                    <div key="menu_user_content">
                      <Avatar
                        key="avatar_key"
                        icon={<UserOutlined />}
                        src={person.photo}
                      />
                    </div>
                  </Dropdown>
                </Space>
              </div>

              {/* <Avatar
                        style={{margin:'0 20px'}}
                            key="avatar_key"
                            icon={<UserOutlined />}
                            src={'https://d500.epimg.net/cincodias/imagenes/2016/07/04/lifestyle/1467646262_522853_1467646344_noticia_normal.jpg'}
                        /> */}
            </Col>
          </Row>
        </div>
      </Header>

      <Modal
        title="Cerrar sesión"
        centered
        visible={logOut}
        onOk={() => logoutAuth()}
        onCancel={() => setLogOut(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setLogOut(false)}
            style={{ padding: "0 10px", marginLeft: 15 }}
          >
            Cancelar
          </Button>,
          <Button
            key="submit_modal"
            type="primary"
            onClick={logoutAuth}
            style={{ padding: "0 10px", marginLeft: 15 }}
          >
            Cerrar sesión
          </Button>,
        ]}
      >
        ¿Está seguro de cerrar sesión?
      </Modal>
    </>
  );
};

export default NewHeader;
