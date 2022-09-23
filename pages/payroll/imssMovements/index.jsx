import { Breadcrumb, Button, Collapse, Row, Space, Spin } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import MainLayout from "../../../layout/MainLayout";
import { withAuthSync } from "../../../libs/auth";
import SuaMovements from "./suaMovements";
import { connect } from "react-redux";

const ImssMovements = ({ ...props }) => {
  const { Panel } = Collapse;

  return (
    <>
      <MainLayout currentKey={["imssMovements"]} defaultOpenKeys={["payroll"]}>
        <Breadcrumb>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/payroll/imssMovements" })}
          >
            Movimientos IMSS
          </Breadcrumb.Item>
        </Breadcrumb>
        <Spin tip="Cargando..." spinning={false}>
          <div
            className="container-border-radius"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <Collapse>
              <Panel header="SUA" key="1">
                <Collapse
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  className="site-collapse-custom-collapse"
                >
                  <Panel
                    header="Genenrar archivo batch"
                    key="1"
                    className="site-collapse-custom-panel"
                  >
                    <SuaMovements node={props.currentNode} />
                  </Panel>
                  <Panel
                    header="Movimieintos directos"
                    key="2"
                    className="site-collapse-custom-panel"
                  >
                    <p>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Nobis beatae earum molestiae eos. Recusandae quam error,
                      odio nesciunt reprehenderit impedit odit aspernatur
                      doloribus iusto voluptas, pariatur veniam similique,
                      minima molestias!
                    </p>
                  </Panel>
                </Collapse>
              </Panel>
              <Panel header="EMA y EBA" key="2">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dignissimos, voluptatibus rerum, nostrum eveniet qui veniam
                  illum eum asperiores impedit cum hic inventore earum similique
                  temporibus optio dicta quae, quasi officiis.
                </p>
              </Panel>
            </Collapse>
          </div>
        </Spin>
      </MainLayout>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(ImssMovements));
