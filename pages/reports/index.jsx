import React from "react";
import MainLayout from "../../layout/MainInter";
import { Row, Col, Breadcrumb, Tabs } from "antd";
import { useRouter } from "next/router";

import CollaboratorsReport from "../../components/reports/Collaborators";
import PayrollReport from "../../components/reports/Payroll";
import LoanReport from "../../components/reports/Loan";
import HolidaysReport from "../../components/reports/Holidays";
import InabilityReport from "../../components/reports/Inability";
import PermissionsReport from "../../components/reports/Permissions";
import ProvisionsReport from "../../components/reports/Provision";

import { withAuthSync } from "../../libs/auth";

import UsersIcon from "../../components/icons/Users";
import HolidayIcon from "../../components/icons/Holidays";
import NominaIcon from "../../components/icons/NominaIcon";
import LoanIcon from "../../components/icons/Loan";
import HealthIcon from "../../components/icons/Health";
import PermissionIcon from "../../components/icons/Permissions";
import ProvisionIcon from "../../components/icons/Provision";
import { verifyMenuNewForTenant } from "../../utils/functions";

const Reports = () => {
  const route = useRouter();
  const { TabPane } = Tabs;

  return (
    <MainLayout currentKey={["reports"]} defaultOpenKeys={["utilities","reports"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <Breadcrumb.Item>Utilidades-Configuración</Breadcrumb.Item>
        }
        <Breadcrumb.Item>Reportes</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row>
          <Col span={24}>
            <Tabs
              defaultActiveKey="1"
              tabPosition="left"
              className="tabReports"
            >
              {/*<TabPane tab={<UsersIcon />} key="1">*/}
              {/*  <CollaboratorsReport />*/}
              {/*</TabPane>*/}
              <TabPane tab={<NominaIcon />} key="2">
                <PayrollReport />
              </TabPane>
              <TabPane tab={<LoanIcon />} key="3">
                <LoanReport />
              </TabPane>
              <TabPane tab={<HolidayIcon />} key="4">
                <HolidaysReport />
              </TabPane>
              <TabPane tab={<HealthIcon />} key="5">
                <InabilityReport />
              </TabPane>
              <TabPane tab={<PermissionIcon />} key="6">
                <PermissionsReport />
              </TabPane>
              <TabPane tab={<ProvisionIcon />} key="7">
                <ProvisionsReport />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(Reports);
