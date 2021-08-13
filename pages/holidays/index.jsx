import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  Form,
  Select,
  Tooltip,
} from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";

import SelectDepartment from "../../components/selects/SelectDepartment";
import SelectCollaborator from "../../components/selects/SelectCollaboratorItemForm";

import {
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { userCompanyId, withAuthSync } from "../../libs/auth";
import jsCookie from "js-cookie";

const Holidays = () => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [holidayList, setHolidayList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [departament, setDepartament] = useState(null);
  const [permissions, setPermissions] = useState({});
  let nodeId = userCompanyId();

  /* Variables */
  const [companyId, setCompanyId] = useState(null);

  /* Select estatus */
  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
  ];

  const getAllHolidays = async (
    collaborator = null,
    department = null,
    status = null
  ) => {
    setLoading(true);
    try {
      let url = `/person/vacation/?person__job__department__node__id=${nodeId}&`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }
      if (status) {
        url += `status=${status}&`;
      }
      if (department) {
        url += `person__job__department__id=${department}&`;
      }

      let response = await Axios.get(API_URL + url);
      let data = response.data.results;
      data.map((item, index) => {
        item.key = index;
        return item;
      });

      setHolidayList(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const GotoDetails = (data) => {
    route.push("holidays/" + data.id + "/details");
  };

  const filterHolidays = async (values) => {
    setSearching(true);
    getAllHolidays(values.collaborator, values.department, values.status);
  };

  /* Eventos de componentes */
  const onChangeCompany = (val) => {
    form.setFieldsValue({
      department: null,
    });
    setCompanyId(val);
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    getAllHolidays();
  }, [route]);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.vacation.can.view")) perms.view = true;
      if (a.includes("people.vacation.can.create")) perms.create = true;
      if (a.includes("people.vacation.can.edit")) perms.edit = true;
      if (a.includes("people.vacation.can.delete")) perms.delete = true;
      if (a.includes("people.vacation.function.reject_vacation"))
        perms.reject = true;
      if (a.includes("people.vacation.function.approve_vacation"))
        perms.approve = true;
    });
    setPermissions(perms);
  };

  const resetFilter = () => {
    form.resetFields();
    getAllHolidays();
    getAllPersons();
  };

  return (
    <MainLayout currentKey="7.2">
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Vacaciones</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        {permissions.view ? (
          <>
            <Row justify="space-between" style={{ paddingBottom: 20 }}>
              <Col>
                <Form
                  name="filter"
                  form={form}
                  onFinish={filterHolidays}
                  layout="vertical"
                  key="formFilter"
                  className={"formFilter"}
                >
                  <Row gutter={[24, 8]}>
                    <Col>
                      <SelectCollaborator
                        name="collaborator"
                        style={{ width: 150 }}
                      />
                    </Col>

                    <Col>
                      <SelectDepartment
                        name="department"
                        companyId={companyId}
                        key="selectDepartament"
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
                          notFoundContent={"No se encontraron resultados."}
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
                        loading={searching}
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
                          style={{ marginTop: "auto" }}
                        >
                          <SyncOutlined />
                        </Button>
                      </Tooltip>
                    </Col>
                  </Row>
                  {/* <Form.Item key="company_select_new" name="company_new" label="Empresa">
                    <SelectCompany  key="SelectCompany" />
                </Form.Item> */}
                </Form>

                {/*  */}
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
                    onClick={() => route.push("holidays/new")}
                    key="btn_new"
                  >
                    <PlusOutlined />
                    Agregar vacaciones
                  </Button>
                )}
              </Col>
            </Row>
            <Row justify="end">
              <Col span={24}>
                <Table
                  dataSource={holidayList}
                  key="tableHolidays"
                  loading={loading}
                  locale={{
                    emptyText: loading
                      ? "Cargando..."
                      : "No se encontraron resultados.",
                  }}
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
                    dataIndex="department"
                    key="department"
                  />
                  <Column
                    title="Días solicitados"
                    dataIndex="days_requested"
                    key="days_requested"
                  />
                  <Column
                    title="Días disponibles"
                    dataIndex="available_days"
                    key="available_days"
                    render={(days, record) =>
                      record.collaborator
                        ? record.collaborator.Available_days_vacation
                        : null
                    }
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
                              route.push("holidays/" + record.id + "/edit")
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
        )}
      </div>
    </MainLayout>
  );
};

export default withAuthSync(Holidays);
