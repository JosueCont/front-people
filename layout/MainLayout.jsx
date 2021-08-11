import React, { useEffect, useState } from "react";
import { Layout, Space } from "antd";
import { useRouter } from "next/router";
import HeaderCustom from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { userCompanyName } from "../libs/auth";
import { connect } from "react-redux";
import { companySelected } from "../redux/UserDuck";

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
      <Helmet>
        <link rel="icon" type="image/png" href="/images/logo_gape.svg"></link>
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
  };
};

export default connect(mapState, { companySelected })(MainLayout);
