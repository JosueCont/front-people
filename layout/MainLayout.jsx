import React, { useEffect } from "react";
import { Layout, Space } from "antd";
import { useRouter } from "next/router";
import HeaderCustom from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const { Content } = Layout;

const MainLayout = ({ ...props }) => {
  const router = useRouter();

  useEffect(() => {}, []);

  return (
    /* <IntlProvider locale={state.lang} messages={langMessages[state.lang]}> */
    <Layout className="layout">
      <Helmet>
        <link
          rel="icon"
          type="image/png"
          href="/images/user/logo_gape.svg"
        ></link>
      </Helmet>
      <HeaderCustom key="main_header" currentKey={props.currentKey} />
      <Content className="site-layout">
        <div style={{ minHeight: "calc(100vh - 134px)", padding: "30px 50px" }}>
          {props.children}
        </div>
      </Content>
      <Footer />
    </Layout>
    /* </IntlProvider> */
  );
};

export default MainLayout;
