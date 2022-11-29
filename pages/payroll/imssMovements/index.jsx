import { useEffect, useState } from "react";
import SelectPatronalRegistration from "../../../components/selects/SelectPatronalRegistration";
import WebApiPeople from "../../../api/WebApiPeople";
import { Breadcrumb, Button, Collapse, Row, Col,Space, Spin, message, Modal, Typography } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import MainLayout from "../../../layout/MainLayout";
import { withAuthSync } from "../../../libs/auth";
import SuaMovements from "./suaMovements";
import EmaYEvaFiles from "./EmaYEvaFiles";
import { connect } from "react-redux";
import MovementsIMSS from "../../../components/payroll/fiscalMovements/MovementsIMSS";
import UploadFile from "../../../components/UploadFile";
import MovementsSection from "../../../components/payroll/ImssMovements/MovementsSection";
import ButtonAltaImssImport from "../../../components/payroll/ImportGenericButton/ButtonAltaImssImport";
const { Text  } = Typography

const ImssMovements = ({ ...props }) => {
  const { Panel } = Collapse;
  const [ loading, setLoading ] = useState(false)
  const [currentNodeId, setCurrentNodeId] = useState(null) 
  const [patronalSelected, setPatronalSelected] = useState(null);
  const [files, setFiles ] = useState([])
  const [file, setFile]=useState(null)
  const [ modalVisible, setModalvisible ] = useState(false)

  // useEffect(() => {
  //   props.currentNode && setCurrentNodeId(props.currentNode.id)
  // },[])

  file && console.log('File', file)

  useEffect(() => {
    patronalSelected && getFiles()
  },[patronalSelected])

  const getFiles = () => {
    setLoading(true)
    WebApiPeople.listEbaAndEmaFiles(props.currentNode.id, patronalSelected)
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

  const syncEmaandEva = async () => {
    setLoading(true)
    let data = new FormData()
    
    data.append('node', props.currentNode.id)
    data.append('patronal_registration', patronalSelected)

    try {
      let response = await WebApiPeople.forceListEbaAndEmaFiles(data)
      console.log("Response", response)
      message.success('Las emisiones fueron pedidas con éxito, verifique este apartado en un par de horas')
    } catch (error) {
      console.error('Error', error)
      message.error('Error al pedir las emsiones. Intente más tarde')
    } finally {
      setLoading(false)
    }
  }

  const importEBAEMAFiles = async () => {

    setLoading(true)
    let data = new FormData()

    data.append('node', props.currentNode.id)
    data.append('patronal_registration', patronalSelected)
    data.append('File', file)

    try {
      let response = await WebApiPeople.importEMAandEvaFiles(data)
      if(response) {
        message.success('Importacion correcta')
        getFiles()
      }
    } catch (error) {
      console.log('Error', error.data)
      
    } finally {
      setLoading(false)
      setModalvisible(false)
      setFile(null)
    }
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
              <Panel header="SUA Movimientos" key="1">
                <MovementsSection/>

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
                <Row justify={'space-between'} style={{ marginTop: '20px' }}>
                    <Col span={10}>
                      <SelectPatronalRegistration
                        currentNode={currentNodeId}
                        onChange={(value) => setPatronalSelected(value)}
                      />
                    </Col>
                    <Col span={10} style={{ display: 'flex', justifyContent: 'end' }}>
                    {/* <Col span={12}>
                        <UploadFile
                            textButton={"Importar EMA y EBA"}
                            setFile={setFile}
                            validateExtension={".zip"}
                            size = {'middle'}
                        />
                    </Col> */}
                    <Col span={5}>
                        <Button 
                          disabled = { patronalSelected? false : true }
                          onClick={ () => setModalvisible(true)}>
                          importar
                        </Button>
                    </Col>
                     <Col span={7}>
                        <Button 
                          onClick={ () => syncEmaandEva() }
                          disabled = { patronalSelected?  false : true }
                        >
                            Sincronizar
                        </Button>
                    </Col>
                </Col>
                </Row>
                <EmaYEvaFiles 
                  files = {files.length > 0? files : []}
                  loading = { loading }
                />
              </Panel>
              <Panel header="Consulta de movimientos al IMSS" key="3">
                <Col span={24}>
                  <MovementsIMSS
                    currentNodeId = { currentNodeId }
                  />
                </Col>
              </Panel>
            </Collapse>
          </div>
        </Spin>
      </MainLayout>
      <Modal
        title="Importar EMA y EBA"
        centered
        visible = { modalVisible }
        onCancel = { () => {
            setModalvisible(false)
            setFile(null)
          } 
        }
        footer={[
          <Button
            key="back"
            onClick={ () => {
              setModalvisible(false)
              setFile(null)
            } 
          }
            style={{ padding: "0 10px", marginLeft: 15 }}
          >
            Cancelar
          </Button>,
          <Button
            key="submit_modal"
            type="primary"
            onClick={() => importEBAEMAFiles()}
            style={{ padding: "0 10px", marginLeft: 15 }}
            loading = { loading }
            disabled = { file? false : true }
          >
            Subir archivos
          </Button>,
        ]}
      >
          <Row justify='start'>
            <Col span={24}>
              <Text>
                La importación de EMA/EBA puede ser solamente por período. 
                Agrega los archivos descargados del imss a una carpeta comprimida 
                en formato .zip
              </Text>
            </Col>
            <Col span={24} style={{ marginTop: 20 }}>
              <UploadFile
                textButton={"Importar EMA y EBA"}
                setFile={setFile}
                validateExtension={".zip"}
                size = {'middle'}
                showList = {true}
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
