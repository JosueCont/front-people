import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, message, Tooltip, Modal, Alert } from "antd";
import { useRouter } from "next/router";
import {
  EditOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { withAuthSync } from "../../../libs/auth";
import { Global } from "@emotion/core";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { connect } from "react-redux";
import { DeleteOutline } from "@material-ui/icons";
import { messageDeleteSuccess, messageError } from "../../../utils/constant";

const PaymentCalendars = ({ ...props }) => {
  const { Column } = Table;
  const route = useRouter();
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [titleModal, setTitleModal] = useState("Crear");
  const [idPaymentCalendar, setIdPaymentCalendar] = useState(null);

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
  const GotoCalendar = (data) => {
    route.push("paymentCalendar/" + data.id + "/calendar");
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelteCalendar = (id) => {
    setDeleteModalVisible(true)
    setIdPaymentCalendar(id)
  }
  
  const handleDeleteCancel = () => {
    setDeleteModalVisible(false)
  }

const deleteCalendar = () => {
  setLoading(true);
  WebApiPayroll.deletePaymentCalendar(idPaymentCalendar)
  .then((response) => {
    message.success(messageDeleteSuccess);
    getPaymentCalendars();
    setLoading(false);
    setDeleteModalVisible(false)
   })
   .catch((error) => {
     setLoading(false);
     setDeleteModalVisible(false)
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
      <MainLayout currentKey={["calendario"]} defaultOpenKeys={["payroll"]}>
        <Breadcrumb className={"mainBreadcrumb"}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Calendario de pagos</Breadcrumb.Item>
        </Breadcrumb>
        <Row justify="end">
          <Col>
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
              <Column title="Año" dataIndex="period" key="period" />
              <Column
                title="Acciones"
                key="actions"
                render={(text, record) => (
                  <>
                    {record.locked ? (
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
                    )}
                    <Tooltip title="Ver calendario">
                      <CalendarOutlined
                        className="icon_actions"
                        key={"goCalendar" + record.id}
                        onClick={() => GotoCalendar(record)}
                      />
                    </Tooltip>
                    {!record.locked && (
                      <Tooltip title="Eliminar">
                        <DeleteOutline
                          style={{ fontSize: "22px", marginBottom: "-5px" }}
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
        title="Eliminar calendario de pagos"
        className="modal_form"
        width={500}
        destroyOnClose
        visible={deleteModalVisible}
        onCancel={handleDeleteCancel}
        onOk={() => deleteCalendar()}
        maskClosable={false}
        confirmLoading={loading}
        centered
        okText="Si, eliminar"
        cancelText="Cancelar"
      >
        <Row justify="center" align="middle">
          <Col span={24} style={{textAlign: 'center', width: '100%'}}>
            <Alert
              type="warning"
              showIcon
              message="¿Está seguro de eliminar este calendario?"
              description={
                <p style={{textAlign: 'justify', paddingLeft: 45}}>
                  Al eliminar este calendario no se podra recuperar
                </p>
              }
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(PaymentCalendars));
