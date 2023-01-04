import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainInter";
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
import { verifyMenuNewForTenant } from "../../utils/functions";

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
    let url = `?person__node__id=${props?.currentNode?.id}&`;
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
    <MainLayout
      currentKey={["permission"]}
      defaultOpenKeys={["managementRH", "concierge", "requests"]}
    >
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <>
            <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
            <Breadcrumb.Item>Concierge</Breadcrumb.Item>
          </>
        }
        <Breadcrumb.Item>Solicitudes</Breadcrumb.Item>
        <Breadcrumb.Item>Permisos</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        {permissions.view ? (
          <>
            <div className="top-container-border-radius">
              <Row justify="space-between" style={{ paddingBottom: 20 }}>
                <Col span={24}>
                  <Form
                    name="filter"
                    onFinish={filterPermission}
                    layout="vertical"
                    key="formFilter"
                    className={"formFilter"}
                    form={form}
                  >
                    <Row gutter={[24, 8]}>
                      <Col md={8} xs={12}>
                        <SelectCollaborator
                          name="collaborator"
                        />
                      </Col>
                      <Col md={8} xs={12}>
                        <SelectDepartment companyId={props?.currentNode?.id} />
                      </Col>
                      <Col md={8} xs={12}>
                        <Form.Item
                          key="estatus_filter"
                          name="status"
                          label="Estatus"
                        >
                          <Select
                            key="select"
                            options={optionStatus}
                            allowClear
                            notFoundContent={"No se encontraron resultados."}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={4} xs={12}>
                        <Button
                          style={{
                            background: "#fa8c16",
                            fontWeight: "bold",
                            color: "white",
                            width:'100%',
                            marginTop: "auto",
                          }}
                          key="buttonFilter"
                          htmlType="submit"
                          loading={sending}
                        >
                          <SearchOutlined /> Filtrar
                        </Button>
                      </Col>
                      <Col md={4} xs={12}>
                        <Tooltip
                          title="Limpiar filtros"
                          color={"#3d78b9"}
                          key={"#3d78b9"}
                        >
                          <Button
                            onClick={() => resetFilter()}
                            style={{ marginTop: "auto", marginLeft: 10, width:'100%' }}
                          >
                            <SyncOutlined /> Limpiar filtros
                          </Button>
                        </Tooltip>
                      </Col>
                      <Col md={4} xs={12}>
                        {permissions.create && (
                          <Button
                            style={{
                              background: "#fa8c16",
                              fontWeight: "bold",
                              color: "white",
                              marginTop: "auto",
                              width:'100%'
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
