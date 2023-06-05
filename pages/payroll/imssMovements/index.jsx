import { useEffect, useState } from "react";
import SelectPatronalRegistration from "../../../components/selects/SelectPatronalRegistration";
import WebApiPeople from "../../../api/WebApiPeople";
import {
  Breadcrumb,
  Button,
  Collapse,
  Row,
  Col,
  Space,
  Spin,
  Checkbox,
  message,
  Modal,
  Typography, Alert, Divider,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import MainLayout from "../../../layout/MainInter";
import { withAuthSync } from "../../../libs/auth";
import SuaMovements from "./suaMovements";
import EmaYEvaFiles from "./EmaYEvaFiles";
import { connect } from "react-redux";
import MovementsIMSS from "../../../components/payroll/fiscalMovements/MovementsIMSS";
import UploadFile from "../../../components/UploadFile";
import MovementsSection from "../../../components/payroll/ImssMovements/MovementsSection";
import ButtonAltaImssImport from "../../../components/payroll/ImportGenericButton/ButtonAltaImssImport";
import { verifyMenuNewForTenant } from "../../../utils/functions";
import { useRouter } from "next/router";
const { Text } = Typography;

const ImssMovements = ({ ...props }) => {
  const { Panel } = Collapse;
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [patronalSelected, setPatronalSelected] = useState(null);
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0)
  const [file, setFile] = useState(null);
  const [saveRiskPremium, setSaveRiskPremium] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   props.currentNode && setCurrentNodeId(props.currentNode.id)
  // },[])

  useEffect(() => {
    if(router?.query?.regPatronal){
      setPatronalSelected(router?.query?.regPatronal)
    }

  },[router.query])

  useEffect(() => {
    if (file) {
      setShowList(true);
    } else {
      setShowList(false);
    }
  }, [file]);

  useEffect(() => {
    patronalSelected && props?.currentNode?.id && getFiles();
  }, [patronalSelected, props?.currentNode?.id]);

  const getFiles = (offset=0) => {
    setLoading(true);
    WebApiPeople.listEbaAndEmaFiles(props?.currentNode?.id, patronalSelected, offset)
      .then((response) => {
        setFiles(response.data.results);
        setTotalFiles(response?.data?.count)
        
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const syncEmaandEva = async () => {
    setLoading(true);
    let data = new FormData();

    data.append("node", props.currentNode.id);
    data.append("patronal_registration", patronalSelected);

    try {
      let response = await WebApiPeople.forceListEbaAndEmaFiles(data);
      message.success(
        "Solicitud de Emisiones realizada con éxito, verifique mas tarde sus documentos"
      );
    } catch (error) {
      message.error("Error al pedir las emsiones. Intente más tarde");
    } finally {
      setLoading(false);
    }
  };

  const importEBAEMAFiles = async () => {
    setLoading(true);
    let data = new FormData();
    data.append("node", props.currentNode.id);
    data.append("save_risk_premium", saveRiskPremium);
    data.append("patronal_registration", patronalSelected);
    data.append("File", file);

    try {
      let response = await WebApiPeople.importEMAandEvaFiles(data);
      if (response) {
        message.success("Importacion correcta");
        getFiles();
      }
    } catch (error) {
      message.error("La importación no se realizó, porfavor revise su archivo.");
    } finally {
      setLoading(false);
      setModalVisible(false);
      setFile(null);
    }
  };


  const changePage = (page, pageSize) => {
    let offset = (page -1) * pageSize
    getFiles(offset)
  } 

  return (
    <>
      <MainLayout
        currentKey={["imssMovements"]}
        defaultOpenKeys={["managementRH", "payroll"]}
      >
        <Breadcrumb>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          {verifyMenuNewForTenant() && (
            <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
          )}
          <Breadcrumb.Item>Nómina</Breadcrumb.Item>
          <Breadcrumb.Item>Movimientos IMSS</Breadcrumb.Item>
        </Breadcrumb>
        <Spin tip="Cargando..." spinning={false}>
          <div
            className="container-border-radius"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <Divider> <img src={'/images/logo_imss.png'} width={40}/> Movimientos de IMSS</Divider>
            <Collapse defaultActiveKey={["1"]}>
              <Panel header="Movimientos IMSS" key="1">
                <MovementsSection regPatronalProps={router?.query?.regPatronal} />

                {/*<Collapse
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
                </Collapse>*/}
              </Panel>
              <Panel header="EMA y EBA" key="2">
                <Row justify={"space-between"} style={{ marginTop: "20px" }}>
                  <Col span={12}>
                    <SelectPatronalRegistration
                      currentNode={currentNodeId}
                      onChange={(value) => setPatronalSelected(value)}
                    />
                  </Col>

                  <Col
                    span={12}
                    style={{ display: "flex", justifyContent: "end" }}
                  >
                    <Col span={5} style={{ marginRight: 20 }}>
                      <Button
                        disabled={patronalSelected ? false : true}
                        onClick={() => setModalVisible(true)}
                      >
                        Importar
                      </Button>
                    </Col>
                    <Col span={7}>
                      <Button
                        onClick={() => syncEmaandEva()}
                        loading={loading}
                        disabled={patronalSelected ? false : true}
                      >
                        Sincronizar
                      </Button>
                    </Col>

                  </Col>
                  <Col span={24}>
                    <Alert
                        message=""
                        showIcon
                        description={
                          <p>La obtención de la información está sujeta a disponibilidad de los servicios de la plataforma IDSE. También recuerda que los primeros días de cada mes pudieran no existir los archivos.</p>
                        }
                        type="warning"
                    />
                  </Col>
                </Row>
                <EmaYEvaFiles
                  files={files?.length > 0 ? files : []}
                  loading={loading}
                  total={totalFiles}
                  changePage={changePage}
                />
              </Panel>
              <Panel header="Consulta de movimientos al IMSS" key="3">
                <Col span={24}>
                  <MovementsIMSS currentNodeId={currentNodeId} />
                </Col>
              </Panel>
            </Collapse>
          </div>
        </Spin>
      </MainLayout>
      <Modal
        title="Importar EMA y EBA"
        centered
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFile(null);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setModalVisible(false);
              setFile(null);
            }}
            style={{ padding: "0 10px", marginLeft: 15 }}
          >
            Cancelar
          </Button>,
          <Button
            key="submit_modal"
            type="primary"
            onClick={() => importEBAEMAFiles()}
            style={{ padding: "0 10px", marginLeft: 15 }}
            loading={loading}
            disabled={file ? false : true}
          >
            Subir archivos
          </Button>,
        ]}
      >
        <Row justify="start">
          <Col span={24}>
            <Alert
                message=""
                showIcon
                description={
                  <p>
                    La importación de EMA/EBA puede ser solamente por período. Agrega
                    los archivos descargados del imss a una carpeta comprimida en
                    formato .zip
                  </p>
                }
                type="warning"
            />

            <br/>
            <Checkbox checked={saveRiskPremium} onChange={(e)=> setSaveRiskPremium(e.target.checked)}>Guardar prima de riesgo en la configuración de este registro patronal</Checkbox>
          </Col>
          <Col span={24} style={{ marginTop: 20 }}>
            <UploadFile
              textButton={"Importar EMA y EBA"}
              setFile={setFile}
              validateExtension={".zip"}
              size={"middle"}
              showList={showList}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(ImssMovements));
