import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainInter";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  message,
  Tooltip,
  Modal,
  Alert,
} from "antd";
import { useRouter } from "next/router";
import {
  EditOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
    ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { withAuthSync } from "../../../libs/auth";
import { Global } from "@emotion/core";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { connect } from "react-redux";
import { DeleteOutline } from "@material-ui/icons";
import { messageDeleteSuccess, messageError } from "../../../utils/constant";
import { verifyMenuNewForTenant } from "../../../utils/functions";
import ModalMassiveCalendar from "../../../components/modal/ModalMassiveCalendar";

const PaymentCalendars = ({ ...props }) => {
  const { Column } = Table;
  const route = useRouter();
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [titleModal, setTitleModal] = useState("Crear");
  const [idPaymentCalendar, setIdPaymentCalendar] = useState(null);
  const [modalCalendar, setModalCalendar] = useState(false);

  useEffect(() => {
    if (props.currentNode && props.currentNode != undefined)
      getPaymentCalendars();
  }, [props.currentNode]);

  const getPaymentCalendars = () => {
    setLoading(true);

    WebApiPayroll.getPaymentCalendar(props.currentNode.id)
      .then((response) => {
        let data = response.data.results.map((item, index) => {
          item.key = index;
          return item;
        });
        console.log('calendarios',data)
        setPaymentCalendars(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const GotoEdit = (data) => {
    setIsModalVisible(true);
    setTitleModal("Editar");
    setIdPaymentCalendar(data.id);
  };

  const handleDelteCalendar = (id) => {
    setDeleteModalVisible(true);
    setIdPaymentCalendar(id);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };

  const deleteCalendar = () => {
    setLoading(true);
    WebApiPayroll.deletePaymentCalendar(idPaymentCalendar)
      .then((response) => {
        message.success(messageDeleteSuccess);
        getPaymentCalendars();
        setLoading(false);
        setDeleteModalVisible(false);
      })
      .catch((error) => {
        setLoading(false);
        setDeleteModalVisible(false);
        message.error(messageError);
      });
  };

  return (
    <>
      <Global
        styles={`
        .ant-table{
          padding: 30px;
        }
        .ant-table-thead > tr > th.ant-table-cell{
          font-weight: 600;
          background: transparent !important;
        }
        .modal_form .ant-modal-body{
          padding-left: 60px;
          padding-right: 60px;
        }
      `}
      />
      <MainLayout
        currentKey={["paymentCalendar"]}
        defaultOpenKeys={["managementRH","payroll"]}
      >
        <Breadcrumb className={"mainBreadcrumb"}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          {verifyMenuNewForTenant() && 
            <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
          }
          <Breadcrumb.Item>Nómina</Breadcrumb.Item>
          <Breadcrumb.Item>Calendario de pagos</Breadcrumb.Item>
        </Breadcrumb>
        <Row justify="end">
          <Col>
          <Button 
            style={{
              fontWeight: "bold",
              color: "white",
              marginTop: "auto",
              marginRight:'15px',
              marginBottom:'10px',
              border: "none",
              padding: "0 30px",
              background: "#7B25F1 !important",
            }}
            onClick={() =>
              setModalCalendar(true)
            }
            key="btn_massive_calendar"
            size="large">
              <PlusCircleOutlined />
              <small style={{ marginLeft: 10 }}>Asignación masiva calendarios</small>
          </Button>
            <Button
              style={{
                fontWeight: "bold",
                color: "white",
                marginTop: "auto",
                border: "none",
                padding: "0 30px",
                background: "#7B25F1 !important",
              }}
              onClick={() =>
                route.push({
                  pathname: "/payroll/paymentCalendar/calendar/paymentCalendar",
                })
              }
              key="btn_new"
              size="large"
            >
              <PlusCircleOutlined />
              <small style={{ marginLeft: 10 }}>Agregar Calendario</small>
            </Button>
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: 30 }}>
          <Col span={24}>
            <Table
              className="table-data"
              dataSource={paymentCalendars}
              key="tablePaymentCalendar"
              loading={loading}
              scroll={{ x: 350 }}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
            >
              <Column title="Nombre" dataIndex="name" key="name" />
              <Column
                title="Periodicidad"
                dataIndex="periodicity"
                key="periodicity"
                render={(periodicity, record) => (
                  <>
                    {periodicity && periodicity.description
                      ? periodicity.description
                      : ""}
                  </>
                )}
              />
              <Column
                title="Periodo actual"
                render={(type_tax, record) => {
                  let period = record.periods.find(
                    (item) => item.active === true
                  );
                  if (!period) period = record.periods.pop();
                  return `${period.name}.- ${period.start_date} - ${period.end_date}`;
                }}
              />
              <Column
                title="Tipo de percepción"
                key="perception_type"
                render={(text, record) => {
                  return (
                    <>
                      {record.perception_type.code == "046"
                        ? "Asimilado"
                        : "Nómina"}
                    </>
                  );
                }}
              />
                <Column
                    title="Activo"
                    key="active"
                    render={(text, record) => {
                        return (
                            <>
                                {record.active
                                    ? "Si"
                                    : "No"}
                            </>
                        );
                    }}
                />
              <Column title="Año" dataIndex="period" key="period" />
              <Column
                title="Acciones"
                key="actions"
                render={(text, record) => (
                  <>
                    {/* {record.locked ? (
                      <Tooltip title="Ver detalle">
                        <EyeOutlined
                          className="icon_actions"
                          key={"goEdit" + record.id}
                          onClick={() =>
                            route.push({
                              pathname:
                                "/payroll/paymentCalendar/calendar/paymentCalendar",
                              query: {
                                calendar_id: record.id,
                                id: props.currentNode.id,
                              },
                            })
                          }
                          style={{ color: "#fd893d" }}
                        />
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip title="Editar">
                          <EditOutlined
                            className="icon_actions"
                            key={"goEdit" + record.id}
                            onClick={() =>
                              route.push({
                                pathname:
                                  "/payroll/paymentCalendar/calendar/paymentCalendar",
                                query: {
                                  calendar_id: record.id,
                                  id: props.currentNode.id,
                                },
                              })
                            }
                            style={{ color: "#fd893d" }}
                          />
                        </Tooltip>
                      </>
                    )} */}
                      {
                        record.active && 
                        <>
                          <Tooltip title="Editar">
                            <EditOutlined
                              className="icon_actions"
                              key={"goEdit" + record.id}
                              onClick={() =>
                                route.push({
                                  pathname:
                                    `/payroll/paymentCalendar/${record.id}/edit/`,
                                  query: {
                                    calendar_id: record.id,
                                    id: props.currentNode.id,
                                  },
                                })
                              }
                              style={{ color: "#fd893d" }}
                            />
                          </Tooltip>
                        </>
                      }
                       
                    <Tooltip title="Ver calendario">
                      <CalendarOutlined
                        className="icon_actions"
                        key={"goCalendar" + record.id}
                        onClick={() =>
                          route.push({
                            pathname: `paymentCalendar/calendar/calendar`,
                            query: {
                              id: record.id,
                            },
                          })
                        }
                      />
                    </Tooltip>
                    {!record.locked && (
                      <Tooltip title="Eliminar">
                        <DeleteOutline
                          style={{ fontSize: "19px", marginBottom: "-5px", cursor:'pointer' }}
                          className="icon_actions"
                          key={"delCalendar" + record.id}
                          onClick={() => handleDelteCalendar(record.id)}
                        />
                      </Tooltip>
                    )}
                  </>
                )}
              />
            </Table>
          </Col>
        </Row>
      </MainLayout>
      {/* <Modal
        className="modal_form"
        width={1000}
        destroyOnClose
        footer=""
        title=""
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <FormPaymentCalendar
          idPaymentCalendar={idPaymentCalendar}
          getPaymentCalendars={getPaymentCalendars}
          setIsModalVisible={setIsModalVisible}
          title={titleModal}
          nodeId={props.currentNode && props.currentNode.id}
          onCancel={handleCancel}
        />
      </Modal> */}
      <Modal
        className="modal_form"
        width={500}
        destroyOnClose
        visible={deleteModalVisible}
        onCancel={handleDeleteCancel}
        onOk={() => deleteCalendar()}
        maskClosable={false}
        confirmLoading={loading}
        centered
        okText="Sí, eliminar"
        cancelText="Cancelar"
      >
          <Row justify="center" align="middle">
              <Col span={4}>
                  <ExclamationCircleOutlined style={{ fontSize: '40px', color: '#FAAD14' }} twoToneColor="#eb2f96" />
              </Col>
              <Col span={20} style={{textAlign: "left", width: "100%"}}>
                  <h3>¿Está seguro de eliminar este calendario?</h3>
                  <p style={{textAlign: "left", paddingLeft: 15}}>
                      Al eliminar este calendario no se podrá recuperar
                  </p>
              </Col>
          </Row>
      </Modal>
      <ModalMassiveCalendar 
        visible={modalCalendar}
        setVisible={() => setModalCalendar(false)}
        calendars={paymentCalendars}/>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(PaymentCalendars));
