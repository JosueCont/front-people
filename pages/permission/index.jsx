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
import Axios from "axios";
import { API_URL } from "../../config/config";

import SelectCompany from "../../components/selects/SelectCompany";
import SelectDepartment from "../../components/selects/SelectDepartment";
import BreadcrumbHome from "../../components/BreadcrumbHome";
import SelectCollaborator from "../../components/selects/SelectCollaboratorItemForm";

import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { userCompanyId, withAuthSync } from "../../libs/auth";
import jsCookie from "js-cookie";

const Permission = () => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [permissionsList, setPermissionsList] = useState([]);
  const [personList, setPersonList] = useState(null);

  /* Variables */
  const [companyId, setCompanyId] = useState(null);
  const [departamentId, setDepartamentId] = useState(null);
  const [permissions, setPermissions] = useState({});
  let nodeId = userCompanyId();

  /* Select estatus */
  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
  ];

  const getAllPersons = async () => {
    try {
      let response = await Axios.get(API_URL + `/person/person/`);
      let data = response.data.results;
      let list = [];
      data = data.map((a, index) => {
        let item = {
          label: a.first_name + " " + a.flast_name,
          value: a.id,
          key: a.id + index,
        };
        list.push(item);
      });
      setPersonList(list);
    } catch (e) {
      console.log(e);
    }
  };

  const getPermissions = async (
    collaborator = null,
    company = null,
    department = null,
    status = null
  ) => {
    setLoading(true);
    try {
      let url = `/person/permit/?person__node__id=${nodeId}&`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }
      if (status) {
        url += `status=${status}&`;
      }

      if (department) {
        url += `person__person_department__id=${department}&`;
      }
      let response = await Axios.get(API_URL + url);
      let data = response.data.results;
      setPermissionsList(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setSending(false);
    }
  };

  const GotoDetails = (data) => {
    route.push("permission/" + data.id + "/details");
  };

  const filterPermission = async (values) => {
    setSending(true);
    getPermissions(
      values.collaborator,
      values.company,
      departamentId,
      values.status
    );
  };

  /* Eventos de componentes */
  const onChangeCompany = (val) => {
    form.setFieldsValue({
      department: null,
    });
    setCompanyId(val);
  };

  const changeDepartament = (val) => {
    setDepartamentId(val);
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    getPermissions();
    getAllPersons();
  }, [route]);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.permit.can.view")) perms.view = true;
      if (a.includes("people.permit.can.create")) perms.create = true;
      if (a.includes("people.permit.can.edit")) perms.edit = true;
      if (a.includes("people.permit.can.delete")) perms.delete = true;
      if (a.includes("people.permit.function.approve_permit"))
        perms.approve = true;
      if (a.includes("people.permit.function.reject_permit"))
        perms.reject = true;
    });
    setPermissions(perms);
  };

  const resetFilter = () => {
    form.resetFields();
    getAllPersons();
    getPermissions();
  };

  return (
    <MainLayout currentKey="7.3">
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Permisos</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        {permissions.view ? (
          <>
            <Row justify="space-between" style={{ paddingBottom: 20 }}>
              <Col>
                <Form
                  name="filter"
                  onFinish={filterPermission}
                  layout="vertical"
                  key="formFilter"
                  className={"formFilter"}
                  form={form}
                >
                  <Row gutter={[24, 8]}>
                    <Col>
                      <SelectCollaborator
                        name="collaborator"
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
                    <Col>
                      <SelectDepartment
                        companyId={nodeId}
                        onChange={changeDepartament}
                        key="SelectDepartment"
                      />
                    </Col>
                    <Col>
                      <Form.Item
                        key="estatus_filter"
                        name="status"
                        label="Estatus"
                      >
                        <Select
                          style={{ width: 150 }}
                          key="select"
                          options={optionStatus}
                          allowClear
                          notFoundContent={"No se encontraron resultado."}
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
                        loading={sending}
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
              <Col style={{ display: "flex" }}>
                {permissions.create && (
                  <Button
                    style={{
                      background: "#fa8c16",
                      fontWeight: "bold",
                      color: "white",
                      marginTop: "auto",
                    }}
                    onClick={() => route.push("/permission/new")}
                    key="btn_new"
                  >
                    <PlusOutlined />
                    Agregar permiso
                  </Button>
                )}
              </Col>
            </Row>
            <Row justify="end">
              <Col span={24}>
                <Table
                  dataSource={permissionsList}
                  key="tableHolidays"
                  loading={loading}
                  locale={{emptyText: loading ? "Cargando..." : "No se encontraron resultados."}}
                >
                  <Column
                    title="Colaborador"
                    dataIndex="collaborator"
                    key="id"
                    render={(collaborator, record) => (
                      <>
                        {collaborator && collaborator.first_name
                          ? collaborator.first_name + " "
                          : null}
                        {collaborator && collaborator.flast_name
                          ? collaborator.flast_name
                          : null}
                      </>
                    )}
                  />
                  <Column
                    title="Departamentos"
                    dataIndex="collaborator"
                    render={(collaborator, record) => (
                      <>
                        {collaborator.department &&
                          collaborator.department.name &&
                          collaborator.department.name}
                      </>
                    )}
                    key="department"
                  />
                  <Column
                    title="Días solicitados"
                    dataIndex="requested_days"
                    key="requested_days"
                  />
                  <Column
                    title="Estatus"
                    dataIndex="status"
                    key="status"
                    render={(status, record) =>
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
                              route.push("permission/" + record.id + "/edit")
                            }
                          />
                        ) : null}
                      </>
                    )}
                  />
                </Table>
              </Col>
            </Row>
          </>
        ) : (
          <div className="notAllowed" />
        )}{" "}
      </div>
    </MainLayout>
  );
};

export default withAuthSync(Permission);
