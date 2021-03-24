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
  Tooltip,
} from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import moment from "moment";
import Axios from "axios";
import { API_URL } from "../../config/config";

import SelectCollaborator from "../../components/selects/SelectCollaboratorItemForm";
import SelectCompany from "../../components/selects/SelectCompany";
import SelectBank from "../../components/selects/SelectBank";
import BreadcrumbHome from "../../components/BreadcrumbHome";

import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  FileDoneOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { userCompanyId, withAuthSync } from "../../libs/auth";
import jsCookie from "js-cookie";

const BankAccounts = () => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [loading, setLoading] = useState(false);

  const [backsAccountsList, setBanksAccountsList] = useState([]);
  const [permissions, setPermissions] = useState({});

  /* Variables */
  const [companyId, setCompanyId] = useState(null);
  const [departamentId, setDepartamentId] = useState(null);
  let nodeId = userCompanyId();

  /* Select estatus */
  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
  ];

  /* Select type */
  const optionType = [
    { value: 1, label: "Verificación", key: "opt_1" },
    { value: 2, label: "Actualización", key: "opt_2" },
  ];

  /* Columns */
  const columns = [
    {
      title: "Colaborador",
      dataIndex: "person",
      key: "person",
      render: (person) => {
        return person.first_name + " " + person.flast_name;
      },
    },
    {
      title: "Empresa",
      dataIndex: "person",
      key: "business",
      render: (person) => {
        return person.job.lenght > 0 &&
          person.job[0].department &&
          person.job[0].department.node
          ? person.job[0].department.node.name
          : null;
      },
    },
    {
      title: "Número de cuenta",
      dataIndex: "new_account_number",
      key: "new_account_number",
    },
    {
      title: "Banco",
      dataIndex: "new_bank",
      key: "new_bank",
      render: (new_bank) => {
        return new_bank.name;
      },
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        return type == 1 ? "Verificación" : "Actualización";
      },
    },
    {
      title: "Estatus",
      dataIndex: "request_status",
      key: "request_status",
      render: (request_status) => {
        return request_status == 1
          ? "Pendiente"
          : request_status == 2
          ? "Aprobado"
          : "Rechazado";
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (row) => {
        return (
          <EyeOutlined
            className="icon_actions"
            key={"goDetails_" + row.id}
            onClick={() => GotoDetails(row)}
          />
        );
      },
    },
  ];

  const getBanksAccountRequest = async (
    collaborator = null,
    account_number = null,
    bank = null,
    type = null,
    status = null
  ) => {
    setLoading(true);
    try {
      let url = `/person/bank-account-request/?person__job__department__node__id=${nodeId}&`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }
      if (account_number) {
        url += `new_account_number=${account_number}&`;
      }
      if (bank) {
        url += `new_bank=${bank}&`;
      }
      if (type) {
        url += `type=${type}&`;
      }
      if (status) {
        url += `request_status=${status}&`;
      }

      let response = await Axios.get(API_URL + url);
      let data = response.data.results;
      data = data.map((item) => {
        item.key = item.id;
        return item;
      });

      setBanksAccountsList(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const GotoDetails = (data) => {
    route.push("bank_accounts/" + data.id + "/details");
  };

  const filter = async (values) => {
    setBanksAccountsList([]);

    getBanksAccountRequest(
      values.collaborator,
      values.account_number,
      values.bank,
      values.type,
      values.status
    );
    /* getIncapacity(
                values.collaborator,
                values.company,
                values.department,
                values.status
            ); */
  };

  /* Eventos de componentes */
  const onChangeCompany = (val) => {
    /* form.setFieldsValue({
                department: null,
            }); */
    setCompanyId(val);
  };

  /* const changeDepartament = (val) => {
          setDepartamentId(val);
      }; */

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    getBanksAccountRequest();
  }, [route]);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.requestaccount.can.view")) perms.view = true;
      if (a.includes("people.requestaccount.can.create")) perms.create = true;
      if (a.includes("people.requestaccount.can.edit")) perms.edit = true;
      if (a.includes("people.requestaccount.can.delete")) perms.delete = true;
    });
    setPermissions(perms);
  };

  const resetFilter = () => {
    form.resetFields();
    getBanksAccountRequest();
  };

  return (
    <MainLayout currentKey="7.5">
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Cuentas bancarias</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        {permissions.view ? (
          <>
            <Row justify="space-between" style={{ paddingBottom: 20 }}>
              <Col>
                <Form
                  form={form}
                  name="filter"
                  onFinish={filter}
                  layout="vertical"
                  key="formFilter"
                  className={"formFilter"}
                >
                  <Row gutter={[24, 8]}>
                    <Col>
                      <SelectCollaborator
                        name={"collaborator"}
                        style={{ width: 150 }}
                      />
                    </Col>
                    {/* <Col>
                      <SelectCompany
                        name="company"
                        label="Empresa"
                        onChange={onChangeCompany}
                        key="SelectCompany"
                        style={{ width: 150 }}
                      />
                    </Col> */}
                    {/* <Col>
                                    <SelectDepartment companyId={companyId} onChange={changeDepartament} key="SelectDepartment" />
                                </Col> */}
                    <Col>
                      <Form.Item
                        key="account_number_filter"
                        name="account_number"
                        label="Número de cuenta"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col>
                      <SelectBank name="bank" style={{ width: 140 }} />
                    </Col>
                    <Col>
                      <Form.Item
                        key="type_filter"
                        name="type"
                        label="Tipo de solicitud"
                      >
                        <Select
                          style={{ width: 150 }}
                          key="select_type"
                          options={optionType}
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
                          style={{ width: 100 }}
                          key="select_status"
                          options={optionStatus}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ display: "flex" }}>
                      <Button
                        style={{
                          background: "#fa8c16",
                          fontWeight: "bold",
                          color: "white",
                          marginTop: "auto",
                        }}
                        key="buttonFilter"
                        htmlType="submit"
                        loading={loading}
                      >
                        <SearchOutlined />
                      </Button>
                    </Col>
                    <Col style={{ display: "flex" }}>
                      <Tooltip
                        title="Limpiar filtros"
                        color={"#3d78b9"}
                        key={"#3d78b9"}
                      >
                        <Button
                          onClick={() => resetFilter()}
                          style={{ marginTop: "auto", marginLeft: 10 }}
                        >
                          <SyncOutlined />
                        </Button>
                      </Tooltip>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
            <Row justify="end">
              <Col span={24}>
                <Table
                  dataSource={backsAccountsList}
                  key="tableHolidays"
                  loading={loading}
                  columns={columns}
                ></Table>
              </Col>
            </Row>
          </>
        ) : (
          <div className="notAllowed" />
        )}
      </div>
    </MainLayout>
  );
};

export default withAuthSync(BankAccounts);
