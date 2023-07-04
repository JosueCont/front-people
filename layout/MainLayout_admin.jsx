import React, { useEffect, useLayoutEffect, useState } from "react";
import { Layout, Row, Col, Drawer, Typography, Divider, Modal, Button, Input, Form, message } from "antd";
import { DollarCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { companySelected } from "../redux/UserDuck";
import { css, Global } from "@emotion/core";
import { getFlavor, getRouteFlavor } from "../utils/brand";
import NewHeader from "../components/NewHeader";
import Head from "next/head";
import MainSiderAdmin from "../components/MainSiderAdmin";
import WebApiPeople from '../api/WebApiPeople';
import { ruleWhiteSpace, ruleRequired, ruleMinPassword, validateSpaces } from "../utils/rules";
import { logoutAuth } from "../libs/auth";

const { Content } = Layout;

const MainLayoutAdmin = ({
  currentKey,
  hideMenu,
  hideProfile,
  logoNode = null,
  companyName = null,
  onClickImage = true,
  hideSearch,
  hideLogo = false,
  nómina = false,
  pageTitle = "KHOR Plus",
  autoregister = false,
  logoAlign = 'left',
  showFooter = false,
  secondaryLogo,
  contentFooter = <></>,
  ...props
}) => {
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [mainLogo, setMainLogo] = useState("");
  const isBrowser = () => typeof window !== "undefined";
  const [flavor, setFlavor] = useState({});
  const [showEvents, setShowEvents] = useState(false);
  const [isOpenModalChangePassword, setIsOpenModalChangePassword] = useState(false);
  const [khonnectId, setKhonnectId] = useState("");
  const [disabledButtonSend, setDisabledButtonSend] = useState(false);

  useEffect(() => {
    try {
      // const vflavor = getFlavor();
      // const routeFlavor = getRouteFlavor();
      // setFlavor(vflavor);
      // var head = document.head;
      // var link = document.createElement("link");
      // link.type = "text/css";
      // if (vflavor.stylePath) link.href = routeFlavor + "/" + vflavor.stylePath;
      // link.rel = "stylesheet";
      // link.async = true;
      // console.log(
      //   "🚀 ~ file: MainLayout_admin.jsx:47 ~ useEffect ~ link",
      //   link
      // );
      // head.appendChild(link);
    } catch (error) { }
  }, []);

  // useEffect(() => {
  //   if (isBrowser()) {
  //     setMainLogo(window.sessionStorage.getItem("image"));
  //   }
  // }, []);

  useEffect(() => {
    if(secondaryLogo){
      setMainLogo(secondaryLogo)
      return;
    }
    if (logoNode && logoNode != "") {
      setMainLogo(logoNode);
      return;
    }
    if (props.currentNode & !secondaryLogo) {
      setMainLogo(props.currentNode.image);
      return;
    }
  }, [logoNode, companyName, props.currentNode, secondaryLogo]);

  useEffect(() => {
    if (props.currentNode && props.config && props.userData) {
      // setMainLogo(props.currentNode.image);
      validateShowModal(props.config.request_first_change_password, props.userData.status_first_change_password)
      setKhonnectId(props.userData.khonnect_id)
    } else {
      if (props.config && !autoregister) props.companySelected(null, props.config, true);
    }
  }, [props.currentNode, props.config, props.userData]);

  const validateShowModal = (showModal, changePassword) => {
    let localStateChangedPassword = window.sessionStorage.getItem("requestChangePassword")
    if (showModal) {
      if (!changePassword) {
        if (localStateChangedPassword == null) {
          setIsOpenModalChangePassword(true)
        }
      } else {
        setIsOpenModalChangePassword(false)
      }
    } else {
      setIsOpenModalChangePassword(false)
    }
  }

  const closeEvents = () => {
    setShowEvents(false);
  };

  const onFinishChangePassword = (data) => {
    setDisabledButtonSend(true)
    let dataToApi = {
      khonnect_id: khonnectId,
      password: data.passwordTwo,
    }
    data.passwordTwo === data.passwordOne ? changePasswordUser(dataToApi) : message.info("Confirme bien sus contraseñas")
  }

  const changePasswordUser = async (data) => {
    try {
      let response = await WebApiPeople.validateChangePassword(data);
      if (response.status == 200) {
        setTimeout(() => {
          if (isBrowser()) {
            window.sessionStorage.setItem("requestChangePassword", "changed")
          }
          setDisabledButtonSend(false)
          message.success("Cambio de contraseña exitoso");
          setIsOpenModalChangePassword(false)
        }, 3000);
      }
    } catch (e) {
      message.error("Ocurrio un error intenta nuevamente");
      form.resetFields()
      setDisabledButtonSend(false)
      console.log(e)
    }
  }

  const validatePassword = ({ getFieldValue }) => ({
    validator(rule, value) {
      if (!value || getFieldValue("passwordOne") === value) {
        return Promise.resolve();
      }
      return Promise.reject("Las contraseñas no coinciden");
    },
  });

  return (
    <>
      <Modal title="Cambio de contraseña" visible={isOpenModalChangePassword} closable={false} footer={false}>
        <div>
          <Form
            form={form}
            onFinish={onFinishChangePassword}
            layout={"vertical"}
            requiredMark={false}
          >
            <Row justify="center">
              <p style={{ textAlign: "justify" }}><b>Por seguridad, es necesario que cambies tu contraseña por primera vez.</b></p>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="passwordOne"
                  label="Contraseña nueva"
                  rules={[ruleRequired, ruleWhiteSpace, validateSpaces, ruleMinPassword(6)]}
                >
                  <Input.Password type="password" style={{ minWidth: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="passwordTwo"
                  label="Confirmar contraseña"
                  rules={[ruleRequired, ruleWhiteSpace, validatePassword, validateSpaces, ruleMinPassword(6)]}
                >
                  <Input.Password type="password" style={{ minWidth: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Button loading={disabledButtonSend} type="primary" htmlType="submit">Cambiar contraseña</Button>
            </Row>
          </Form>
        </div>
      </Modal>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Layout className="layout" style={{ minHeight: "100vh" }}>
        <Global
          styles={css`
            :root {
              --primaryColor: ${props.config && props.config.theme_color
              ? props.config.theme_color.primary_color
              : "#252837"};
              --primaryAlternativeColor: ${props.config &&
              props.config.theme_color
              ? props.config.theme_color.primary_alternative_color
              : "#252837"};

              --secondaryColor: ${props.config && props.config.theme_color
              ? props.config.theme_color.secondary_color
              : "#1C1B2B"};
              --secondaryAlternativeColor: ${props.config &&
              props.config.theme_color
              ? props.config.theme_color.secondary_alternative_color
              : "#1C1B2B"};

              --fontPrimaryColor: ${props.config ? "#ffff" : "#ffff"};

              --fontSecondaryColor: ${props.config ? "#ffff" : "#ffff"};

              --login_image: ${props.config && props.config.concierge_logo_login
              ? "url(" + props.config.concierge_logo_login + ")"
              : 'url("/images/login.jpg")'};
              --logo_login: ${props.config && props.config.concierge_logo
              ? "url(" + props.config.concierge_logo + ")"
              : 'url("/images/Grupo Industrial Roche-Color.png")'};
              --fontFamily: ${flavor && flavor.font_family
              ? flavor.font_family
              : " -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"};
              --fontStyle: ${flavor && flavor.font_family
              ? flavor.font_style
              : "normal"};
              --srcFontFamily: ${flavor && flavor.font_family
              ? flavor.font_family
              : 'url("/flavors/demo/fonts/HelveticaRoundedLTStd-Bd.ttf")'};
              --fontFormColor: ${flavor && flavor.fontFormColor
              ? flavor.font_family
              : "#000"};
              --fontSpanColor: ${props.config &&
              props.config.concierge_font_primary_color
              ? props.config.concierge_font_primary_color
              : "#000"};

              --fontColorSecondary: ${props.config &&
              props.config.concierge_font_secondary_color
              ? props.config.concierge_font_secondary_color
              : "#000"};
            }

            .ant-layout-content {
              // background: var(--primaryColor) !important;
              background: #e3e3e3 !important;
            }

            /* .ant-layout-content{
              background: #2E303C;
            } */
            /* .ant-form-item-label label{
              color: #ffffff99;
            } */
            /* .ant-table-small .ant-table-thead > tr > th{
              background: var(--primaryColor);
              color: #ffffff99;
            } */

            .ant-breadcrumb span {
              // color: var(--fontSpanColor);
              // color: #000;
            }
            /*
          .ant-menu-item,
          .ant-menu-submenu {
            color: var(--fontSpanColor);
          }
          label {
            color: var(--fontSpanColor);
          }
          
           */
            .divider-primary {
              border-bottom: solid 1px var(--primaryColor);
              opacity: 0.5;
            }
            /* .ant-form-item  label {
              color: var(--fontColorSecondary) !important;
            }

            button, button {
              color: var(--fontColorSecondary) !important;
            } */

            /* .ant-table, table.ant-table td, table th,
            table.ant-table td.ant-table-cell-fix-left{
              background: transparent !important;
            }
            table.ant-table tr:hover td{
              background: transparent;
            }

            && tbody > tr:hover > td {
              background: var(--secondaryColor) !important;
              color: var(--fontColorSecondary) !important;
            }
            && tbody > tr:hover > td {
              background: var(--secondaryColor) !important;
            } */

            /* .ant-table-body > tr.ant-table-row:hover > td,
            .ant-table-body > tr.ant-table-row > td:hover{
              background-color: red !important;
            } */
            /* th, td{
              background: transparent;
            } */
            .form_header {
              background: white !important;
            }

            .headers_transparent .ant-table-thead tr th {
              background-color: transparent !important;
            }
            .card_table .ant-table {
              box-shadow: none;
            }

            .tableAssesmentsSelected {
              border: solid 1px #8e88e7;
            }
          `}
        />
        <Helmet>
          {props.config && props.config.concierge_icon ? (
            <link
              rel="icon"
              type="image/png"
              href={props.config.concierge_icon}
            ></link>
          ) : (
            <link
              rel="icon"
              type="image/png"
              href="/images/logo_gape.svg"
            ></link>
          )}
        </Helmet>

        <Layout>
          <NewHeader
            key="main_header"
            currentNode={props.currentNode}
            hideMenu={hideMenu}
            mainLogo={mainLogo}
            hideProfile={hideProfile}
            onClickImage={onClickImage}
            hideSearch={hideSearch}
            hideLogo={hideLogo}
            setShowEvents={setShowEvents}
            config={props.config}
            logoAlign={logoAlign}
          />
          <Layout>
            {!hideMenu && props.currentNode && (
              <MainSiderAdmin
                currentKey={currentKey}
                defaultOpenKeys={
                  props.defaultOpenKeys ? props.defaultOpenKeys : null
                }
              />
            )}
            <Content className={'main_container'}>
              <div className="div-main-layout">{props.children}</div>
            </Content>
          </Layout>
          {showFooter && (
            <Layout.Footer>
              {contentFooter}
            </Layout.Footer>
          )}
        </Layout>
        {props.currentNode && (
          <Drawer placement="right" onClose={closeEvents} visible={showEvents}>
            <Row justify="center">
              <Col span={21}>
                <Title level={3} style={{ marginBottom: 0, marginTop: 20 }}>
                  <span className="card_element_icon">
                    <DollarCircleOutlined />
                  </span>
                  Proximos eventos
                </Title>
                <Divider style={{ margin: "10px 0px 15px 0px" }} />
              </Col>
            </Row>
          </Drawer>
        )}
      </Layout>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    config: state.userStore.general_config,
    versionCfdi: state.fiscalStore.version_cfdi,
    userData: state.userStore.user,
  };
};

export default connect(mapState, { companySelected })(MainLayoutAdmin);
