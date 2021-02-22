import Head from "next/head";
import React, { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import PasswordRecover from '../components/PasswordRecover';
import { Row, Col, Card } from "antd";


const Home = () => {
    const [recoverPasswordShow, setRecoverPasswordShow] = useState(false);
    /* const [loginFormShow, SetLoginFormShow] = useState(true); */

  return (
    <>
      <Col span={24} className="containerPrincipal">
        <Row justify="space-around" align="middle" style={{ height: '100%' }}>
          <Col xl={12} lg={12} md={12} sm={0} xs={0} className="backLogin">
          </Col>
          <Col
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={24}
            className="loginContainer"
          >
            
            <div style={{textAlign:'center' ,width: '100%', margin: 'auto' }}>
              <Row justify={'center'}>
                  <Col xs={43} sm={23} md={12} lg={12} xl={12}>
                    <img
                        style={{ width: 130, paddingBottom: 10 }}
                        src={
                            "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/12220210623/staff_1-1.png"
                        }
                        alt=""
                    />
                    { recoverPasswordShow ? <PasswordRecover setRecoverPasswordShow={setRecoverPasswordShow} /> : <LoginForm  setRecoverPasswordShow={setRecoverPasswordShow}/> }
                    {/* <PasswordRecover/> */}
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

export default Home;
