import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Typography,
  notification,
  Card,
  Layout,
  Menu,
  Table,
  Breadcrumb,
} from "antd";
import MainLayout from "../../../../../layout/MainLayout";
import { Global, css } from "@emotion/core";
import { useRouter } from "next/router";
import axiosApi from "../../../../../libs/axiosApi";
import Moment from "moment";
import BreadcrumbHome from "../../../../../components/BreadcrumbHome";
import { withAuthSync } from "../../../../../libs/auth";
import Axios from 'axios'
import { API_URL } from "../../../../../config/config";


const UserNotification = () => {
  const route = useRouter();
  const [list, setList] = useState([]);
  const { id } = route.query;
  const { Column } = Table;

  const getUsers = async () => {
    try {
      let response = await Axios.get(API_URL+`/noticenter/user-notification/?notification_id=${id}`
      );
      let data = response.data;
      setList(data.results);
      console.log(data);
    } catch (e) {
      console.log(e);
      /* setLoading(false); */
    }
  };

  useEffect(() => {
    getUsers();
  }, [route]);

  return (
    <MainLayout currentKey="4.1">
      <Breadcrumb key="Breadcrumb">
        <BreadcrumbHome />
        <Breadcrumb.Item key="releases" href="/comunication/releases">
          Comunicados
        </Breadcrumb.Item>
        <Breadcrumb.Item key="releases">
          Usuarios que recibieron
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify="space-between" key="row1" style={{ padding: "20px 0" }}>
          <Col span={24}>
            <Table dataSource={list} key="releases_table">
              <Column
                title="Nombre"
                dataIndex="person"
                key="name"
                render={(text, record) =>
                  text.first_name + " " + text.flast_name
                }
              />
              <Column
                title="Fecha de recibido"
                dataIndex="timestamp"
                key="date_received"
                render={(text, record) => Moment(text).format("DD / MM / YYYY")}
              />
              <Column
                title="Fecha de lectura"
                dataIndex="is_read"
                key="read_date"
                render={(text, record) =>
                  text
                    ? Moment(record.date_read).format("DD / MM / YYYY")
                    : null
                }
              />
            </Table>
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              onClick={() => route.push("/comunication/releases")}
              style={{ padding: "0 50px", margin: "0 10px" }}
            >
              Regresar
            </Button>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};
export default withAuthSync(UserNotification);
