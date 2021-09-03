import React, { useEffect, useLayoutEffect, useState } from "react";
import { Layout, Space } from "antd";
import { useRouter } from "next/router";
import HeaderCustom from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { userCompanyName } from "../libs/auth";
import { connect } from "react-redux";
import { companySelected } from "../redux/UserDuck";
import { css, Global } from "@emotion/core";
import { getFlavor, getRouteFlavor } from "../utils/brand";

const { Content } = Layout;

const MainLayout = ({
  hideMenu,
  hideProfile,
  logoNode = null,
  companyName = null,
  onClickImage,
  ...props
}) => {
  const router = useRouter();
  let nodeName = userCompanyName();
  const [mainLogo, setMainLogo] = useState("");
  const [company, setCompany] = useState("");
  const isBrowser = () => typeof window !== "undefined";
  const [flavor, setFlavor] = useState({})
  const [routeFlavor, setRouteFlavor] = useState({})

  useLayoutEffect(() => {
    const flavor = getFlavor();
    const routeFlavor = getRouteFlavor();

    setFlavor(flavor)
    setRouteFlavor(routeFlavor)

    var head = document.head;
    var link = document.createElement("link");
    link.type = "text/css";
    link.href = routeFlavor + '/' + flavor.stylePath;
    link.rel = "stylesheet";
    link.async = true;

    head.appendChild(link);

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
    <Layout className="layout">
       <Global
        styles={css`
          :root {
            --primaryColor: ${props.config ? props.config.concierge_primary_color : '#1890ff'};
            --secondaryColor: ${props.config ? props.config.concierge_secondary_color : '#1890ff'};
            --login_image: ${props.config && props.config.concierge_logo_login ? 'url(' + props.config.concierge_logo_login + ')' : 'url("/images/login.jpg")'}; 
            --logo_login: ${props.config && props.config.concierge_logo ? 'url(' + props.config.concierge_logo + ')' : 'url("/images/Grupo Industrial Roche-Color.png")'}; 
            --fontFamily: ${flavor && flavor.font_family ? flavor.font_family  : ' -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'}; 
            --fontStyle: ${flavor && flavor.font_family ? flavor.font_style  : 'normal'}; 
            --srcFontFamily: ${flavor&& flavor.font_family ? 'url("' + routeFlavor + '/fonts/' + flavor.font_family + '")' : 'url("/flavors/demo/fonts/HelveticaRoundedLTStd-Bd.ttf")'}; 
            --fontFormColor: ${flavor&& flavor.fontFormColor ? flavor.font_family : '#000'};
            --fontSpanColor: ${flavor&& flavor.fontSpanColor ? flavor.fontSpanColor : '#000'};
              `}
      />
      <Helmet>
      {props.config && props.config.concierge_icon ? (
          <link rel="icon" type="image/png" href={props.config.concierge_icon}></link>
        ) :
          <link rel="icon" type="image/png" href="/images/logo_gape.svg"></link>
        }
      </Helmet>
      <HeaderCustom
        key="main_header"
        currentKey={props.currentKey}
        hideMenu={hideMenu}
        mainLogo={mainLogo}
        hideProfile={hideProfile}
        onClickImage={onClickImage}
      />
      <div style={{ marginLeft: "50px" }}>
        <h1> {company != undefined && company}</h1>
      </div>
      <Content className="site-layout">
        <div
          style={{
            marginTop: "-30px",
            minHeight: "calc(100vh - 134px)",
            padding: "30px 50px",
          }}
        >
          {props.children}
        </div>
      </Content>
      <Footer />
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
