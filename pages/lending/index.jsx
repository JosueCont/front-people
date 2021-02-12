import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import Axios from 'axios';
import {API_URL} from './../../config/config'
import moment from "moment";



import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { withAuthSync } from "../../libs/auth";

const Lending = () => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [lendingList, setLendingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const getLending = async () => {
      setLoading(true);
        try {
            let response = await Axios.get(API_URL+`/payroll/loan/`);
            let data = response.data.results;
              console.log(data);
              setLendingList(data);
        } catch (e) {
            console.log(e);
        }finally{
            setLoading(false);
        }
  };

  /* const GotoDetails = (data) => {
    console.log(data);
    route.push("holidays/" + data.id + "/details");
  }; */

  useEffect(() => {
    getLending();
  }, [route]);

  return (
    <MainLayout currentKey="7.1">
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Prestamos</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify="space-between" key="row1" style={{ paddingBottom: 20 }}>
          <Col>
            <Form name="filter" layout="inline" key="form">
              <Form.Item key="send_by" name="send_by" label="Colaborador">
                <Input />
              </Form.Item>
              <Form.Item key="type" name="type" label="Tipo">
                <Select style={{ width: 150 }} key="select">
                  <Option key="item_1" value="rmb">
                    RMB
                  </Option>
                  <Option key="item_2" value="dollar">
                    Dollar
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item key="estatus_filter" name="estatus" label="Estatus">
                <Select style={{ width: 150 }} key="select">
                  <Option key="item_1" value="rmb">
                    RMB
                  </Option>
                  <Option key="item_2" value="dollar">
                    Dollar
                  </Option>
                </Select>
              </Form.Item>
              <Button
                style={{
                  background: "#fa8c16",
                  fontWeight: "bold",
                  color: "white",
                }}
                onClick={() => route.push("holidays/new")}
              >
                Filtrar
              </Button>
            </Form>
          </Col>
          <Col>
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              onClick={() => route.push("lending/config")}
            >
              Configuración
            </Button>
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
                marginLeft: 20,
              }}
              onClick={() => route.push("lending/new")}
            >
              <PlusOutlined />
              Nuevo
            </Button>
          </Col>
        </Row>
        <Row justify={"end"}>
          <Col span={24}>
            <Table dataSource={lendingList} key="table_holidays">
              <Column
                title="Colaborador"
                dataIndex="person"
                key="id"
                render={(person) => (
                    person.first_name+' '+person.flast_name
                )}
              ></Column>
              <Column
                title="Tipo de prestamo"
                dataIndex="type"
                key="type"
                render={(type) => (
                    type === 'EMP' ? 'Empresa' : 'E-Pesos'
                )}
              ></Column>
              <Column
                title="Cantidad"
                dataIndex="amount"
                key="amount"
              ></Column>
              <Column
                title="Plazos"
                dataIndex="deadline"
                key="deadline"
              ></Column>
              <Column
                title="Periodicidad"
                dataIndex="periodicity"
                key="periodicity"
                render={(periodicity) => (
                    periodicity === 1 ? 'Semanal' : periodicity === 2 ? 'Catorcenal' : periodicity === 3 ? 'Quincenal' : 'Mensual'
                )}
              ></Column>
              <Column
                title="Fecha solicitada"
                dataIndex="timestamp"
                key="timestamp"
                render={(timestamp) => (
                    moment(timestamp).format("DD/MM/YYYY")
                )}
              />
              <Column title="Estatus" dataIndex="status" key="status"
              render={(status) =>(
                status === 1 ? 'Pendiente' : status === 2 ? 'Aprobado' : 'Rechazado'
              )}
               />
              <Column
                title="Acciones"
                key="actions"
                render={(text, record) => (
                  <>
                    <EyeOutlined
                      className="icon_actions"
                      key={"goDetails_" + record.id}
                      onClick={() => GotoDetails(record)}
                    />
                    <EditOutlined
                      className="icon_actions"
                      key={"edit_" + record.id}
                      onClick={() =>
                        route.push("holidays/" + record.id + "/edit")
                      }
                    />
                  </>
                )}
              ></Column>
            </Table>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(Lending);
