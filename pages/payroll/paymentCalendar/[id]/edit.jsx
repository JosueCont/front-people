import React, { useEffect, useState } from "react";
import MainLayout from "../../../../layout/MainLayout";
import { Breadcrumb, Row, Col } from "antd";
import { useRouter } from "next/router";
import FormPaymentCalendar from "../../../../components/payroll/forms/FormPaymentCalendar";
import { userCompanyId } from "../../../../libs/auth";
const EditPaymentCalendar = () => {
  const route = useRouter();
  const { id } = route.query;
  let nodeId = userCompanyId();

  useEffect(() => {}, [route.query.id]);

  return (
    <>
      <MainLayout currentKey="9.4">
        <Breadcrumb className={"mainBreadcrumb"}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
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
                nodeId={nodeId}
                idPaymentCalendar={id}
              />
            </Col>
          </Row>
        </div>
      </MainLayout>
    </>
  );
};
export default EditPaymentCalendar;
