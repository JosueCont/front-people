import Head from "next/head";
import React, { useEffect, useState } from "react";
import LoginForm from "../../components/LoginForm";
import RecoveryPasswordForm from "../../components/RecoveryPaswwordForm";
import { Row, Col, Card, Typography } from "antd";
import { useRouter } from "next/router";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { LOGIN_URL, APP_ID } from "../../config/config";
import Axios from "axios";

const PasswordRecovery = () => {
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

  const RecoveryPassword = async (newPassword = null) => {
    try {
      setLoading(true);
      const headers = {
        "client-id": APP_ID,
        "Content-Type": "application/json",
      };
      const data = {
        new_password: newPassword,
        token: token,
      };
      let response = await Axios.post(
        LOGIN_URL + "/user/password/change/",
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
            <div style={{ textAlign: "center", width: "100%", margin: "auto" }}>
              <Row justify={"center"}>
                <Col xs={43} sm={23} md={12} lg={12} xl={12}>
                  <img
                    style={{ width: 130, paddingBottom: 10 }}
                    src={
                      "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/12220210623/staff_1-1.png"
                    }
                    alt=""
                  />
                  {responseSuccess ? (
                    <>
                      <Title level={3} className={"font-color-khor"}>
                        Contraseña actualizada correctamente
                      </Title>
                      <p
                        className={"font-color-khor pointer"}
                        onClick={() => router.push({ pathname: "/home" })}
                      >
                        <ArrowLeftOutlined />
                        <Text className={"font-color-khor"}>
                          {" "}
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
            {/* <LoginForm /> */}
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default PasswordRecovery;
