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
import {CaretRightOutlined, SyncOutlined} from "@ant-design/icons";
import GenericModal from "../../../components/modal/genericModal";
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
import dayjs from 'dayjs';
import Variability from "../../../components/payroll/ImssMovements/Variability";
import AffiliatedMovementsContent from '../../../components/payroll/ImssMovements/AffiliatedMovementsContent'
import WithholdingNoticesContent from '../../../components/payroll/ImssMovements/WithholdingNoticesContent'
import locale from "antd/lib/date-picker/locale/es_ES";
import AfilliateMovements from "../../business/AfilliateMovements";
import WithHoldingNotice from "../../business/WithHoldingNotice";
import SalaryByAnniversary from "../../../components/payroll/ImssMovements/SalaryByAnniversary";


const ImssMovements = ({ ...props }) => {
  const { Panel } = Collapse;
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [patronalSelected, setPatronalSelected] = useState(null);
  const [patronalSelectedInfonavit, setPatronalSelectedInfonavit] = useState(null);
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0)
  const [file, setFile] = useState(null);
  const [saveRiskPremium, setSaveRiskPremium] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingSua, setLoadingSua] = useState(false)
  const [loadingSyncEmas, setLoadingSyncEmas] = useState(false)
  const [movType, setMovType] = useState(null)
  const [modal, setModal] = useState(false);
  const [disabledBimester, setDisabledBimester] = useState(true);
  const [bimester, setBimester] = useState(null);
  const [year, setYear] = useState("");
  const [scraperActive, setScraperActive] = useState(false)

  const router = useRouter();
  const [formSua] = Form.useForm()

  const {Title} = Typography
  const { Option } = Select

  const movSuaTypes = [
    { label: 'Asegurados', value: 'ASEG' },
    { label: 'Movimientos afiliatorios', value: 'MOVT' },
    { label: 'Créditos infonavit', value: 'CRED' },
    { label: 'Datos afiliatorios del trabajador', value: 'AFIL' }
  ]

  const subMovTypes = [
    { label: 'Bajas', value: '02' },
    { label: 'Modificación de salario', value: '07' },
    { label: 'Altas/reingreso', value: '08' },
    { label: 'Incapacidad', value: '12' },
    /* { label: 'Ausentismo', value: '11' } */
  ]

  // useEffect(() => {
  //   props.currentNode && setCurrentNodeId(props.currentNode.id)
  // },[])

  const disabledMinDate  = (current) => {
    let max_date = formSua.getFieldValue('end_date')
    if (max_date){
        return current && current > max_date;    
    }
    return current > dayjs().endOf('day');
};

