import { Breadcrumb } from "antd";
import { connect } from "react-redux";
import MainLayout from "../../layout/MainInter";

import CfdiVaucher from "../../components/payroll/cfdiVaucher";
import React from "react";
import { verifyMenuNewForTenant } from "../../utils/functions";

const PayrollVoucher = () => {
  return (
    <MainLayout currentKey={["payrollVoucher"]}  defaultOpenKeys={["managementRH","payroll"]}>
      <Breadcrumb>
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
        <Breadcrumb.Item>Comprobantes fiscales</Breadcrumb.Item>
      </Breadcrumb>
      <CfdiVaucher />
    </MainLayout>
  );
};

export default PayrollVoucher;
