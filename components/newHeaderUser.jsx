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
  Alert,
  Select,
  Image, Grid,
} from "antd";
import {
  UserOutlined,
  MenuOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { css, Global } from "@emotion/core";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import Cookie from "js-cookie";
import WebApiPeople from "../api/WebApiPeople";
import { logoutAuth } from "../libs/auth";
import { connect } from "react-redux";
import { setVersionCfdi } from "../redux/fiscalDuck";
import { setNullCompany, clearInfo } from '../redux/UserDuck'
import GenericModal from "./modal/genericModal";
import CardApps from "./dashboards-cards/CardApp";
import { verifyMenuNewForTenant } from "../utils/functions"
import { getCurrentURL } from "../utils/constant";

const { useBreakpoint } = Grid;

const NewHeader = ({
  hideSearch,
  mainLogo,
  hideLogo,
  menuCollapsed = false,
  setMenuCollapsed,
  ...props
}) => {
  const { Text } = Typography;
  const router = useRouter();
  const screens = useBreakpoint();
  const { pathname } = router;
  const { Header } = Layout;
  const [logOut, setLogOut] = useState(false);
  const [person, setPerson] = useState();
  const [modalCfdiVersion, setModalCfdiVersion] = useState(false);
  const [versionCfdiSelect, setVersionCfdiSelect] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

  useEffect(() => {
    getPerson();
  }, []);


  const getPerson = async () => {
    let user = Cookie.get();
    if (user && user != undefined && user.token) {
      user = JSON.parse(user.token);
      await WebApiPeople.personForKhonnectId({
        id: user.user_id,
      })
        .then((response) => {
          if (!response.data.photo) response.data.photo = defaulPhoto;
          let personName =
            response.data.first_name + " " + response.data.flast_name;
          if (response.data.mlast_name)
            personName = personName + " " + response.data.mlast_name;
          response.data.fullName = personName;
          setPerson(response.data);
          // let have_role = Object.keys(response?.data?.administrator_profile ?? {}).length > 0;
          if (response.data?.is_admin || localStorage.getItem('is_admin')) {
            setIsAdmin(true)
          }
          // setIsAdmin(localStorage.getItem('is_admin'));
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
                src={person.photo_thumbnail}
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
            <p className="text-menu" onClick={() => router.push("/user/profile")}>
              <Text>Mi perfil</Text>
            </p>
            {isAdmin && (
              <p
                className="text-menu"
                onClick={() => router.push("/dashboard")}
              >
                <Text>Cambiar a la vista de Administrador</Text>
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

  const userCardDisplayMenuOld = () => (
    <>
      <Card className="card_menu">
        <div style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
          <Row gutter={[20]}>
            <Col style={{ display: "flex" }}>
              <Avatar
                key="avatar_key"
                icon={<UserOutlined />}
                src={person.photo_thumbnail}
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

            {verifyMenuNewForTenant() && process.env.NEXT_PUBLIC_TENANT_NOT_USE_VIEW_USER ? !process.env.NEXT_PUBLIC_TENANT_NOT_USE_VIEW_USER.includes(getCurrentURL(true, true)) : true &&
              <p
                className="text-menu"
                onClick={() => router.push("/user")}

              >
                <Text>Cambiar a la vista de Usuario</Text>
              </p>}

            {/* {pathname !== "/select-company" && props?.userInfo && props?.userInfo?.nodes && props?.userInfo?.nodes?.length > 1 && (
              <p
                className="text-menu"
                onClick={() => router.push("/select-company")}
              >
                <Text>Cambiar de empresa</Text>
              </p>
            )} */}

            {pathname !== "/select-company" && (
              <p
                className="text-menu"
                onClick={() => {
                  props.setNullCompany()
                  router.push("/select-company")
                }}
              >
                <Text>Cambiar de empresa_</Text>
              </p>
            )}

            {props.config &&
              props.config.applications &&
              props.config.applications.find(
                (item) => item.app === "PAYROLL" && item.is_active
              ) && (
                <p
                  className="text-menu"
                  onClick={() => setModalCfdiVersion(true)}
                >
                  <Text>Cambiar version de CDFI</Text>
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
            //opacity: 0.9;
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
            <Col>
              <Space size={'middle'}>
                {!screens.lg && (
                  <>
                    {menuCollapsed ? (
                      <MenuUnfoldOutlined
                        style={{ cursor: 'pointer', color: '#ffff', fontSize: 20 }}
                        onClick={() => setMenuCollapsed(!menuCollapsed)} />
                    ) : (
                      <MenuFoldOutlined
                        style={{ cursor: 'pointer', color: '#ffff', fontSize: 20 }}
                        onClick={() => setMenuCollapsed(!menuCollapsed)}
                      />
                    )}
                  </>
                )}
                <Image
                  className={'header__logo'}
                  preview={false}
                  onClick={() => router.push("/user")}
                  style={{
                    maxWidth: 100,
                    margin: "auto",
                    maxHeight: 50,
                    cursor: "pointer",
                  }}
                  src={
                    "/images/LogoKhorconnect.svg"
                  }
                />
                <Image
                  className={'header__logo'}
                  preview={false}
                  // onClick={() => router.push("/home/persons")}
                  style={{
                    maxWidth: 100,
                    margin: "auto",
                    maxHeight: 50,
                    cursor: "pointer"
                  }}
                  src={
                    !hideLogo && mainLogo
                      ? mainLogo
                      : null
                  }
                />
              </Space>
            </Col>
            <Col>
              {person && (
                <div
                  className={"pointer"}
                  style={{ float: "right" }}
                  key={"menu_user_" + props.currentKey}
                >
                  <Space size={"middle"}>
                    {screens.sm && screens.md && <span style={{ color: 'white' }}>{props.currentNode ? props.currentNode.name : ""}</span>}
                    <Dropdown
                      trigger={[screens.lg ? 'hover' : 'click']}
                      overlay={<CardApps is_admin={false} />}
                      key="dropdown_apps"
                    >
                      <div key="menu_apps_content">
                        <BsFillGrid3X3GapFill
                          className={'header__dropdown_apps'}
                          style={{
                            color: "white",
                            fontSize: 30,
                            display: "flex",
                            margin: "auto",
                          }}
                        />
                      </div>
                    </Dropdown>
                    <Dropdown
                      trigger={[screens.lg ? 'hover' : 'click']}
                      overlay={verifyMenuNewForTenant() ? userCardDisplay : userCardDisplayMenuOld}
                      key="dropdown_user"
                    >
                      <div key="menu_user_content">
                        <Avatar
                          key="avatar_key"
                          icon={<UserOutlined />}
                          src={person.photo_thumbnail}
                        />
                      </div>
                    </Dropdown>
                  </Space>
                </div>
              )}
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

      {modalCfdiVersion && (
        <GenericModal
          visible={modalCfdiVersion}
          setVisible={(value) => setModalCfdiVersion(value)}
          title="Versión CFDI"
          titleActionButton="Aceptar"
          width="50%"
          actionButton={() => {
            props.setVersionCfdi(versionCfdiSelect), setModalCfdiVersion(false);
          }}
        >
          <>
            <Alert
              message={
                <span>
                  <b>Versión de CFDI:</b> Seleccione la version con la cual
                  trabajara su nómina (los catalogos fiscales varian entre
                  versiones).
                </span>
              }
              type="info"
            />
            <br />
            <Select
              style={{ width: "150px" }}
              onChange={(value) => setVersionCfdiSelect(value)}
              placeholder="Seleccione la version"
              defaultValue={
                props.versionCfdi
                  ? props.versionCfdi
                  : props.catCfdiVersion.find((item) => item.active === true)
                    .version
              }
              options={props.catCfdiVersion.map((item) => {
                return {
                  label: `Versión - ${item.version}`,
                  value: item.version,
                };
              })}
            />
          </>
        </GenericModal>
      )}
    </>
  );
};

const mapState = (state) => {
  return {
    catCfdiVersion: state.fiscalStore.cat_cfdi_version,
    versionCfdi: state.fiscalStore.version_cfdi,
    userInfo: state.userStore.user
  };
};

export default connect(mapState, { setVersionCfdi, setNullCompany })(NewHeader);
