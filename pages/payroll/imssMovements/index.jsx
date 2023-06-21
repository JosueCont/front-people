import { useEffect, useState } from "react";
import SelectPatronalRegistration from "../../../components/selects/SelectPatronalRegistration";
import WebApiPeople from "../../../api/WebApiPeople";
import WebApiPayroll from '../../../api/WebApiPayroll'
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
  Typography, Alert, Divider, Select, Form, DatePicker,
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
import moment from "moment";
const { Text } = Typography;
import { ruleEmail, ruleRequired } from "../../../utils/rules";

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
  const [loadingSua, setLoadingSua] = useState(false)
  const [movType, setMovType] = useState(null)
  const router = useRouter();
  const [formSua] = Form.useForm()

  const movSuaTypes = [
    { label: 'Asegurados', value: 'ASEG' },
    { label: 'Movimientos afiliatorios', value: 'MOVT' },
    { label: 'Créditos infonavit', value: 'CRED' },
    { label: 'INCAP', value: 'INCAP' },
    { label: 'Análisis SUA', value: 'Análisis SUA' }
  ]

  const subMovTypes = [
    { label: 'Bajas', value: '02' },
    { label: 'Modificación de salario', value: '07' },
    { label: 'Altas/reingreso', value: '08' },
    { label: 'Incapacidad', value: '12' },
    { label: 'Ausentismo', value: '11' }
  ]

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

  const getSuaFile = async (values) => {
    if(!values.patronal_registration){
      message.error("Selecciona un registro patronal")
      return
    }

    values['start_date'] = values.start_date ? moment(values.start_date).format("YYYY-MM-DD") : null
    values['end_date'] = values.end_date ? moment(values.end_date).format("YYYY-MM-DD") : null


    setLoadingSua(true)
    try {
      let response = await WebApiPayroll.getSuaFile(values);
      setLoadingSua(false)
      if(response?.data?.message){
        message.info(response.data.message)
      }else{
        const nameFile = values.type == 'ASEG' ? 'Asegurados' :
                          values.type == 'MOVT' ? 'Movimientos afiliatorios' :
                          values.type == 'CRED' ? 'Créditos infonavit de personas' :
                          values.type == 'INCAP' ? 'Incapacidades' :
                          values.type == "Análisis SUA" && "Análisis SUA"
        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = nameFile+".txt";
        link.click();
        message.success("Archivo descargado")
      }
      
      
    } catch (error) {
      setLoadingSua(false)
    }
  }

  const validTypeMov = () => {
    let type = formSua.getFieldValue('type')
    console.log('type', type)
    return type
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
              <Panel header="SUA" key="4">
                <h4>Movimientos SUA</h4>
                <Form
                    layout="vertical"
                    form={formSua}
                    onFinish={getSuaFile}
                >
                  <Row gutter={[10,0]}>
                    <Col span={6}>
                      <SelectPatronalRegistration/>
                    </Col>  
                    <Col span={6}>
                      <Form.Item rules={[ruleRequired]} name="type" label="Tipo de movimiento">
                        <Select  options={movSuaTypes} allowClear onChange={(val) => setMovType(val) } />
                      </Form.Item>
                    </Col>
                    {
                      movType === "MOVT" &&
                      <Col span={6}>
                        <Form.Item  rules={[ruleRequired]} name="inner_types" label="Subtipos de movimientos">
                          <Select mode="multiple" options={subMovTypes} allowClear />
                        </Form.Item>
                      </Col>
                    }
                    </Row>
                    <Row gutter={[10,0]}>
                    <Col span={6}>
                      <Form.Item  name={'start_date'} label="Fecha inicio">
                        <DatePicker style={{ width:'100%' }} format={'YYYY-MM-DD'} />    
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item  name={'end_date'} label="Fecha fin">
                        <DatePicker style={{ width:'100%' }} format={'YYYY-MM-DD'} />    
                      </Form.Item>
                    </Col>
                    <Col span={24}>   
                      <Button htmlType="submit">
                        Generar archivo    
                      </Button>
                    </Col>
                </Row>
                </Form>
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
