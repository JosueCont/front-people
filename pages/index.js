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
          }

          body {
            background: transparent url("/images/banner_staff_iu.jpg") 70% 5%
              no-repeat padding-box;
            background-size: cover;
            opacity: 1;
          }

          .div-container-left {
            top: 185px;
            position: relative;
            text-align: center;
            width: 90%;
            margin: 0 auto;
            padding: 50px;
            height: 510px;
            -webkit-animation: fadein 2s; /* Safari, Chrome and Opera > 12.1 */
            -moz-animation: fadein 2s; /* Firefox < 16 */
            -ms-animation: fadein 2s; /* Internet Explorer */
            -o-animation: fadein 2s; /* Opera < 12.1 */
            animation: fadein 2s;
          }

          .divform {
            top: 120px;
            position: relative;
            width: 85% !important;
            margin: 0 auto;
            padding: 20px 50px 50px !important;
            min-height: 510px;
            background: #fff 0 0 no-repeat padding-box;
            box-shadow: 0 0 50px rgb(42 89 152 / 5%);
            border-radius: 10px;
          }

          .textBottom {
            top: 30%;
            height: 45px;
            position: relative;
            font-size: 12px;
            letter-spacing: 0px;
            color: #ffffff !important;
            opacity: 1;
          }

          .textBottomblack {
            top: 30%;
            height: 45px;
            position: relative;
            font-size: 12px;
            padding-left: 10px;
            padding-right: 10px;
            letter-spacing: 0px;
            color: black !important;
            opacity: 1;
          }

          .logoKhor {
            width: 295px;
            opacity: 1;
            position: relative;
            top: 50%;
          }
          .form-title {
            font-size: 30px !important;
            text-align: center;
            color: #1d252d;
            letter-spacing: 0;
            font-weight: 700;
            margin-bottom: 10px;
          }

          .form-subtitle {
            text-align: center;
            font-size: 18px;
            margin-bottom: 5px;
          }

          @media only screen and (max-width: 999px) {
            .divform {
              padding: 20px !important;
              width: 100% !important;  
            }
          
            .form-title {
              font-size: 25px !important;
            }
            
            .form-subtitle{
                font-size: 15px;
            }
          }
          
          
          @media only screen and (max-width: 768px) {
            .divform {
              padding: 20px !important;
              width: 100% !important;
              min-height: auto;
              margin:0;
              top: 10px;
            }
            
            body{
              background: transparent url('/images/banner_staff_iu.jpg') 70% 5% no-repeat padding-box;
              background-size: 100% 100%;
            }
          
            .form-title {
              font-size: 20px !important;
            }
            
            .form-subtitle{
                font-size: 14px;
            }
          
            .login-form {
              width: 100% !important;
            }
          }
          
           @media only screen and (max-width: 600px) {
            .divform {
              padding: 20px !important;
              width: 100%;
            }
          
            .form-title {
              font-size: 25px !important;
            }
          
            .login-form {
              width: 100% !important;
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

      {props.config ? (
        <Row>
          <Col xs={0} md={12} sm={0}>
            <div className="div-container-left">
              <div
                style={{ width: "100%", textAlign: "center", marginTop: "30%" }}
              >
                <img
                  className={"logoKhor"}
                  src={"/images/iU_Khorplus.png"}
                  width={200}
                  alt=""
                />
              </div>

              <p className={"textBottom"}>
                KHOR A People Management Framework y PPP Personal Proficiency
                Profile, son marcas registradas y propiedad de @-Hiuman, S.A. de
                C.V.
              </p>
            </div>
          </Col>
          <Col xs={24} md={0} sm={0}>
            <div
              style={{ width: "100%", textAlign: "center", marginTop: "80px" }}
              className={"fadein"}
            >
              <img
                className={"logoKhor"}
                src={"/images/iU_Khorplus.png"}
                width={200}
                alt=""
              />
            </div>
          </Col>

          <Col xs={24} md={12} sm={24} style={{ padding: 20 }}>
            {recoverPasswordShow ? (
              <PasswordRecover
                generalConfig={props.config}
                setRecoverPasswordShow={setRecoverPasswordShow}
              />
            ) : (
              <div className={"divform"}>
                <LoginForm
                  generalConfig={props.config}
                  setRecoverPasswordShow={setRecoverPasswordShow}
                />
              </div>
            )}
          </Col>

          <Col xs={24} md={0} sm={0}>
            <div
              style={{ width: "100%", textAlign: "center", marginTop: "10px" }}
            >
              <p className={"textBottomblack"}>
                KHOR A People Management Framework y PPP Personal Proficiency
                Profile, son marcas registradas y propiedad de @-Hiuman, S.A. de
                C.V.
              </p>
            </div>
          </Col>
        </Row>
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
