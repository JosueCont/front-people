import React, { useEffect, useState } from "react";
import { Layout, Space } from "antd";
import { useRouter } from "next/router";
import HeaderCustom from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { userCompanyName } from "../libs/auth";
import { connect } from "react-redux";
import { companySelected } from "../redux/UserDuck";
import { css, Global } from "@emotion/core";

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
