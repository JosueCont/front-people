import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  Form,
  Tooltip,
  Select,
} from "antd";
import {
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import SelectDepartment from "../../components/selects/SelectDepartment";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
import WebApiPeople from "../../api/WebApiPeople";

const Permission = ({ permissions, ...props }) => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [permissionsList, setPermissionsList] = useState([]);

  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
  ];

  const getPermissions = async (
    collaborator = null,
    department = null,
    status = null
  ) => {
    setLoading(true);
    let url = `?person__node__id=${props.currentNode.id}&`;
    if (collaborator) {
      url += `person__id=${collaborator}&`;
    }
    if (status) {
      url += `status=${status}&`;
    }

    if (department) {
      url += `department__id=${department}&`;
    }
    WebApiPeople.gePermitsRequest(url)
      .then(function (response) {
        let data = response.data;
        setPermissionsList(data);
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
    route.push("permission/" + data.id + "/details");
  };

  const filterPermission = async (values) => {
    setSending(true);
    setPermissionsList([]);
    getPermissions(values.collaborator, values.department, values.status);
  };

  useEffect(() => {
    if (props.currentNode) getPermissions();
  }, [props.currentNode]);

  const resetFilter = () => {
    form.resetFields();
    getPermissions();
  };

  return (
    <MainLayout currentKey={["permission"]} defaultOpenKeys={["requests"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Permisos</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        {permissions.view ? (
          <>
            <div className="top-container-border-radius">
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
                      <Col>
                        <SelectDepartment
                          companyId={props.currentNode.id}
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
                  </Form>
                </Col>
              </Row>
            </div>
            <Row justify="end">
              <Col span={24}>
                <Table
                  dataSource={permissionsList}
                  key="tableHolidays"
                  loading={loading}
                  scroll={{ x: 350 }}
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
                    title="Departamento"
                    dataIndex="department"
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
        )}
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.permit,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(Permission));
