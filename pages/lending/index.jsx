import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import SelectCollaborator from "../../components/selects/SelectCollaboratorItemForm";

import Axios from "axios";
import { API_URL } from "./../../config/config";
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
import jsCookie from "js-cookie";

const Lending = () => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [lendingList, setLendingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [permissions, setPermissions] = useState({});

  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
  ];

  const typeOptions = [
    { value: "EMP", label: "Empresa", key: "type1" },
    { value: "EPS", label: "E-Pesos", key: "type_2" },
  ];

  const getLending = async (personID = null, type = null, status = null) => {
    setLoading(true);
    try {
      let url = API_URL + `/payroll/loan/?`;
      if (personID) {
        url += `person__id=${personID}&`;
      }

      if (type) {
        url += `type=${type}&`;
      }

      if (status) {
        url += `status=${status}`;
      }
      let response = await Axios.get(url);
      let data = response.data.results;

      setLendingList(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const filter = async (values) => {
    getLending(values.person, values.type, values.status);
  };

  const GotoDetails = (item) => {
    route.push(`/lending/${item.id}/details`);
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    getLending();
  }, [route]);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.loan.can.view")) perms.view = true;
      if (a.includes("people.loan.can.create")) perms.create = true;
      if (a.includes("people.loan.can.edit")) perms.edit = true;
      if (a.includes("people.loan.can.delete")) perms.delete = true;
      if (a.includes("people.loanconfigure.can.view")) perms.config = true;
      if (a.includes("people.loan.function.approve_loan")) perms.approve = true;
      if (a.includes("people.loan.function.reject_loan")) perms.reject = true;
    });
    setPermissions(perms);
  };

  return (
    <MainLayout currentKey="7.1">
      <Breadcrumb className={"mainBreadcrumb"} key="mainBreadcrumb">
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Préstamos</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        {permissions.view ? (
          <>
            <Row
              justify="space-between"
              key="row1"
              style={{ paddingBottom: 20 }}
            >
              <Col>
                <Form
                  className={"formFilter"}
                  name="filter"
                  onFinish={filter}
                  layout="vertical"
                  key="form"
                >
                  <Row gutter={[24, 8]}>
                    <Col>
                      <SelectCollaborator
                        name="person"
                        style={{ width: 150 }}
                      />
                    </Col>
                    <Col>
                      <Form.Item key="type" name="type" label="Tipo">
                        <Select
                          placeholder="Todos"
                          style={{ width: 150 }}
                          key="select_type"
                          options={typeOptions}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        key="estatus_filter"
                        name="status"
                        label="Estatus"
                      >
                        <Select
                          style={{ width: 150 }}
                          key="select_status"
                          options={optionStatus}
                          placeholder="Todos"
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ display: "flex" }}>
                      <Button
                        loading={loading}
                        htmlType="submit"
                        key="filter"
                        style={{
                          background: "#fa8c16",
                          fontWeight: "bold",
                          color: "white",
                          marginTop: "auto",
                        }}
                      >
                        <SearchOutlined /> Filtrar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col style={{ display: "flex" }}>
                {permissions.config && (
                  <Button
                    key="config"
                    style={{
                      background: "#fa8c16",
                      fontWeight: "bold",
                      color: "white",
                      marginTop: "auto",
                    }}
                    onClick={() => route.push("lending/config")}
                  >
                    Configuración
                  </Button>
                )}
                {permissions.create && (
                  <Button
                    key="btnnvo"
                    style={{
                      background: "#fa8c16",
                      fontWeight: "bold",
                      color: "white",
                      marginLeft: 20,
                      marginTop: "auto",
                    }}
                    onClick={() => route.push("lending/new")}
                  >
                    <PlusOutlined />
                    Agregar préstamo
                  </Button>
                )}
              </Col>
            </Row>
            <Row justify={"end"}>
              <Col span={24}>
                <Table
                  dataSource={lendingList}
                  key="table_holidays"
                  loading={loading}
                >
                  <Column
                    title="Colaborador"
                    dataIndex="person"
                    key="id"
                    render={(person) =>
                      person.first_name + " " + person.flast_name
                    }
                  ></Column>
                  <Column
                    title="Tipo de préstamo"
                    dataIndex="type"
                    key="type"
                    render={(type) => (type === "EMP" ? "Empresa" : "E-Pesos")}
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
                    render={(periodicity) =>
                      periodicity === 1
                        ? "Semanal"
                        : periodicity === 2
                        ? "Catorcenal"
                        : periodicity === 3
                        ? "Quincenal"
                        : "Mensual"
                    }
                  ></Column>
                  <Column
                    title="Fecha solicitada"
                    dataIndex="timestamp"
                    key="timestamp"
                    render={(timestamp) =>
                      moment(timestamp).format("DD/MM/YYYY")
                    }
                  />
                  <Column
                    title="Estatus"
                    dataIndex="status"
                    key="status"
                    render={(status) =>
                      status === 1
                        ? "Pendiente"
                        : status === 2
                        ? "Aprobado"
                        : "Rechazado"
                    }
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
                        {permissions.edit && record.status == 1 ? (
                          <EditOutlined
                            className="icon_actions"
                            key={"edit_" + record.id}
                            onClick={() =>
                              route.push("lending/" + record.id + "/edit")
                            }
                          />
                        ) : null}
                      </>
                    )}
                  ></Column>
                </Table>
              </Col>
            </Row>
          </>
        ) : (
          "No tiene permisos suficientes, contacte con un administrador"
        )}
      </div>
    </MainLayout>
  );
};

export default withAuthSync(Lending);
