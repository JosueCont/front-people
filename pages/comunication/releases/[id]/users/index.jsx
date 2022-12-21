import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Table, Breadcrumb } from "antd";
import MainLayout from "../../../../../layout/MainLayout";
import { useRouter } from "next/router";
import Moment from "moment";
import { withAuthSync } from "../../../../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../../../../config/config";
import axiosApi from './../../../../../api/axiosApi';
import { CheckOutlined } from "@ant-design/icons";

const UserNotification = () => {
  const route = useRouter();
  const [list, setList] = useState([]);
  const { id } = route.query;
  const { Column } = Table;

  const getUsers = async () => {
    try {
      let response = await axiosApi.get(
        `/noticenter/user-notification/?notification_id=${id}`
      );
      let data = response.data;
      setList(data.results);
    } catch (e) {
      console.log(e);
      /* setLoading(false); */
    }
  };

  useEffect(() => {
    getUsers();
  }, [route]);

  return (
    <MainLayout currentKey={["releases"]} defaultOpenKeys={["managementRH","concierge","releases"]}>
      <Breadcrumb key="Breadcrumb">
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Concierge</Breadcrumb.Item>
        <Breadcrumb.Item className={"pointer"}
                         onClick={() => route.push({ pathname: "/comunication/releases" })}>
          Comunicados
        </Breadcrumb.Item>
        <Breadcrumb.Item key="releases">
          Usuarios que recibieron
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify="space-between" key="row1" style={{ padding: "20px 0" }}>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              onClick={() => route.push("/comunication/releases")}
              style={{ padding: "0 50px", margin: "20px 0px" }}
            >
              Regresar
            </Button>
          </Col>
          <Col span={24}>
            <Table
              dataSource={list}
              key="releases_table"
              locale={{ emptyText: "No se encontraron resultados." }}
            >
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
                title="Enterado"
                dataIndex="is_read"
                key="is_read"
                align="center"
                render={(is_read, record) =>
                  is_read ? <CheckOutlined /> : null
                }
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
        </Row>
      </div>
    </MainLayout>
  );
};
export default withAuthSync(UserNotification);