const disabledMaxDate  = (current) => {
  let min_date = formSua.getFieldValue('start_date')
  if (min_date){
      return current >= dayjs().endOf('day') || current <= min_date;    
  }
  return current > dayjs().endOf('day');
};

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
    setLoadingSyncEmas(true);
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
      setLoadingSyncEmas(false);
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
    
    if(values['start_date'] > values['end_date']){
      message.info("La fecha final no puede ser menor a la fecha de inicio")
      return
    }

    if(values.type === "MOVT" && (values.inner_types === undefined || values.inner_types.length < 1 )){
      values['inner_types'] = subMovTypes.map(item => item.value)
    }

    setLoadingSua(true)
    try {
      let response = await WebApiPayroll.getSuaFile(values);
      setLoadingSua(false)
      if(response?.data?.message){
        message.info(response.data.message)
      }else{
        if(!response.data){
          message.info("No se encontraron resultados")
          return
        }
        const nameFile = values.type == 'ASEG' ? 'Asegurados' :
                          values.type == 'AFIL' ? 'Datos Afiliatorios' :
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

  const validateScraper = async () => {
    let valid = await WebApiPeople.getCredentials('infonavit', patronalSelectedInfonavit)
    const results = valid?.data?.results
    console.log('result', results)
    setScraperActive(results?.credentials)
    //credentials
  }

  useEffect(() => {
    if(patronalSelectedInfonavit){
      validateScraper()
    }
  }, [patronalSelectedInfonavit])
  

  const validTypeMov = () => {
    let type = formSua.getFieldValue('type')
    console.log('type', type)
    return type
  }

  const verifyPeriod = async () => {
    try {
      setModal(false);
      setLoading(true);
      let period = moment(year).format("YYYY").slice(2, 4).concat(bimester);
      let data = {
        period,
        node: props.currentNode?.id,
        patronal_registration: patronalSelectedInfonavit,
      };
      const syncMovements = await WebApiPeople.syncUpAfilliateMovements(data);
      if (syncMovements?.data?.message)
        message.success(syncMovements?.data?.message);
      else message.error("Hubo un problema, intentalo más tarde");
    } catch (e) {
      console.log(e?.response.data?.message);
      if (e?.response.data?.message) {
        message.error(e?.response.data?.message);
      } else {
        message.error("Hubo un problema, intentalo más tarde");
      }
    } finally {
      setLoading(false);
    }
  };

  const getOptions = () => {
    let options = [];
    let period = 1;
    for (period; period <= 6; period++) {
      options.push(
        <Option key={period.toString()} value={`0${period.toString()}`}>
          0{period}
        </Option>
      );
    }
    return options;
  };

  const changeYear = (value) => {
    if (value) {
      setYear(value);
      setDisabledBimester(false);
    } else {
      setDisabledBimester(true);
      setBimester(null);
    }
  };

  const changeBimester = (value) => {
    if (value) {
      setBimester(value);
    }
  };

  const syncUpData = async () => {
    try {
      setLoading(true);
      let dataSend = {
        patronal_registration_id: patronalSelectedInfonavit,
        node_id: props.currentNode?.id
      };
      const syncData = await WebApiPeople.withHoldingNotice(dataSend);
      if (syncData?.data?.message) message.success(syncData?.data?.message);
    } catch (e) {
      console.log(e);
      let msg = "Ocurrio un error intente de nuevos.";
      if (error.response?.data?.message) {
        msg = error.response?.data?.message;
      }
      message.error(msg);

    } finally {
      setLoading(false);
    }
  };
  

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
          <Breadcrumb.Item>Movimientos IMSS e INFONAVIT</Breadcrumb.Item>
        </Breadcrumb>
        <Spin tip="Cargando..." spinning={false}>
          <div
            className="container-border-radius"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <Divider> Movimientos de IMSS e INFONAVIT</Divider>
            <Collapse
                //defaultActiveKey={["1"]}
            >
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
                  <Col span={10}>
                    <SelectPatronalRegistration
                      currentNode={currentNodeId}
                      onChange={(value) => setPatronalSelected(value)}
                    />

                  </Col>
                  <Col span={2}>
                    <Button
                        disabled = { patronalSelected?  false : true }
                        onClick={getFiles}
                    >
                      <SyncOutlined spin={loading} />
                    </Button>
                  </Col>

                  <Col
                    span={12}
                    style={{ display: "flex", justifyContent: "end" }}
                  >
                    <Row gutter={16}>
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
                            loading={loadingSyncEmas}
                            disabled={patronalSelected ? false : true}
                        >
                          Solicitar archivos del IMSS
                        </Button>
                      </Col>
                    </Row>


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
                        <Form.Item  name="inner_types" label="Subtipos de movimientos">
                          <Select placeholder="Todos" mode="multiple" options={subMovTypes} allowClear />
                        </Form.Item>
                      </Col>
                    }
                    </Row>
                    <Row gutter={[10,0]}>
                    <Col span={6}>
                      <Form.Item  name={'start_date'} label="Fecha inicio" >
                        <DatePicker style={{ width:'100%' }} format={'YYYY-MM-DD'} disabledDate={disabledMinDate} />    
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item  name={'end_date'} label="Fecha fin">
                        <DatePicker style={{ width:'100%' }} format={'YYYY-MM-DD'} disabledDate={disabledMaxDate} />    
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
              <Panel header="Variabilidad" key="5">
                <Col span={24}>
                  <Variability currentNodeId={currentNodeId} />
                </Col>
              </Panel>
              <Panel header="Actualización de salarios por aniversario" key="8">
                <Col span={24}>
                  <SalaryByAnniversary currentNodeId={currentNodeId} />
                </Col>
              </Panel>
              <Panel header="Movimientos afiliatorios" key="6">
                <Col span={24} >
                  <AffiliatedMovementsContent currentNodeId={props?.currentNode?.id} />
                </Col>
              </Panel>
              <Panel header="Avisos de retenciones" key="7">
                <Col span={24} >
                  <WithholdingNoticesContent onSuccess={(mensaje)=> {
                    console.log(mensaje)
                    message.success(mensaje)
                  }} currentNodeId={props?.currentNode?.id} />
                </Col>
              </Panel>
            </Collapse>

            {/* <Divider>
              {" "}
              <img src={"/images/logoinfonavit.png"} width={40} />{" "}
              Movimientos de Infonavit
            </Divider>
            <Row>
                <Col>
                <SelectPatronalRegistration
                    currentNode={props?.currentNode?.id}
                    onChange={(value) => setPatronalSelectedInfonavit(value)}
                  />
                </Col>
            </Row>
            {
              patronalSelectedInfonavit && 
              <>
                {
                  !scraperActive  ?
                  <>
                    <Alert
                      description={<>No se encuentra la configuración de Infonavit para este Reg. Patronal.  <br/>
                      <a onClick={()=> router.push("/business/patronalRegistrationNode") } >Configuralo aquí</a> </>}
                      type="warning"
                      showIcon
                      closable
                    />
                  </>
                  :
                  <>
                    <Row justify="space-between">
                      <Title style={{ fontSize: "15px", paddingTop: "10px" }}>
                        Movimientos afiliatorios
                      </Title>
                      <Button
                        onClick={() => setModal(true)}
                        form="formGeneric"
                        htmlType="submit"
                        style={{ marginBottom: "20px" }}
                      >
                        Sincronizar / Solicitar
                      </Button>
                    </Row>
                    <Divider style={{ marginTop: "2px" }} />
                    <Spin spinning={loading}>
                      <AfilliateMovements
                        id={patronalSelectedInfonavit}
                        node={props?.currentNode?.id}
                      />
                    </Spin>
                    <Row justify="space-between" style={{ marginTop: 50 }}>
                      <Title style={{ fontSize: "15px", paddingTop: "10px" }}>
                        Avisos de retenciones
                      </Title>
                      <Button
                        onClick={syncUpData}
                        form="formGeneric"
                        htmlType="submit"
                        style={{ marginBottom: "20px" }}
                      >
                        Sincronizar / Solicitar
                      </Button>
                    </Row>
                    <Divider style={{ marginTop: "2px" }} />
                    <Spin spinning={loading}>
                      <WithHoldingNotice
                        patronalData={{id: patronalSelectedInfonavit , node: props?.currentNode?.id}}
                      />
                    </Spin>
                  </>
                }
              </>
            } */}
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
      {/* <GenericModal
        visible={modal}
        setVisible={() => setModal(false)}
        title="Solicitar movimientos"
        actionButton={() => verifyPeriod()}
        width="30%"
        //disabledSave={disabeldSave}
      >
        <Row justify="center">
          <Col span={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "10px",
              }}
            >
              <span>Año</span>
              <DatePicker
                style={{ width: "100%", marginBottom: "10px" }}
                onChange={changeYear}
                picker="year"
                moment={"YYYY"}
                disabledDate={(currentDate) =>
                  currentDate.year() > new Date().getFullYear()
                }
                placeholder="Selecciona año"
                locale={locale}
              />

              <span>Bimestre</span>
              <Select
                size="middle"
                key={"period"}
                disabled={disabledBimester}
                val={bimester}
                onChange={changeBimester}
                allowClear
                notFoundContent={"No se encontraron resultados."}
                showSearch
                optionFilterProp="children"
                placeholder="Selecciona bimestre"
              >
                {getOptions()}
              </Select>
            </div>
          </Col>
        </Row>
      </GenericModal> */}
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(ImssMovements));
