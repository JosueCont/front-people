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
} from "antd";
import useRouter from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";

import { userCompanyId, withAuthSync } from "../../libs/auth";
import jsCookie from "js-cookie";

const SelectCompany = () => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState({});

  useEffect(() => {
    try {
      setJwt(JSON.parse(jsCookie.get("token")));
    } catch (error) {
      useRouter.push("/");
    }
  }, []);

  useEffect(() => {
    Axios.post(API_URL + `/person/person/person_for_khonnectid/`, {
      id: jwt.user_id,
    })
      .then((response) => {
        if (response.data.nodes.length > 0) setDataList(response.data.nodes);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, [jwt]);

  const setCompanySelect = (item) => {
    sessionStorage.setItem("data", item.value);
    sessionStorage.setItem("name", item.name);
    let company_id = userCompanyId();
    if (company_id) useRouter.push("home");
    else message.error("Ocurrio un error, intente de nuevo.");
  };

  const columns = [
    {
      title: "Empresa",
      dataIndex: "name",
      key: "name",
    },
    // {
    //   title: "Nodo padre",sessionStorage
    // },
    {
      title: "",
      render: (item) => {
        return (
          <Button
            style={{
              background: "#fa8c16",
              fontWeight: "bold",
              color: "white",
              marginTop: "auto",
            }}
            onClick={() => setCompanySelect(item)}
            key="btn_new"
          >
            Acceder
          </Button>
        );
      },
    },
  ];

  return (
    <>
      {jwt.user_id ? (
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
          <div
            className="container back-white"
            style={{ width: "100%", padding: "20px 0" }}
          >
            <Row>
              <Col span={24}>
                <Table
                  dataSource={dataList}
                  columns={columns}
                  loading={loading}
                />
              </Col>
            </Row>
          </div>
        </MainLayout>
      ) : (
        <div className="notAllowed" />
      )}
    </>
  );
};

export default SelectCompany;
