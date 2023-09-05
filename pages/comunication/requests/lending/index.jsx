import React, { useEffect, useState } from "react";
import MainLayout from "../../../../layout/MainInter";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  Form,
  Select,
  Alert,
  Tooltip,
  ConfigProvider
} from "antd";
import {
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import SelectCollaborator from "../../../../components/selects/SelectCollaborator";
import moment from "moment";
import { withAuthSync } from "../../../../libs/auth";
import { connect } from "react-redux";
import WebApiPayroll from "../../../../api/WebApiPayroll";
import { verifyMenuNewForTenant } from "../../../../utils/functions";
import esES from "antd/lib/locale/es_ES";
import WidgetPayRollCalendar from "../../../../components/dashboard/WidgetPayRollCalendar";

const Lending = ({ ...props }) => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const [lendingList, setLendingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
    { value: 4, label: "Pagado", key: "opt_4" },
  ];

  const typeOptions = [{ value: "EMP", label: "Empresa", key: "type1" }];

  const getLending = async (personID = null, type = null, status = null) => {
    setLoading(true);
    let url = `?node__id=${props.currentNode.id}&`;
    if (personID) {
      url += `person__id=${personID}&`;
    }

    if (type) {
      url += `type=${type}&`;
    }

    if (status) {
      url += `status=${status}`;
    }
    WebApiPayroll.getLoanRequest(url)
      .then(function (response) {
        setLendingList(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const filter = async (values) => {
    getLending(values.person, values.type, values.status);
  };

  const GotoDetails = (item) => {
    route.push(`lending/${item.id}/details`);
  };

  useEffect(() => {
    if (props.currentNode) getLending();
  }, [props.currentNode]);

  const resetFilter = () => {
    form.resetFields();
    getLending();
  };

  return (
    <>
      {props.permissions && props.configPermissions && (
        <MainLayout
          currentKey={["lending"]}
          defaultOpenKeys={["managementRH","concierge","requests"]}
        >
          {
              props.config && props.config.applications.find(
                  (item) => item.app === "PAYROLL" && item.is_active
              ) && <Alert message="Esta sección no se encuentra conectada con el módulo de nómina. Se puede hacer uso de ella de manera administrativa. " type="info" banner/>
          }


          <Breadcrumb className={"mainBreadcrumb"} key="mainBreadcrumb">
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
            <Breadcrumb.Item>Préstamos</Breadcrumb.Item>
          </Breadcrumb>
          <div className="container" style={{ width: "100%" }}>

            {props.permissions.view ? (
              <>
                <div className="top-container-border-radius">

                  <Row
                    justify="space-between"
                    key="row1"
                    style={{ paddingBottom: 20 }}
                  >
                    <Col>
                      <Form
                        form={form}
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
                                notFoundContent={
                                  "No se encontraron resultados."
                                }
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
                                notFoundContent={
                                  "No se encontraron resultados."
                                }
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
                      {props.configPermissions.view && (
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
                      {props.permissions.create && (
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
                </div>
                <Row justify={"end"}>
                  <Col span={24}>
                    <ConfigProvider locale={esES}>
                    <Table
                      dataSource={lendingList}
                      key="table_holidays"
                      loading={loading}
                      pagination={{showSizeChanger:true}}
                      scroll={{ x: 350 }}
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
                        render={(person) =>
                          person.first_name + " " + person.flast_name
                        }
                      ></Column>
                      <Column
                        title="Tipo de préstamo"
                        dataIndex="type"
                        key="type"
                        render={(type) =>
                          type === "EMP" ? "Empresa" : "E-Pesos"
                        }
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
                          periodicity === 2
                            ? "Semanal"
                            : periodicity === 3
                            ? "Catorcenal"
                            : periodicity === 4
                            ? "Quincenal"
                            : periodicity === 10
                            ? "Decenal"
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
                            : status === 3
                            ? "Rechazado"
                            : "Pagado"
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
                            {props.permissions.edit && record.status == 1 ? (
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
                    </ConfigProvider>
                  </Col>
                </Row>
              </>
            ) : (
              <div className="notAllowed" />
            )}
          </div>
        </MainLayout>
      )}
    </>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.loan,
    configPermissions: state.userStore.permissions.loanconfigure,
    currentNode: state.userStore.current_node,
    config: state.userStore?.general_config
  };
};

export default connect(mapState)(withAuthSync(Lending));
