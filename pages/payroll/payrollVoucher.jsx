import { Breadcrumb } from "antd";
import { connect } from "react-redux";
import MainLayout from "../../layout/MainLayout";

import CfdiVaucher from "../../components/payroll/cfdiVaucher";
import React from "react";

const PayrollVoucher = () => {
  return (
    <MainLayout currentKey={["payrollVoucher"]} defaultOpenKeys={["payroll"]}>
      <Breadcrumb>
          <Breadcrumb.Item
              className={"pointer"}
              onClick={() => route.push({ pathname: "/home/persons/" })}
          >
              Inicio
          </Breadcrumb.Item>
        <Breadcrumb.Item>Nómina</Breadcrumb.Item>
        <Breadcrumb.Item>Comprobantes fiscales</Breadcrumb.Item>
      </Breadcrumb>
      <CfdiVaucher />
    </MainLayout>
  );
};

export default PayrollVoucher;
