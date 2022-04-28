import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Tooltip, Modal } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { userCompanyId, withAuthSync } from "../../../libs/auth";
// import jsCookie from "js-cookie";
import { css, Global } from "@emotion/core";
import FormPaymentCalendar from "../../../components/payroll/forms/FormPaymentCalendar";

const PaymentCalendars = () => {
  const { Column } = Table;
  const route = useRouter();
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  let nodeId = userCompanyId();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [titleModal, setTitleModal] = useState("Crear");
  const [idPaymentCalendar, setIdPaymentCalendar] = useState(null);

  const getPaymentCalendars = async () => {
    setLoading(true);
    try {
      let url = `/payroll/payment-calendar/?node=${nodeId}`;
      let response = await Axios.get(API_URL + url);
      let data = response.data.results;
      data.map((item, index) => {
        item.key = index;
        return item;
      });
      setPaymentCalendars(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const GotoEdit = (data) => {
    setIsModalVisible(true);
    setTitleModal("Editar");
    setIdPaymentCalendar(data.id);
    /* route.push("paymentCalendar/" + data.id + "/edit"); */
  };
  const GotoCalendar = (data) => {
    route.push("paymentCalendar/" + data.id + "/calendar");
  };

  useEffect(() => {
    // const jwt = JSON.parse(jsCookie.get("token"));
    // searchPermissions(jwt.perms);
    getPaymentCalendars();
  }, [route]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
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
          nodeId={nodeId}
          onCancel={handleCancel}
        />
      </Modal>
    </>
  );
};

export default withAuthSync(PaymentCalendars);
