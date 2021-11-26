import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Tooltip } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { userCompanyId } from "../../../libs/auth";
// import jsCookie from "js-cookie";

const PaymentCalendars = () => {
  const { Column } = Table;
  const route = useRouter();
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  let nodeId = userCompanyId();

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
    route.push("paymentCalendar/" + data.id + "/edit");
  };
  const GotoCalendar = (data) => {
    route.push("paymentCalendar/" + data.id + "/calendar");
  };

  useEffect(() => {
    // const jwt = JSON.parse(jsCookie.get("token"));
    // searchPermissions(jwt.perms);
    getPaymentCalendars();
  }, [route]);

  return (
    <MainLayout currentKey={["calendario"]} defaultOpenKeys={["nomina"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Calendario de pagos</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <>
          <Row justify="space-between" style={{ paddingBottom: 20 }}>
            <Col style={{ display: "flex" }}>
              <Button
                style={{
                  background: "#fa8c16",
                  fontWeight: "bold",
                  color: "white",
                  marginTop: "auto",
                }}
                onClick={() => route.push("paymentCalendar/new")}
                key="btn_new"
              >
                <PlusOutlined />
                Agregar Calendario
              </Button>
            </Col>
          </Row>
          <Row justify="end">
            <Col span={24}>
              <Table
                dataSource={paymentCalendars}
                key="tablePaymentCalendar"
                loading={loading}
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
                  render={(periodicity, record) =>
                    periodicity === 1
                      ? "Diario"
                      : periodicity === 2
                      ? "Semanal"
                      : periodicity === 3
                      ? "Decenal"
                      : periodicity === 4
                      ? "Catorcenal"
                      : periodicity === 5
                      ? "Quincenal"
                      : periodicity === 6
                      ? "Mensual"
                      : "Anual"
                  }
                />
                <Column
                  title="Tipo de impuesto"
                  dataIndex="type_tax.name"
                  key="type_tax"
                  render={(type_tax, record) => (
                    <>{type_tax && type_tax.name ? type_tax.name : null}</>
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
        </>
      </div>
    </MainLayout>
  );
};

export default PaymentCalendars;
