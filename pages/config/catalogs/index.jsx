import { withAuthSync } from "../../../libs/auth";
import MainLayout from "../../../layout/MainLayout";
import { Breadcrumb, Tabs, Card, Tooltip } from "antd";
import {
  ApartmentOutlined,
  GoldOutlined,
  UserOutlined,
  UserSwitchOutlined,
  FileOutlined,
  PicRightOutlined,
  DollarCircleOutlined,
  ReadOutlined,
  TagsOutlined
} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Router from "next/router";
import { connect } from "react-redux";
import { doCompanySelectedCatalog } from "../../../redux/catalogCompany";

import Levels from "../../../components/catalogs/Levels";
import WorkTitle from "../../../components/catalogs/WorkTitle";
import Departaments from "../../../components/catalogs/Departaments";
import TabJobs from "../../../components/catalogs/Jobs";
import PersonTypes from "../../../components/catalogs/PersonTypes";
import Relationship from "../../../components/catalogs/Relationship";
import DocumentsTypes from "../../../components/catalogs/DocumentsTypes";
import FixedConcepts from "../../../components/catalogs/FixedConcepts";
import InternalConcepts from "../../../components/catalogs/InternalConcepts";
import CostCenterCatalog from "../../../components/catalogs/CostCenterCatalog";
import TagCatalog from "../../../components/catalogs/TagCatalog";
import AccountantAccountCatalog from "../../../components/catalogs/AccountantAccountCatalog";

