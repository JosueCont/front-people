import React, { useEffect } from "react";
import { Layout, Space } from "antd";
import { useRouter } from "next/router";
import HeaderCustom from "../components/Header";
import Footer from "../components/Footer";

const { Content } = Layout;

const MainLayout = ({ ...props }) => {
  const router = useRouter();

  useEffect(() => {}, []);

  return (
    /* <IntlProvider locale={state.lang} messages={langMessages[state.lang]}> */
    <Layout className="layout">
      <HeaderCustom key="custom_header" currentKey={props.currentKey} />
      <Content key="content"
        className="site-layout"
        style={{ padding: "30px 50px" }}
      >
        {props.children}
      </Content>
      <Footer />
    </Layout>
    /* </IntlProvider> */
  );
};

export default MainLayout;
