import React, { useEffect, useState, useLayoutEffect } from "react";
import MainLayout from "../../layout/MainInter";
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

const Holidays = (props) => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const [holidayList, setHolidayList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [permissions, setPermissions] = useState({});

  useLayoutEffect(() => {
    setPermissions(props.permissions);
    setTimeout(() => {
      permissions;
    }, 5000);
  }, [props.permissions]);

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

    let url = `person__node__id=${props.currentNode.id}`;
    if (collaborator) {
      url += `&person__id=${collaborator}`;
    }
    if (status) {
      url += `&status=${status}&`;
    }
    if (department) {
      url += `&department__id=${department}`;
    }

    WebApiPeople.getVacationRequest(url)
      .then(function (response) {
        let data = response.data;
        data.map((item, index) => {
          item.key = index;
          return item;
        });
        setHolidayList(data);
        setLoading(false);
        setSearching(false);
      })
      .catch(function (error) {
        setHolidayList([]);
        setLoading(false);
        setSearching(false);
      });
  };

  const GotoDetails = (data) => {
    route.push("holidays/" + data.id + "/details");
  };

  const filterHolidays = async (values) => {
    setSearching(true);
    getAllHolidays(values.collaborator, values.department, values.status);
  };

  useEffect(() => {
    if (props.currentNode) {
      getAllHolidays();
    }
  }, [route, props.currentNode]);

  const resetFilter = () => {
    form.resetFields();
    getAllHolidays();
  };

  return (
    <MainLayout
      currentKey={["holidays"]}
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
        <Breadcrumb.Item>Vacaciones</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        {permissions.view ? (
          <>
            <div className="top-container-border-radius">
              <Row justify="space-between" style={{ paddingBottom: 20 }}>
                <Col span={24}>
                  <Form
                    name="filter"
                    form={form}
                    onFinish={filterHolidays}
                    layout="vertical"
                    key="formFilter"
                    className={"formFilter"}
                  >
                    <Row gutter={[24, 8]}>
                      <Col md={8} xs={12}>
                        <SelectCollaborator
                            style={{width:'100%'}}
                          name="collaborator"
                        />
                      </Col>

                      <Col md={8} xs={12}>
                        <SelectDepartment
                          name="department"
                          companyId={props.currentNode}
                        />
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
                            placeholder="Estatus"
                            notFoundContent={"No se encontraron resultados."}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={4} xs={12} >
                        <Tooltip
                            title="Filtrar"
                            color={"#3d78b9"}
                            key={"#3d78b9"}
                        >
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
                          loading={searching}
                        >
                          <SearchOutlined /> Filtrar
                        </Button>
                        </Tooltip>
                      </Col>
                      <Col md={4} xs={12} style={{ display: "flex" }}>
                        <Tooltip
                          title="Limpiar filtros"
                          color={"#3d78b9"}
                          key={"#3d78b9"}
                        >
                          <Button
                            onClick={() => resetFilter()}
                            style={{ marginTop: "auto", width:'100%' }}
                          >
                            <SyncOutlined /> Limpiar Filtro
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
                                  width:'100%',
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
                    {/* <Form.Item key="company_select_new" name="company_new" label="Empresa">
                    <SelectCompany  key="SelectCompany" />
                </Form.Item> */}
                  </Form>

                  {/*  */}
                </Col>

              </Row>
            </div>
            <Row justify="end">
              <Col span={24}>
                <Table
                  dataSource={holidayList}
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

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    permissions: state.userStore.permissions.vacation,
  };
};

export default connect(mapState)(withAuthSync(Holidays));
