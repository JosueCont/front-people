import React, { useEffect, useLayoutEffect, useState } from "react";
import { Layout, Row, Col, Avatar, Menu, Space } from "antd";
import { useRouter } from "next/router";
import HeaderCustom from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { userCompanyName } from "../libs/auth";
import { connect } from "react-redux";
import { companySelected } from "../redux/UserDuck";
import { css, Global } from "@emotion/core";
import { getFlavor, getRouteFlavor } from "../utils/brand";
import NewHeader from "../components/NewHeader";
import MainSider from "../components/MainSider";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

const MainLayout = ({
  currentKey,
  hideMenu,
  hideProfile,
  logoNode = null,
  companyName = null,
  onClickImage,
  hideSearch,
  hideLogo = false,
  ...props
}) => {
  const router = useRouter();
  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

  let nodeName = userCompanyName();
  const [mainLogo, setMainLogo] = useState("");
  const [company, setCompany] = useState("");
  const isBrowser = () => typeof window !== "undefined";
  const [flavor, setFlavor] = useState({});
  const [routeFlavor, setRouteFlavor] = useState({});

  /* Variable del side menu */
  const [collapsed, setCollapsed] = useState(false);
  const { SubMenu } = Menu;
  const onCollapse = (collapsed) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  useLayoutEffect(() => {
    try {
      const vflavor = getFlavor();
      const routeFlavor = getRouteFlavor();

      setFlavor(vflavor);
      setRouteFlavor(routeFlavor);

      var head = document.head;
      var link = document.createElement("link");
      link.type = "text/css";
      link.href = routeFlavor + "/" + vflavor.stylePath;
      link.rel = "stylesheet";
      link.async = true;

      head.appendChild(link);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (company == "" || company == undefined) {
      setCompany(nodeName);
    }
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
    if (props.currentNode) {
      setMainLogo(props.currentNode.image);
    } else {
      let response = props.companySelected();
    }
  }, [props.currentNode]);

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Global
        styles={css`
          :root {
            --primaryColor: ${
              props.config ? props.config.concierge_primary_color : "#252837"
            };

            --secondaryColor: ${
              props.config ? props.config.concierge_secondary_color : "#1C1B2B"
            };

            --fontPrimaryColor: ${
              props.config ? props.config.concierge_font_primary_color : "#ffff"
            };

            --fontSecondaryColor: ${
              props.config
                ? props.config.concierge_font_secondary_color
                : "#ffff"
            };

            --login_image: ${
              props.config && props.config.concierge_logo_login
                ? "url(" + props.config.concierge_logo_login + ")"
                : 'url("/images/login.jpg")'
            }; 
            --logo_login: ${
              props.config && props.config.concierge_logo
                ? "url(" + props.config.concierge_logo + ")"
                : 'url("/images/Grupo Industrial Roche-Color.png")'
            }; 
            --fontFamily: ${
              flavor && flavor.font_family
                ? flavor.font_family
                : " -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
            }; 
            --fontStyle: ${
              flavor && flavor.font_family ? flavor.font_style : "normal"
            }; 
            --srcFontFamily: ${
              flavor && flavor.font_family
                ? flavor.font_family
                : 'url("/flavors/demo/fonts/HelveticaRoundedLTStd-Bd.ttf")'
            }; 
            --fontFormColor: ${
              flavor && flavor.fontFormColor ? flavor.font_family : "#000"
            };
            --fontSpanColor: ${
              flavor && flavor.fontSpanColor ? flavor.fontSpanColor : "#000"
            };
            .ant-layout-content{
                // background: var(--primaryColor) !important;
                backGround: #F0F0F0 !important
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

            .ant-breadcrumb span{
              // color: var(--fontSpanColor);
              color: #000
            }
            .ant-menu-item, .ant-menu-submenu{
              color: var(--fontSpanColor);
            }
            label{
              color: var(--fontSpanColor);
            }
            .divider-primary{
              border-bottom: solid 1px var(--primaryColor);
              opacity: 0.5;
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
          <link rel="icon" type="image/png" href="/images/logo_gape.svg"></link>
        )}
      </Helmet>
      <Layout>
        <NewHeader
          key="main_header"
          hideMenu={hideMenu}
          mainLogo={mainLogo}
          hideProfile={hideProfile}
          onClickImage={onClickImage}
          hideSearch={hideSearch}
          hideLogo={hideLogo}
        />
        <Layout>
          {!hideMenu && <MainSider currentKey={currentKey} />}
          <Content>
            <div className="div-main-layout">{props.children}</div>
          </Content>
          {/*  */}
          {/*  */}
        </Layout>
      </Layout>

      {/* <HeaderCustom
        key="main_header"
        currentKey={props.currentKey}
        hideMenu={hideMenu}
        mainLogo={mainLogo}
        hideProfile={hideProfile}
        onClickImage={onClickImage}
      /> */}

      {/* <div style={{ marginLeft: "50px" }}>
        <h1> {company != undefined && company}</h1>
      </div> */}
      {/* <Footer /> */}
    </Layout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    config: state.userStore.general_config,
  };
};

export default connect(mapState, { companySelected })(MainLayout);
