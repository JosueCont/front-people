import { Breadcrumb, Spin, Typography, Tabs } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { withAuthSync } from "../../libs/auth";
import FiscalInformationNode from "../../components/payroll/forms/FiscalInformationNode";
import { connect } from "react-redux";
import GeneralData from "../../components/business/GeneralData";
import WebApiPeople from "../../api/WebApiPeople";

const ConfigCompany = ({ ...props }) => {
  let router = useRouter();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState();
  const { Title } = Typography;
  const { TabPane } = Tabs;
  const [activeKey, setActiveKey] = useState("1");

  useEffect(() => {
    if (router.query.tab) setActiveKey(String(router.query.tab));
    if (router.query.id)
      WebApiPeople.getCompany(router.query.id)
        .then(function (response) {
          setCompany(response.data);
          setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
  }, [router.query]);

  return (
    <MainLayout currentKey="2">
      {props.currentNode && (
        <Breadcrumb>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => router.push({ pathname: "/home/persons/" })}
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
      )}
      <Spin tip="Cargando..." spinning={loading}>
        <div
          className="container-border-radius"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          {company && <Title level={3}>{company.name}</Title>}
          <Tabs
            tabPosition={"left"}
            onChange={(value) => setActiveKey(value)}
            activeKey={activeKey}
          >
            <TabPane tab="General" key={"1"}>
              <GeneralData />
            </TabPane>
            <TabPane tab="Informacion fiscal" key={"2"}>
              <FiscalInformationNode node_id={company && company.id} />
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
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(ConfigCompany));
