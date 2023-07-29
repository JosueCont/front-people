import { Breadcrumb, Spin, Typography, Tabs, Row, Button } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainInter";
import { withAuthSync } from "../../../libs/auth";
import { connect } from "react-redux";
import GeneralData from "../../../components/business/GeneralData";
import WebApiPeople from "../../../api/WebApiPeople";
import FiscalInformationNode from "../../../components/payroll/FiscalInformationNode";
import PatronalRegistration from "../../../components/payroll/PatronalRegistration";
import NonWorkingDays from "../../../components/business/NonWorkingDays";
import PayrollSpread from '../../../components/business/PayrollSpread'
import PayrollSheets from '../../../components/business/PayrollSheets'
import WorkingDays from "../../../components/business/WorkingDays";
import UiStore from "../../../components/business/UiStore";

const ConfigCompany = ({ ...props }) => {
  let router = useRouter();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState();
  const { Title } = Typography;
  const { TabPane } = Tabs;
  const [activeKey, setActiveKey] = useState(props.config && props.config.nomina_enabled ? "2" : "1");
  const applications = props && props.config && props.config.applications || []
  // Revisa que este habilitada la aplicación IUSS y este activa. si esta activa se mostrará el tab de UI Store
  let enableStore = applications.some((app) => app.app === 'IUSS' && app.is_active  )

  useEffect(() => {
    if (router.query.tab) {
      let tab  = String(router.query.tab) === "2" && props.config && !props.config.nomina_enabled ? "1" :  String(router.query.tab)
      setActiveKey(tab);
    }
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

  console.log('Props config', applications)

  return (
    <MainLayout currentKey={["business"]} defaultOpenKeys={["strategyPlaning","company"]}>
      {props.currentNode == null && (
        <Row align="end">
          <Button onClick={() => router.push("/select-company")}>
            Regresar
          </Button>
        </Row>
      )}
      {props.currentNode && (
        <Breadcrumb>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => router.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Empresa</Breadcrumb.Item>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => router.push({ pathname: "/business/companies" })}
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
            { props.config && props.config.nomina_enabled &&
              <TabPane tab="Información fiscal" key={"2"}>
                <FiscalInformationNode node_id={company && company.id} />
              </TabPane>
            }
            <TabPane tab="General" key={"1"}>
              <GeneralData node_id={company && company.id} />
            </TabPane>
            <TabPane tab="Días inhábiles" key={"3"}>
              <NonWorkingDays node_id={company && company.id} />
            </TabPane>
            <TabPane tab="Días laborables" key={"4"}>
              <WorkingDays node_id={company && company.id} />
            </TabPane>
            {
              enableStore &&

              <TabPane tab="UI Store" key={"5"}>
                <UiStore  node_id={company && company.id} />
              </TabPane>
            }
            { props.config && props.config.nomina_enabled &&
              <TabPane tab="Dispersión bancaria" key={"6"}>
                <PayrollSpread node_id={company && company.id} />
              </TabPane>
            }

              <TabPane tab="Folios" key={"7"}>
                <PayrollSheets node_id={company && company.id} />
              </TabPane>

            {/* <TabPane tab="Registro patronal" key={"3"}>
              <PatronalRegistration node_id={company && company.id} />
            </TabPane> */}
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
