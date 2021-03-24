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
} from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import {API_URL} from '../../config/config'

import { withAuthSync } from "../../libs/auth";

const SelectCompany = () => {
  const route = useRouter();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  

  
  useEffect(()=>{
    getCopaniesList();
  },[])

  const getCopaniesList = async () => {
    try {
      let response = await Axios.get(API_URL + `/business/node/`);
      let data = response.data.results;
      setDataList(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const setCompanySelect = (companyID) => {
    localStorage.setItem('companyID', companyID);
    route.push('home');
  }

  const columns = [
    {
      title: "Empresa",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Nodo padre",
      dataIndex: "name",
      key: "node"
    },
    {
      title: "",
      dataIndex: "id",
      render: (id) => {
        return <Button
                    style={{
                      background: "#fa8c16",
                      fontWeight: "bold",
                      color: "white",
                      marginTop: "auto",
                    }}
                    onClick={() => route.push("/home")}
                    key="btn_new"
                  >
                    Acceder
                    </Button>
      },
    },
    
  ];

  return (
    <MainLayout currentKey="8.5" hideMenu={true}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Reportes</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row>
          <Col span={24}>
            <Table dataSource={dataList}  columns={columns} />
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(SelectCompany);
