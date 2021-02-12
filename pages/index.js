import Head from "next/head";
import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { Row, Col, Card } from "antd";

const Home = () => {
  return (
    <>
      <Col span={24} className="containerPrincipal">
        <Row justify="space-around" align="middle">
          <Col xl={12} lg={12} md={12} sm={12} xs={24}>
            {/* <img className="card-login" alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" /> */}
          </Col>
          <Col
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={24}
            className="loginContainer"
          >
            <div style={{ textAlign: "center" }}>
              <img
                style={{ margin: "auto" }}
                src={
                  "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/12220210623/staff_1-1.png"
                }
                alt=""
              />
            </div>
            <LoginForm />
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Home;
