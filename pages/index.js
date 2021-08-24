import Head from "next/head";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { connect } from "react-redux";
import LoginForm from "../components/LoginForm";
import PasswordRecover from "../components/PasswordRecover";
import { Row, Col, Card, Spin } from "antd";
import { Helmet } from "react-helmet";
import { css, Global } from "@emotion/core";
import { getRouteFlavor, getFlavor } from "../utils/brand";
/* import {logoRoche} from '../public/images/Grupo Industrial Roche-Color.png' */

const Home = ({ ...props }) => {
  const [recoverPasswordShow, setRecoverPasswordShow] = useState(false);
  const [flavor, setFlavor] = useState({});
  const [routeFlavor, setRouteFlavor] = useState({});
  const [configsTenant, setConfigsTenant] = useState({});
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const flavor = getFlavor();
    const routeFlavor = getRouteFlavor();

    setFlavor(flavor);
    setRouteFlavor(routeFlavor);

    var head = document.head;
    var link = document.createElement("link");
    link.type = "text/css";
    link.href = routeFlavor + "/" + flavor.stylePath;
    link.rel = "stylesheet";
    link.async = true;

    head.appendChild(link);
  }, []);

  useLayoutEffect(() => {
    if (props.config) {
      setLoading(false);
    }
  }, [props.config]);
  /* const [loginFormShow, SetLoginFormShow] = useState(true); */
  console.log(flavor);
  return (
    <>
      <Global
        styles={css`
          :root {
            --primaryColor: ${
              props.config ? props.config.concierge_primary_color : "#1890ff"
            };
            --secondaryColor: ${
              props.config ? props.config.concierge_secondary_color : "#1890ff"
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
            --fontFormColor: ${
              props.config ? props.config.concierge_primary_color : "#000"
            };
            --srcFontFamily: ${
              flavor && flavor.font_family
                ? "url(/" + routeFlavor + "/fonts/" + flavor.font_family + ")"
                : 'url("/fonts/sans-serif")'
            }; 
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

      {props.config ? (
        <Col span={24} className="containerPrincipal">
          <Row justify="space-around" align="middle" style={{ height: "100%" }}>
            <Col
              xl={12}
              lg={12}
              md={12}
              sm={0}
              xs={0}
              className="backLogin"
            ></Col>
            <Col
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={24}
              className="loginContainer"
            >
              <div
                style={{ textAlign: "center", width: "100%", margin: "auto" }}
              >
                <Row justify={"center"}>
                  <Col xs={43} sm={23} md={12} lg={12} xl={12}>
                    {props.config && props.config.concierge_logo ? (
                      <img
                        style={{
                          width: 130,
                          paddingBottom: 10,
                          marginBottom: 20,
                        }}
                        src={props.config.concierge_logo}
                        alt=""
                      />
                    ) : (
                      <img
                        style={{
                          width: 130,
                          paddingBottom: 10,
                          marginBottom: 20,
                        }}
                        src={"/images/logo.png"}
                        alt=""
                      />
                    )}

                    {recoverPasswordShow ? (
                      <PasswordRecover
                        setRecoverPasswordShow={setRecoverPasswordShow}
                      />
                    ) : (
                      <LoginForm
                        setRecoverPasswordShow={setRecoverPasswordShow}
                      />
                    )}
                    {/* <PasswordRecover/> */}
                  </Col>
                </Row>
              </div>
              {/* <LoginForm /> */}
            </Col>
          </Row>
        </Col>
      ) : (
        <div className="center-content" style={{ padding: "10%" }}>
          <Spin tip="Cargando..." spinning={loading} />
        </div>
      )}
    </>
  );
};

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
  };
};

export default connect(mapState)(Home);
