import React, { useEffect, useState } from "react";
import MainLayout from "../../../../layout/MainLayout";
import { Breadcrumb, Row, Col } from "antd";
import { useRouter } from "next/router";
import FormPaymentCalendar from "../../../../components/payroll/forms/FormPaymentCalendar";
import { connect } from "react-redux";

const EditPaymentCalendar = ({ ...props }) => {
  const route = useRouter();
  const { id } = route.query;

  useEffect(() => {}, [route.query.id]);

  return (
    <>
      <MainLayout currentKey={["paymentCalendar"]} defaultOpenKeys={["managementRH","payroll"]}>
        <Breadcrumb className={"mainBreadcrumb"}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
          <Breadcrumb.Item>Nómina</Breadcrumb.Item>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/payroll/paymentCalendar" })}
          >
            Calendario de pagos
          </Breadcrumb.Item>
        </Breadcrumb>
        <div
          className="container-border-radius"
          style={{ width: "100%", backgroundColor: "white", padding: "2%" }}
        >
          <Row justify={"space-between"} className={"formFilter"}>
            <Col span={24}>
              <FormPaymentCalendar
                title={"Editar"}
                nodeId={props.currentNode && props.currentNode.id}
                idPaymentCalendar={id}
              />
            </Col>
          </Row>
        </div>
      </MainLayout>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(EditPaymentCalendar);