const configBusiness = ({ ...props }) => {
  const { TabPane } = Tabs;

  return (
    <>
      <MainLayout currentKey={["catalogos"]} defaultOpenKeys={["config"]}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => Router.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Catálogos</Breadcrumb.Item>
        </Breadcrumb>

        <div
          className="site-layout-background"
          style={{ minHeight: 380, height: "100%" }}
        >
          <Card bordered={true}>
            <>
              <Title style={{ fontSize: "25px" }}>
                Catálogos de {props.currentNode && props.currentNode.name}
              </Title>
              <Tabs onChange={(tab)=> console.log(tab)} tabPosition={"left"}>
                {props.permissions.department.view && (
                  <TabPane
                    tab={
                      <Tooltip title="Departamentos">
                        <div className="container-title-tab">
                          <GoldOutlined />
                          <div className="text-title-tab">Departamentos</div>
                        </div>
                      </Tooltip>
                    }
                    key="tab_1"
                  >
                    <Departaments
                      permissions={props.permissions.department}
                      currentNode={props.currentNode}
                      doCompanySelectedCatalog={doCompanySelectedCatalog}
                    />
                  </TabPane>
                )}

                {props.permissions.job.view && (
                  <TabPane
                    tab={
                      <Tooltip title="Puestos de trabajo">
                        <div className="container-title-tab">
                          <ApartmentOutlined />
                          <div className="text-title-tab">
                            Puestos de trabajo
                          </div>
                        </div>
                      </Tooltip>
                    }
                    key="tab_2"
                  >
                    <TabJobs
                      permissions={props.permissions.job}
                      currentNode={props.currentNode}
                      doCompanySelectedCatalog={doCompanySelectedCatalog}
                    />
                  </TabPane>
                )}
                {props.permissions.person_type.view && (
                  <TabPane
                    tab={
                      <Tooltip title="Tipos de persona">
                        <div className="container-title-tab">
                          <UserOutlined />
                          <div className="text-title-tab">
                            Tipos de personas
                          </div>
                        </div>
                      </Tooltip>
                    }
                    key="tab_3"
                  >
                    <PersonTypes
                      permissions={props.permissions.person_type}
                      currentNode={props.currentNode}
                      doCompanySelectedCatalog={doCompanySelectedCatalog}
                    />
                  </TabPane>
                )}

                {props.permissions.relationship.view && (
                  <TabPane
                    tab={
                      <Tooltip title="Parentescos">
                        <div className="container-title-tab">
                          <UserSwitchOutlined />
                          <div className="text-title-tab">Parentescos</div>
                        </div>
                      </Tooltip>
                    }
                    key="tab_4"
                  >
                    <Relationship
                      permissions={props.permissions.relationship}
                      currentNode={props.currentNode}
                      doCompanySelectedCatalog={doCompanySelectedCatalog}
                    />
                  </TabPane>
                )}

                {props.permissions.document_type.view && (
                  <TabPane
                    tab={
                      <Tooltip title="Tipos de documento">
                        <div className="container-title-tab">
                          <FileOutlined />
                          <div className="text-title-tab">
                            Tipos de documento
                          </div>
                        </div>
                      </Tooltip>
                    }
                    key="tab_5"
                  >
                    <DocumentsTypes
                      permissions={props.permissions.document_type}
                      currentNode={props.currentNode}
                      doCompanySelectedCatalog={doCompanySelectedCatalog}
                    />
                  </TabPane>
                )}

                <TabPane
                  tab={
                    <Tooltip title="Departamentos">
                      <div className="container-title-tab">
                        <GoldOutlined />
                        <div className="text-title-tab">Plazas</div>
                      </div>
                    </Tooltip>
                  }
                  key="tab_6"
                >
                  <Tabs defaultActiveKey="1" type="card" size={"small"}>
                    <TabPane tab="Plazas" key={"1"}>
                      <WorkTitle
                        style={{ marginTop: "10px" }}
                        currentNode={props.currentNode}
                        doCompanySelectedCatalog={doCompanySelectedCatalog}
                      />
                    </TabPane>
                    <TabPane tab="Niveles" key={"2"}>
                      <Levels
                        style={{ marginTop: "10px" }}
                        currentNode={props.currentNode}
                        doCompanySelectedCatalog={doCompanySelectedCatalog}
                      />
                    </TabPane>
                  </Tabs>
                </TabPane>
                <TabPane
                  tab={
                    <Tooltip title="Conceptos internos">
                      <div className="container-title-tab">
                        <PicRightOutlined />
                        <div className="text-title-tab">Conceptos internos</div>
                      </div>
                    </Tooltip>
                  }
                  key="tab_7"
                >
                  <InternalConcepts
                    permissions={props.permissions.document_type}
                    currentNode={props.currentNode}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <Tooltip title="Conceptos fijos">
                      <div className="container-title-tab">
                        <PicRightOutlined />
                        <div className="text-title-tab">Conceptos fijos</div>
                      </div>
                    </Tooltip>
                  }
                  key="tab_8"
                >
                  <FixedConcepts
                    permissions={props.permissions.document_type}
                    currentNode={props.currentNode}
                    doCompanySelectedCatalog={doCompanySelectedCatalog}
                  />
                </TabPane>


                <TabPane
                    tab={
                      <Tooltip title="Cuentas contables">
                        <div className="container-title-tab">
                          <ReadOutlined/>
                          <div className="text-title-tab">
                            Cuentas contables
                          </div>
                        </div>
                      </Tooltip>
                    }
                    key="tab_9"
                >
                  <AccountantAccountCatalog
                      currentNode={props.currentNode}
                      doCompanySelectedCatalog={doCompanySelectedCatalog}
                  />
                </TabPane>

                <TabPane
                    tab={
                      <Tooltip title="Centros de costo">
                        <div className="container-title-tab">
                          <DollarCircleOutlined/>
                          <div className="text-title-tab">
                            Centros de costos
                          </div>
                        </div>
                      </Tooltip>
                    }
                    key="tab_10"
                >
                  <CostCenterCatalog
                      currentNode={props.currentNode}
                      doCompanySelectedCatalog={doCompanySelectedCatalog}
                  />
                </TabPane>
                <TabPane
                    tab={
                      <Tooltip title="Etiquetas">
                        <div className="container-title-tab">
                          <TagsOutlined />
                          <div className="text-title-tab">
                            Etiquetas
                          </div>
                        </div>
                      </Tooltip>
                    }
                    key="tab_11"
                >
                  <TagCatalog
                      currentNode={props.currentNode}
                      doCompanySelectedCatalog={doCompanySelectedCatalog}
                  />
                </TabPane>
                )

              </Tabs>
            </>
          </Card>
        </div>
      </MainLayout>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    permissions: state.userStore.permissions,
  };
};

export default connect(mapState, { doCompanySelectedCatalog })(
  withAuthSync(configBusiness)
);
