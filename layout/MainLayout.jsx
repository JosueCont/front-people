import React, { useEffect, useState } from "react";
import { Layout, Space } from "antd";
import { useRouter } from "next/router";
import HeaderCustom from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { userCompanyName } from "../libs/auth";

const { Content } = Layout;

const MainLayout = ({
  hideMenu,
  hideProfile,
  logoNode = null,
  companyName = null,
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
    }
    if (companyName && companyName != "") {
      setCompany(companyName);
    }
  }, [logoNode, companyName]);

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

export default MainLayout;
