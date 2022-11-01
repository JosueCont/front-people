import { useEffect, useState } from "react";
import SelectPatronalRegistration from "../../../components/selects/SelectPatronalRegistration";
import WebApiPeople from "../../../api/WebApiPeople";
import { Breadcrumb, Button, Collapse, Row, Col,Space, Spin } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import MainLayout from "../../../layout/MainLayout";
import { withAuthSync } from "../../../libs/auth";
import SuaMovements from "./suaMovements";
import EmaYEvaFiles from "./EmaYEvaFiles";
import { connect } from "react-redux";
import MovementsIMSS from "../../../components/payroll/fiscalMovements/MovementsIMSS";

const ImssMovements = ({ ...props }) => {
  const { Panel } = Collapse;
  const [ loading, setLoading ] = useState(false)
  const [currentNodeId, setCurrentNodeId] = useState(null) 
  const [patronalSelected, setPatronalSelected] = useState(null);
  const [files, setFiles ] = useState([])

  useEffect(() => {
    props.currentNode && setCurrentNodeId(props.currentNode.id)
  },[])

  useEffect(() => {
    currentNodeId && patronalSelected && getFiles()
  },[patronalSelected])

  const getFiles = () => {
    setLoading(true)
    WebApiPeople.listEbaAndEmaFiles(currentNodeId, patronalSelected)
    .then((response) => {
      setFiles(response.data.documents)
      setLoading(false)
      console.log('Response', response)
    })
    .catch((error) => {
      setLoading(false)
      console.log('error', error)
    })
  }

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
          <Breadcrumb.Item>Nómina</Breadcrumb.Item>
          <Breadcrumb.Item>Movimientos IMSS</Breadcrumb.Item>
        </Breadcrumb>
        <Spin tip="Cargando..." spinning={false}>
          <div
            className="container-border-radius"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <Collapse defaultActiveKey={['3']}>
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
              <Col span={10}>
                  <SelectPatronalRegistration
                    currentNode={currentNodeId}
                    onChange={(value) => setPatronalSelected(value)}
                  />
                </Col>
                <EmaYEvaFiles 
                  files = {files.length > 0? files : []}
                  loading = { loading }
                />
              </Panel>
              <Panel header="Consulta de movimientos al IMSS" key="3">
                <Col span={24}>
                  <MovementsIMSS/>
                </Col>
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
