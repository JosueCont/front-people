import { Breadcrumb } from "antd";
import { connect } from "react-redux";
import MainLayout from "../../layout/MainLayout";

import CfdiVaucher from "../../components/payroll/cfdiVaucher";

const PayrollVoucher = () => {
  return (
    <MainLayout currentKey={["payrollVoucher"]} defaultOpenKeys={["payroll"]}>
      <Breadcrumb>
        <Breadcrumb.Item href="/home/persons">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Comprobantes fiscales</Breadcrumb.Item>
      </Breadcrumb>
      <CfdiVaucher />
    </MainLayout>
  );
};

export default PayrollVoucher;
