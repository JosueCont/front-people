import { Breadcrumb, Spin, Typography, Tabs } from "antd";
import { useRouter } from "next/router";
import React, { useLayoutEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { withAuthSync } from "../../libs/auth";
import TaxInformationForm from "../../components/payroll/forms/TaxInformationForm";
import { connect } from "react-redux";
import GeneralData from "../../components/business/GeneralData";

const ConfigCompany = ({ ...props }) => {
  let router = useRouter();
  const [company, setCompany] = useState();
  const [fiscal, setFiscal] = useState(false);
  const { Title } = Typography;
  const { TabPane } = Tabs;

  useLayoutEffect(() => {
    if (props.config) setFiscal(props.config.nomina_enabled);
  }, [props.config]);

  return (
    <MainLayout currentKey="2">
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/business" })}
        >
          Empresas
        </Breadcrumb.Item>
        <Breadcrumb.Item className={"pointer"}>
          Datos de la empresa
        </Breadcrumb.Item>
      </Breadcrumb>
      <Spin tip="Cargando..." spinning={false}>
        <div
          className="container-border-radius"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          {company && <Title level={3}>{company}</Title>}

          <Tabs tabPosition={"left"}>
            <TabPane tab="General" key="tab_1">
              <GeneralData config={props.config} setCompany={setCompany} />
            </TabPane>
            <TabPane tab="Fiscal" key="tab_2">
              <TaxInformationForm node_id={router.query.id} fiscal={fiscal} />
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
  };
};

export default connect(mapState)(withAuthSync(ConfigCompany));
