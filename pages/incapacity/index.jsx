import React, { useEffect, useState, useLayoutEffect } from "react";
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
import moment from "moment";
import SelectDepartment from "../../components/selects/SelectDepartment";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import { connect } from "react-redux";
import WebApiPeople from "../../api/WebApiPeople";

import {
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  FileDoneOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { userCompanyId, withAuthSync } from "../../libs/auth";

const Incapacity = (props) => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  let nodeId = userCompanyId();

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [incapacityList, setIncapacityList] = useState([]);
  const [permissions, setPermissions] = useState([]);

  /* Select estatus */
  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
  ];

  useLayoutEffect(() => {
    setPermissions(props.permissions);
    setTimeout(() => {
      permissions;
    }, 5000);
  }, [props.permissions]);

  const getIncapacity = async (
    collaborator = null,
    department = null,
    status = null
  ) => {
    setLoading(true);
    let url = `?person__node__id=${nodeId}&`;
    if (collaborator) {
      url += `person__id=${collaborator}&`;
    }
    if (status) {
      url += `status=${status}&`;
    }

    if (department) {
      url += `department__id=${department}&`;
    }
    WebApiPeople.geDisabilitiesRequest(url)
      .then(function (response) {
        let data = [];
        if (response.data && response.data.length > 0) {
          data = response.data.map((item) => {
            item.key = item.id;
            return item;
          });
        }
        setIncapacityList(data);
        setLoading(false);
        setSending(false);
      })
      .catch(function (error) {
        setLoading(false);
        setSending(false);
        console.log(error);
      });
  };

  const GotoDetails = (data) => {
    route.push("incapacity/" + data.id + "/details");
  };

  const filter = async (values) => {
    setSending(true);
    setIncapacityList([]);
    getIncapacity(values.collaborator, values.department, values.status);
  };

  useEffect(() => {
    getIncapacity();
  }, [route]);

  const resetFilter = () => {
    form.resetFields();
    getIncapacity();
  };

  return (
    <MainLayout currentKey={["incapacidad"]} defaultOpenKeys={["solicitudes"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Incapacidad</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        {permissions.view ? (
          <>
            <div className="top-container-border-radius">
              <Row justify="space-between" style={{ paddingBottom: 20 }}>
                <Col>
                  <Form
                    name="filter"
                    onFinish={filter}
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
                      <Col>
                        <SelectDepartment
                          companyId={nodeId}
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
                            style={{ width: 100 }}
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
                      onClick={() => route.push("/incapacity/new")}
                      key="btn_new"
                    >
                      <PlusOutlined />
                      Agregar incapacidad
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
            <Row justify="end">
              <Col span={24}>
                <Table
                  dataSource={incapacityList}
                  key="tableHolidays"
                  scroll={{ x: 350 }}
                  loading={loading}
                  locale={{
                    emptyText: loading
                      ? "Cargando..."
                      : "No se encontraron resultados.",
                  }}
                >
                  <Column
                    title="Colaborador"
                    dataIndex="person"
                    key="id"
                    render={(person, record) => (
                      <>
                        {person && person.first_name
                          ? person.first_name + " "
                          : null}
                        {person && person.flast_name ? person.flast_name : null}
                      </>
                    )}
                  />
                  <Column
                    title="Departamento"
                    dataIndex="department"
                    key="department"
                    render={(department) => (
                      <>{department ? department.name : null}</>
                    )}
                  />
                  <Column
                    title="Fecha inicio de incapacidad"
                    dataIndex="departure_date"
                    key="date"
                    render={(departure_date) =>
                      moment(departure_date).format("DD/MMM/YYYY")
                    }
                  />
                  <Column
                    title="Documentación"
                    dataIndex="document"
                    key="docs"
                    render={(document, render) => (
                      <a href={document} target="_blank" download>
                        <FileDoneOutlined /> <small>Ver documento</small>
                      </a>
                    )}
                  />
                  <Column
                    title="Estatus"
                    key="docs"
                    dataIndex="status"
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
                              route.push("incapacity/" + record.id + "/edit")
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

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.incapacity,
  };
};

export default connect(mapState)(withAuthSync(Incapacity));
