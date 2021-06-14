import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Modal,
  Alert,
  Image,
  Button,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import CardUser from "./CardUser";
import CardApps from "./CardApps";
import { Router } from "next/router";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import Axios from "axios";
import { API_URL } from "../config/config";
import { logoutAuth } from "../libs/auth";
import { route } from "next/dist/next-server/server/router";

const { Header } = Layout;

const { SubMenu } = Menu;

const headerCustom = ({ hideMenu, ...props }) => {
  const router = useRouter();
  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";
  const [person, setPerson] = useState({});
  const [logOut, setLogOut] = useState(false);

  useEffect(() => {
    const user = JSON.parse(Cookie.get("token"));
    Axios.post(API_URL + `/person/person/person_for_khonnectid/`, {
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
      })
      .catch((e) => {
        setPerson({ photo: defaulPhoto });
        console.log(e);
      });
  }, []);

  const actionEvent = (data) => {
    setModalLogOut(data);
  };

  const userCardDisplay = () => (
    <>
      <CardUser person={person} visible={logOut} acction={actionEvent} />
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
      <Header>
        <div
          onClick={() => router.push({ pathname: "/home" })}
          className="logo"
          key="content_logo"
          style={{
            float: "left",
            height: "100%",
            display: "flex",
            marginLeft: "-2%",
            marginRight: "2%",
          }}
        >
          <img
            style={{ float: "left", height: 60, margin: "auto" }}
            src={
              "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/12220210623/staff_1-1.png"
            }
            alt=""
          />
        </div>
        {/* <img className="logo" src="/public/images/logo.png" alt=""/> */}

        <Menu
          key="main_menu"
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[props.currentKey]}
        >
          {/* <Menu.Item>
            <div style={{ float: "left" }} key={'app_'+props.currentKey}>
                <Dropdown overlay={appsCardDisplay} key="drop_icon">
                    <div key="app_icon_content">
                        <AppstoreOutlined key="icon_app" style={{ fontSize: "26px", color: "#08c" }} />
                    </div>
                </Dropdown>
            </div>
        </Menu.Item> */}
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
                  onClick={() => router.push({ pathname: "/config/business" })}
                >
                  Catálogos
                </Menu.Item>
                <Menu.Item
                  key="3.2"
                  onClick={() => router.push({ pathname: "/config/groups" })}
                >
                  Perfiles de seguridad
                </Menu.Item>
                  <Menu.Item
                      key="3.3"
                      onClick={() => router.push({ pathname: "/config/personalization" })}
                  >
                      Personalización
                  </Menu.Item>
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
                  onClick={() => router.push({ pathname: "/bank_accounts" })}
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
                  onClick={() => router.push({ pathname: "/payrollvoucher" })}
                >
                  Recibos de nómina
                </Menu.Item>
              </SubMenu>
              <Menu.Item
                key="10"
                onClick={() => router.push({ pathname: "/assignedCompanies" })}
              >
                Asignar empresa
              </Menu.Item>
            </>
          ) : null}
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
        </Menu>
      </Header>
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
    </>
  );
};

export default headerCustom;
