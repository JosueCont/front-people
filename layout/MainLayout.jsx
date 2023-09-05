import React, { useEffect, useLayoutEffect, useState } from "react";
import { Layout, Row, Col, Drawer, Typography, Divider } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { companySelected } from "../redux/UserDuck";
import { css, Global } from "@emotion/core";
import { getFlavor, getRouteFlavor } from "../utils/brand";
import NewHeader from "../components/newHeaderUser";
import MainSider from "../components/MainSider";
import MainSiderAdmin from "../components/MainSiderAdmin";
import WebApiPeople from "../api/WebApiPeople";
import Cookie from "js-cookie";



import Head from "next/head";
import ModalGenericNotification from "../components/modal/ModalGenericNotification";

const { Content } = Layout;

const MainLayout = ({
  currentKey,
  hideMenu,
  hideProfile,
  logoNode = null,
  companyName = null,
  onClickImage,
  hideSearch,
  hideLogo = false,
  nómina = false,
  pageTitle = "KHOR Plus",
  autoregister = false,
  ...props
}) => {
  const { Title } = Typography;
  const [mainLogo, setMainLogo] = useState("");
  const isBrowser = () => typeof window !== "undefined";
  const [flavor, setFlavor] = useState({});
  const [showEvents, setShowEvents] = useState(false);
  const[isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    try {
      const vflavor = getFlavor();
      const routeFlavor = getRouteFlavor();
      setFlavor(vflavor);

      var head = document.head;
      var link = document.createElement("link");
      link.type = "text/css";
      if (vflavor.stylePath) link.href = routeFlavor + "/" + vflavor.stylePath;
      link.rel = "stylesheet";
      link.async = true;
      head.appendChild(link);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (isBrowser()) {
      setMainLogo(window.sessionStorage.getItem("image"));
    }
  }, []);

  useEffect(() => {
    if (logoNode && logoNode != "") {
      setMainLogo(logoNode);
    } else if (props.currentNode) {
      setMainLogo(props.currentNode.image);
    }
  }, [logoNode, companyName]);

  useEffect(() => {
    if (props.currentNode && props.config) {
      setMainLogo(props.currentNode.image);
    } else {
      let data = localStorage.getItem("data")
      if (props.config && !autoregister) props.companySelected(null, props.config, data ? false : true);    
    }
  }, [props.currentNode, props.config]);

  const closeEvents = () => {
    setShowEvents(false);
  };

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
          setIsAdmin(response.data.is_admin);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }; 

  return (<>
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
            background: #E3E3E3 !important;
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
      <ModalGenericNotification/>
      <Helmet>
        {props.config && props.config.concierge_icon ? (
          <link
            rel="icon"
            type="image/png"
            href={props.config.concierge_icon}
          ></link>
        ) : (
          <link rel="icon" type="image/png" href="/images/logo_gape.svg"></link>
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
        />

          <Layout>
            {!hideMenu && props.currentNode && (
              <MainSider
                currentKey={currentKey}
                defaultOpenKeys={
                  props.defaultOpenKeys ? props.defaultOpenKeys : null
                }
              />
            )}
            <Content>
              <div className="div-main-layout">{props.children}</div>
            </Content>
          </Layout>
        
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
  };
};

export default connect(mapState, { companySelected })(MainLayout);
