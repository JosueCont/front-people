import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Tabs,
  Tooltip,
  message,
  Typography,
  Card,
  Spin,
} from "antd";
import useRouter from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";

import { userCompanyId, userId, withAuthSync } from "../../libs/auth";
import jsCookie from "js-cookie";

const SelectCompany = () => {
  const { Title } = Typography;
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState(null);
  let personId = userId();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    try {
      setJwt(JSON.parse(jsCookie.get("token")));
    } catch (error) {
      useRouter.push("/");
    }
  }, []);

  useEffect(() => {
    if (jwt) {
      Axios.post(API_URL + `/person/person/person_for_khonnectid/`, {
        id: jwt.user_id,
      })
        .then((response) => {
          setAdmin(response.data.is_admin);
          if (response.data.is_admin) {
            if (personId == "" || personId == null || personId == undefined)
              sessionStorage.setItem("number", response.data.id);
            getCopaniesList();
          } else {
            if (response.data.nodes.length > 1) {
              if (personId == "" || personId == null || personId == undefined)
                sessionStorage.setItem("number", response.data.id);
              let data = response.data.nodes.filter((a) => a.active);
              setDataList(data);
            } else if (response.data.nodes.length == 1) {
              if (personId == "" || personId == null || personId == undefined)
                sessionStorage.setItem("number", response.data.id);
              setCompanySelect(response.data.nodes[0]);
            } else {
              setLoading(false);
            }
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    }
  }, [jwt]);

  const getCopaniesList = async () => {
    try {
      let response = await Axios.get(API_URL + `/business/node/`);
      let data = response.data.results.filter((a) => a.active);
      setDataList(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const setCompanySelect = (item) => {
    getConfig();
    if (admin) sessionStorage.setItem("data", item.id);
    else sessionStorage.setItem("data", item.value);
    sessionStorage.setItem("name", item.name);
    let company_id = userCompanyId();
    if (company_id) useRouter.push("home");
    else message.error("Ocurrio un error, intente de nuevo.");
  };

  const getConfig = () => {
    Axios.get(API_URL + "/setup/site-configuration/")
      .then((res) => {
        sessionStorage.setItem("accessIntranet", res.data.intranet_enabled);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      {jwt && jwt.user_id ? (
        <MainLayout currentKey="8.5" hideMenu={true}>
          <Breadcrumb className={"mainBreadcrumb"}>
            <Breadcrumb.Item
              className={"pointer"}
              onClick={() => useRouter.push({ pathname: "/home" })}
            >
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item>Empresas</Breadcrumb.Item>
          </Breadcrumb>
          <div className="container" style={{ width: "100%", padding: 20 }}>
            <Spin spinning={loading}>
              <Row
                gutter={[16, 16]}
                style={{
                  display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }}
              >
                {dataList.map((item) => (
                  <Col
                    xl={5}
                    lg={5}
                    md={5}
                    sm={8}
                    xs={24}
                    style={{ display: "grid", margin: "10px" }}
                  >
                    <Card
                      hoverable
                      style={{ textAlign: "center", marginTop: 20 }}
                      className={"cardH100"}
                      onClick={() => setCompanySelect(item)}
                    >
                      <Title level={4} style={{ margin: "auto" }}>
                        <img alt="example" src={item.image} width="50px" />
                        <br />
                        {item.name}
                      </Title>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Spin>
          </div>
        </MainLayout>
      ) : (
        <div className="notAllowed" />
      )}
    </>
  );
};

export default SelectCompany;
