import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Modal } from "antd";
import { useRouter } from "next/router";
import {
  EditOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { withAuthSync } from "../../../libs/auth";
import { Global } from "@emotion/core";
import FormPaymentCalendar from "../../../components/payroll/forms/FormPaymentCalendar";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { connect } from "react-redux";

const PaymentCalendars = ({ ...props }) => {
  const { Column } = Table;
  const route = useRouter();
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      <MainLayout currentKey={["calendario"]} defaultOpenKeys={["nómina"]}>
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
              onClick={() => {
                setTitleModal("Crear");
                setIsModalVisible(true);
                setIdPaymentCalendar(null);
              }}
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
                title="Tipo de impuesto"
                dataIndex="type_tax"
                key="type_tax"
                render={(type_tax, record) => (
                  <>
                    {type_tax && type_tax.description
                      ? type_tax.description
                      : ""}
                  </>
                )}
              />
              <Column
                title="Fecha de inicio de pago"
                dataIndex="start_date"
                key="start_date"
              />
              <Column title="Período" dataIndex="period" key="period" />
              <Column
                title="Acciones"
                key="actions"
                render={(text, record) => (
                  <>
                    <EditOutlined
                      className="icon_actions"
                      key={"goEdit" + record.id}
                      onClick={() => GotoEdit(record)}
                      style={{ color: "#fd893d" }}
                    />
                    <CalendarOutlined
                      className="icon_actions"
                      key={"goCalendar" + record.id}
                      onClick={() => GotoCalendar(record)}
                    />
                  </>
                )}
              />
            </Table>
          </Col>
        </Row>
      </MainLayout>
      <Modal
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
