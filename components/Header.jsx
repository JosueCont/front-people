import { Layout, Menu, Avatar, Dropdown, Modal, Button, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import CardUser from "./CardUser";
import CardApps from "./CardApps";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { getAccessIntranet, logoutAuth } from "../libs/auth";
import { FormattedMessage } from "react-intl";
import { css, Global } from "@emotion/core";
import { connect } from "react-redux";
import WebApi from "../api/webApi";
import { companySelected } from "../redux/UserDuck";
import { config } from "react-spring";

const { Header } = Layout;

const { SubMenu } = Menu;

const headerCustom = ({
  hideMenu,
  hideProfile = true,
  onClickImage = true,
  ...props
}) => {
  const router = useRouter();
  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";
  const [person, setPerson] = useState({});
  const [logOut, setLogOut] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(null);
  const [secondaryColor, setSecondaryColor] = useState(null);
  let accessIntranet = getAccessIntranet();

  useEffect(() => {
    getPerson();
  }, []);

  const getPerson = async () => {
    try {
      const user = JSON.parse(Cookie.get("token"));
      let response = await WebApi.personForKhonnectId({ id: user.user_id });
      if (!response.data.photo) response.data.photo = defaulPhoto;
      let personName =
        response.data.first_name + " " + response.data.flast_name;
      if (response.data.mlast_name)
        personName = personName + " " + response.data.mlast_name;
      response.data.fullName = personName;
      setPerson(response.data);
    } catch (error) {
      setPerson({ photo: defaulPhoto });
    }
  };

  useEffect(() => {
    if (props.config) {
      setPrimaryColor(props.config.concierge_primary_color);
      setSecondaryColor(props.config.concierge_primary_color);
    }
  }, []);

  const actionEvent = (data) => {
    setModalLogOut(data);
  };

  const userCardDisplay = () => (
    <>
      <CardUser
        person={person}
        visible={logOut}
        currentNode={props.currentNode}
        acction={actionEvent}
      />
    </>
  );

  const appsCardDisplay = () => (
    <>
      <CardApps />
    </>
  );

  const setModalLogOut = (status) => {
    logOut ? setLogOut(status) : setLogOut(status);
  };

  return (
    <>
      <Global
        styles={css`
          header.ant-layout-header {
            background-color: ${primaryColor} !important;
            color: black !important;
          }

          .menu-custom {
            background-color: ${primaryColor} !important;
            color: black !important;
          }

          .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover {
            background-color: ${secondaryColor};
            color: white !important;
          }

          .ant-menu-item-selected {
            background-color: ${primaryColor} !important;
            color: white !important;
          }

          .ant-menu-dark .ant-menu-item,
          .ant-menu-dark .ant-menu-item-group-title,
          .ant-menu-dark .ant-menu-item > a,
          .ant-menu-dark .ant-menu-item > span > a {
            color: white !important;
          }

          .ant-menu.ant-menu-dark,
          .ant-menu-dark .ant-menu-sub,
          .ant-menu.ant-menu-dark .ant-menu-sub:hover {
            color: white !important;
            //background-color: ${primaryColor};
          }

          .ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal)
            .ant-menu-item-selected,
          .ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal)
            .ant-menu-item:hover,
          .ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal)
            .ant-menu-submenu-title:hover {
            background-color: ${secondaryColor};
          }

          .ant-menu-dark .ant-menu-inline.ant-menu-sub {
            background-color: ${secondaryColor} !important;
            margin-left: 24px;
            width: calc(100% - 24px) !important;
          }

          .ant-menu.ant-menu-dark .ant-menu-item-selected,
          .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
            color: white !important;
            background-color: ${secondaryColor} !important;
          }

          .ant-menu.ant-menu-dark,
          .ant-menu-dark .ant-menu-sub,
          .ant-menu.ant-menu-dark .ant-menu-sub:hover {
            background-color: ${primaryColor} !important;
          }
        `}
      />
      <Header>
        <Row>
          <Col
            xl={1}
            lg={1}
            md={1}
            sm={2}
            xs={2}
            style={{ paddingRight: "48px" }}
          >
            <div
              onClick={() =>
                onClickImage &&
                person.nodes &&
                props.currentNode &&
                router.push({ pathname: "/home" })
              }
              className="logo"
              key="content_logo"
              style={{
                float: "left",
                height: "100%",
                display: "flex",
                marginLeft: "-2%",
              }}
            >
              <img
                style={{ float: "left", width: 50, margin: "auto" }}
                src={props.mainLogo}
                alt=""
              />
            </div>
          </Col>
          <Col xl={20} lg={20} md={19} sm={17} xs={17}>
            <Menu
              key="main_menu"
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[props.currentKey]}
              className="menu-custom"
            >
              {!hideMenu ? (
                <>
                  <Menu.Item
                    key="1"
                    onClick={() => router.push({ pathname: "/home" })}
                  >
                    Personas
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    onClick={() => router.push({ pathname: "/business" })}
                  >
                    Empresas
                  </Menu.Item>
                  <SubMenu key="3" title="Configuración">
                    <Menu.Item
                      key="3.1"
                      onClick={() =>
                        router.push({ pathname: "/config/business" })
                      }
                    >
                      Catálogos
                    </Menu.Item>
                    <Menu.Item
                      key="3.2"
                      onClick={() =>
                        router.push({ pathname: "/config/groups" })
                      }
                    >
                      Perfiles de seguridad
                    </Menu.Item>
                    {/* <Menu.Item
                  key="3.3"
                  onClick={() =>
                    router.push({ pathname: "/config/personalization" })
                  }
                >
                  Personalización
                </Menu.Item> */}
                  </SubMenu>

                  <SubMenu key="4" title="Comunicación">
                    <Menu.Item
                      key="4.1"
                      onClick={() =>
                        router.push({ pathname: "/comunication/releases" })
                      }
                    >
                      Comunicados
                    </Menu.Item>
                    <Menu.Item
                      key="4.2"
                      onClick={() =>
                        router.push({ pathname: "/comunication/events" })
                      }
                    >
                      Eventos
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item
                    key="8"
                    onClick={() => router.push({ pathname: "/reports" })}
                  >
                    Reportes
                  </Menu.Item>
                  <SubMenu key="7" title="Solicitudes">
                    <Menu.Item
                      key="7.1"
                      onClick={() => router.push({ pathname: "/lending" })}
                    >
                      Préstamos
                    </Menu.Item>
                    <Menu.Item
                      key="7.2"
                      onClick={() => router.push({ pathname: "/holidays" })}
                    >
                      Vacaciones
                    </Menu.Item>
                    <Menu.Item
                      key="7.3"
                      onClick={() => router.push({ pathname: "/permission" })}
                    >
                      Permisos
                    </Menu.Item>
                    <Menu.Item
                      key="7.4"
                      onClick={() => router.push({ pathname: "/incapacity" })}
                    >
                      Incapacidad
                    </Menu.Item>
                    <Menu.Item
                      key="7.5"
                      onClick={() =>
                        router.push({ pathname: "/bank_accounts" })
                      }
                    >
                      Cuentas bancarias
                    </Menu.Item>
                  </SubMenu>
                  <SubMenu key="9" title="Nómina">
                    <Menu.Item
                      key="9.1"
                      onClick={() =>
                        router.push({
                          pathname: "/payrollvoucher/statisticsPayroll",
                        })
                      }
                    >
                      Nómina empresarial
                    </Menu.Item>
                    <Menu.Item
                      key="9.2"
                      onClick={() =>
                        router.push({ pathname: "/payrollvoucher" })
                      }
                    >
                      Recibos de nómina
                    </Menu.Item>
                  </SubMenu>

                  <Menu.Item
                    key="10"
                    onClick={() =>
                      router.push({ pathname: "/assignedCompanies" })
                    }
                  >
                    Asignar empresa
                  </Menu.Item>

                  {config && config.intranet_enabled && (
                    <SubMenu
                      key="11"
                      title={<FormattedMessage id="header.intranet" />}
                    >
                      <Menu.Item
                        key="11.1"
                        onClick={() =>
                          router.push({ pathname: "/intranet/groups" })
                        }
                      >
                        <FormattedMessage id="header.groups" />
                      </Menu.Item>
                      <Menu.Item
                        key="11.2"
                        onClick={() =>
                          router.push({ pathname: "/intranet/config" })
                        }
                      >
                        <FormattedMessage id="header.config" />
                      </Menu.Item>
                    </SubMenu>
                  )}
                {   
                // props.config.kuiz_enabled &&
                  <Menu.Item
                    key="12"
                    onClick={() => router.push({ pathname: "/assessment" })}
                  >
                    Encuestas
                  </Menu.Item>
                  // <SubMenu
                  //     key="12"
                  //     title="Encuestas"
                  //   >
                  //     <Menu.Item
                  //       key="12.1"
                  //       onClick={() =>
                  //         router.push({ pathname: "/assessment" })
                  //       }
                  //     >
                  //       Encuestas
                  //     </Menu.Item>
                  // </SubMenu>
                }
                </>
              ) : null}
            </Menu>
          </Col>
          {hideProfile && (
            <Col xl={3} lg={2} md={2} sm={1} xs={1}>
              <div
                className={"pointer"}
                style={{ float: "right" }}
                key={"menu_user_" + props.currentKey}
              >
                <Dropdown overlay={userCardDisplay} key="dropdown_user">
                  <div key="menu_user_content">
                    <Avatar
                      key="avatar_key"
                      icon={<UserOutlined />}
                      src={person.photo}
                    />
                  </div>
                </Dropdown>
              </div>
            </Col>
          )}
        </Row>
      </Header>
      {logOut && (
        <Modal
          title="Cerrar sesión"
          centered
          visible={logOut}
          onOk={() => logoutAuth()}
          onCancel={() => setModalLogOut(false)}
          footer={[
            <Button
              key="back"
              onClick={() => setModalLogOut(false)}
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
      )}
    </>
  );
};

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState, { companySelected })(headerCustom);
