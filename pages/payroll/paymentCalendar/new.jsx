import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { Breadcrumb, Row, Col } from "antd";
import { useRouter } from "next/router";
import FormPaymentCalendar from "../../../components/payroll/forms/FormPaymentCalendar";
import { userCompanyId } from "../../../libs/auth";
const NewPaymentCalendar = () => {
  let nodeId = userCompanyId();
  const route = useRouter();
  return (
    <>
      <MainLayout currentKey="9.4">
        <div
          className="container-border-radius"
          style={{ width: "100%", backgroundColor: "white", padding: "2%" }}
        >
          <Row justify={"space-between"} className={"formFilter"}>
            <Col span={24}>
              <FormPaymentCalendar title={"Crear"} nodeId={nodeId} />
            </Col>
          </Row>
        </div>
      </MainLayout>
    </>
  );
};
export default NewPaymentCalendar;
