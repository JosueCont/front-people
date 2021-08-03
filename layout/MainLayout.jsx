import React, { useEffect,useState } from "react";
import { Layout, Space } from "antd";
import { useRouter } from "next/router";
import HeaderCustom from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { userCompanyName } from "../libs/auth";
import Title from "antd/lib/skeleton/Title";

const { Content } = Layout;

const MainLayout = ({ hideMenu, ...props }) => {
  const router = useRouter();
  let company = userCompanyName();
  const [mainLogo, setMainLogo] = useState('');
  const isBrowser = () => typeof window !== "undefined"


  useEffect(() => {
    if (company == "" || company == undefined) {
      company = userCompanyName();
    }
  }, []);

  useEffect(()=>{
    if (isBrowser()){
      setMainLogo(window.sessionStorage.getItem('image'));
    }
    /* setMainLogo(window.sessionStorage.getItem('image')); */
  },[])

  return (
    /* <IntlProvider locale={state.lang} messages={langMessages[state.lang]}> */
    <Layout className="layout">
      <Helmet>
        <link rel="icon" type="image/png" href="/images/logo_gape.svg"></link>
      </Helmet>
      <HeaderCustom
        key="main_header"
        currentKey={props.currentKey}
        hideMenu={hideMenu}
        mainLogo={mainLogo}
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
    /* </IntlProvider> */
  );
};

export default MainLayout;
