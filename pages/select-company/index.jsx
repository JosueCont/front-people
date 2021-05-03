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

import { userCompanyId, withAuthSync } from "../../libs/auth";
import jsCookie from "js-cookie";

const SelectCompany = () => {
  const { Title } = Typography;
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState(null);

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
          if (response.data.nodes.length > 0) setDataList(response.data.nodes);
          if (response.data.nodes.length == 1)
            setCompanySelect(response.data.nodes[0]);
          else setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    }
  }, [jwt]);

  const setCompanySelect = (item) => {
    sessionStorage.setItem("data", item.value);
    sessionStorage.setItem("name", item.name);
    let company_id = userCompanyId();
    if (company_id) useRouter.push("home");
    else message.error("Ocurrio un error, intente de nuevo.");
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
              <Row gutter={24}>
                {dataList.map((item) => (
                  <Col span={4} style={{ display: "grid" }}>
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
