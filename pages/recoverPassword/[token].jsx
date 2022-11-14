import Head from "next/head";
import React, { useEffect, useState } from "react";
import LoginForm from "../../components/LoginForm";
import RecoveryPasswordForm from "../../components/RecoveryPaswwordForm";
import { Row, Col, Card, Typography } from "antd";
import { useRouter } from "next/router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Axios from "axios";
import { connect } from "react-redux";
import {css, Global} from "@emotion/core";
import PasswordRecover from "../../components/PasswordRecover";

const PasswordRecovery = ({...props}) => {
  const router = useRouter();
  const { token } = router.query;
  const { Text, Title } = Typography;

  const [loading, setLoading] = useState(false);
  const [recoverPasswordShow, setRecoverPasswordShow] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);
  const [responseError, setResponseError] = useState(false);

  const onFinish = (values) => {
    setResponseError(false);
    RecoveryPassword(values.passwordOne);
  };

  useEffect(()=>{
    if(props.config){
      console.log('config',props.config)
    }
  },[props])

  const RecoveryPassword = async (newPassword = null) => {
    try {
      setLoading(true);
      const headers = {
        "client-id": props.config.client_khonnect_id,
        "Content-Type": "application/json",
      };
      const data = {
        new_password: newPassword,
        token: token,
      };
      let response = await Axios.post(
        props.config.url_server_khonnect + "/user/password/change/",
        data,
        { headers: headers }
      );

      if (response.data.level == "success") {
        setResponseSuccess(true);
      } else {
        setResponseError(true);
      }
    } catch (e) {
      setResponseError(true);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Global
          styles={css`
          :root {
            --primaryColor: ${props.config && props.config.theme_color
              ? props.config.theme_color.primary_color
              : "#1890ff"};
            --primaryAlternativeColor: ${props.config && props.config.theme_color
              ? props.config.theme_color.primary_alternative_color
              : "#1890ff"};
            --secondaryColor: ${props.config
              ? props.config.concierge_secondary_color
              : "#1890ff"};
            --secondaryAlternativeColor: ${props.config && props.config.theme_color
              ? props.config.theme_color.secondary_alternative_color
              : "#1890ff"};
            --background_image: ${props.config &&
          props.config.concierge_logo_login
              ? "url(" + props.config.concierge_logo_login + ")"
              : ''};
            --logo_login: ${props.config && props.config.concierge_logo
              ? "url(" + props.config.concierge_logo + ")"
              : 'url("/images/Grupo Industrial Roche-Color.png")'};
            --fontFormColor: ${props.config
              ? props.config.concierge_primary_color
              : "#000"};
          }

          body {
            background: transparent var(--background_image) 70% 5% no-repeat
              padding-box;
            background-size: cover;
            opacity: 1;
          }

          .divContainerLeft {
            text-align: center;
            width: 90%;
            margin: 0 auto;
            padding: 50px;
            height: 510px;

            position: relative;
            display: flex;

            -webkit-animation: fadein 2s; /* Safari, Chrome and Opera > 12.1 */
            -moz-animation: fadein 2s; /* Firefox < 16 */
            -ms-animation: fadein 2s; /* Internet Explorer */
            -o-animation: fadein 2s; /* Opera < 12.1 */
            animation: fadein 2s;
          }

          .divform {
            position: relative;
            width: 75% !important;
            margin: 0 auto;
            padding: 20px 50px 50px !important;
            min-height: 510px;
            background: #fff 0 0 no-repeat padding-box;
            box-shadow: 0 0 50px rgb(42 89 152 / 5%);
            border-radius: 10px;
          }

          .textBottom {
            bottom: 0;
            height: 45px;
            font-size: 10px;
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

            .form-subtitle {
              font-size: 15px;
            }
          }

          .fullPage {
            width: 100%;
            height: 100vh;
            display: flex;
          }

          @media only screen and (max-width: 768px) {
            .divform {
              padding: 20px !important;
              width: 100% !important;
              min-height: auto;
              margin: 0;
              top: 10px;
            }

            body {
              background: transparent var(--background_image) 70% 5%
                no-repeat padding-box;
              background-size: 100% 100%;
            }

            .form-title {
              font-size: 20px !important;
            }

            .form-subtitle {
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
          }
        `}
      />
      <div className="fullPage">
        <Row
            style={{ marginTop: "auto", marginBottom: "auto", width: "100%" }}
        >
          <Col xs={0} md={12} sm={0}>
            <div className="divContainerLeft">
              <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    margin: "auto",
                  }}
              >
                <img
                    className={"logoKhor"}
                    src={
                      props?.config?.concierge_logo
                          ? props.config.concierge_logo
                          : "/images/iU_Khorplus.png"
                    }
                    width={200}
                    alt=""
                />
              </div>
{/*               <p className={"textBottom"}>
                KHOR A People Management Framework y PPP Personal Proficiency
                Profile, son marcas registradas y propiedad de @-Hiuman, S.A.
                de C.V.
              </p> */}
            </div>
          </Col>
          <Col xs={24} md={0} sm={0}>
            <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "80px",
                }}
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
          <Col xs={24} md={12} sm={24} style={{justifyContent: "center", alignItems: "center"}}>
            <div style={styles.divForm}>
              <div style={{ textAlign: "center", width: "100%", marginTop: "5%"}}>
                <Row justify={"center"}>
                  <Col xs={22} sm={22} md={20} lg={20} xl={20}>
                    {responseSuccess ? (
                        <>
                          <Title level={3} className={"font-color-khor"}>
                            Contraseña actualizada correctamente
                          </Title>
                          <p
                              className={"font-color-khor pointer"}
                              onClick={() =>
                                  router.push({ pathname: "/" })
                              }
                          >
                            <ArrowLeftOutlined />
                            <Text className={"font-color-khor"}>
                              Regresar al login
                            </Text>
                          </p>
                        </>
                    ) : (
                        <RecoveryPasswordForm
                            onFinish={onFinish}
                            loading={loading}
                        />
                    )}
                    {responseError ? (
                        <Text type="danger">
                          Ocurrio un error al actualizar la contraseña
                        </Text>
                    ) : null}
                  </Col>
                </Row>
              </div>
            </div>
            <div style={{ textAlign: "center", width: "100%", marginTop: "5%"}}>
              <p className={"textBottom"}>
                KHOR A People Management Framework y PPP Personal Proficiency
                Profile, son marcas registradas y propiedad de @-Hiuman, S.A.
                de C.V.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

const styles={
  divForm:{
    borderRadius:10,
    position:'relative',
    width:'60%',
    margin:'0 auto',
    marginTop:'8%',
    padding:'20px 10px 20px 10px',
    minHeight:300,
    background:'#fff 0 0 no-repeat padding-box'

  }
}

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
  };
};

export default connect(mapState)(PasswordRecovery);
