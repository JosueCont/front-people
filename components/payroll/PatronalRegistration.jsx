import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Divider,
  Form,
  Button,
  message,
  Switch,
  Input,
  Table,
  Modal,
  Spin,
  DatePicker,
  ConfigProvider,
  Select,
  Alert,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@material-ui/icons";
import WebApiPeople from "../../api/WebApiPeople";
import locale from "antd/lib/date-picker/locale/es_ES";
import {
  messageError,
  messageSaveSuccess,
  messageUploadSuccess,
  messageDeleteSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import UploadFile from "../UploadFile";
import WebApiFiscal from "../../api/WebApiFiscal";
import LegalRepresentative from "./forms/LegalRepresentative";
import FormFiscalAddress from "./forms/FormFiscalAddress";
import FormPatronalRegistration from "./forms/FormPatronalRegistration";
import AutomaticMovements from "../business/AutomaticMovements";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
import JobRiskPremium from "./forms/jobRiskPremium";
import moment from "moment";
import esES from "antd/lib/locale/es_ES";
import WithHoldingNotice from "../../pages/business/WithHoldingNotice";
import AfilliateMovements from "../../pages/business/AfilliateMovements";
import GenericModal from "../modal/genericModal";
const { Option } = Select;

const ImssInformationNode = ({
  node_id = null,
  fiscal,
  currentNode,
  ...props
}) => {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [formPatronal] = Form.useForm();
  const [formAddress] = Form.useForm();
  const [formLegalRep] = Form.useForm();
  const [formJobRisk] = Form.useForm();
  const [fiscalData, setFiscalData] = useState(null);
  const [patronalData, setPatronalData] = useState(null);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [password, setPassword] = useState("");
  const [currentMeta, setCurrentMeta] = useState(null);

  const [visibleTable, setVisibleTable] = useState(true);

  const [dataPatronalRegistration, setDataPatronalRegistration] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [idRegister, setIdRegister] = useState(null);
  const [deleted, setDeleted] = useState({});
  const [disabledSwitch, setDisabledSwitch] = useState(false);

  const [loadingData, setLoadingData] = useState(false);
  const [bimester, setBimester] = useState(null);
  const [year, setYear] = useState("");
  const [modal, setModal] = useState(false);

  const [hasCredentialInfonavit, setHasCredentialInfonavit] = useState(false);
  const [hasCredentialIMSS, setHasCredentialIMSS] = useState(false);
  const [disabledBimester, setDisabledBimester] = useState(true);
  const [disabeldSave, setDisabledSave] = useState(true);

  const columns = [
    {
      title: "Código",
      dataIndex: "code",
      key: "name",
    },
    {
      title: "Actividad Económica",
      dataIndex: "economic_activity",
    },
    {
      title: "Razón Social",
      dataIndex: "social_reason",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined
                  onClick={() => {
                    console.log("patronal", item);
                    editRegister(item, "td");
                  }}
                />
              </Col>

              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  onClick={() => {
                    setDeleteRegister({
                      id: item.id,
                      name: item.social_reason,
                    });
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (currentNode) {
      getPatronalRegistration();
    }
  }, [currentNode]);

  useEffect(() => {
    if (fiscalData) {
      form;
    }
  }, [fiscalData]);

  const getPatronalRegistration = () => {
    setLoadingData(true);
    WebApiPeople.getPatronalRegistrationData(currentNode.id)
      .then((response) => {
        setDataPatronalRegistration(response.data);
        setLoadingData(false);
      })
      .catch((error) => {
        setLoadingData(false);
        console.log(error);
      });
  };

  const validateForms = async () => {
    let validformPatronal = await formPatronal
      .validateFields()
      .then((result) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
    let validformJobRisk = await formJobRisk
      .validateFields()
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    let validformAddress = await formAddress
      .validateFields()
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });

    if (validformPatronal && validformJobRisk && validformAddress) return true;
    return false;
  };

  const saveRegister = async (data) => {
    if (!(await validateForms())) return;
    data.node = currentNode.id;
    if (isEdit && patronalData?.id) {
      data.patronal.id = patronalData?.id;
      if (patronalData.job_risk_premium && patronalData.job_risk_premium.id)
        data.jobRisk.id = patronalData.job_risk_premium.id;
      if (
        patronalData.legal_representative &&
        patronalData.legal_representative.id
      )
        data.representative.id = patronalData.legal_representative.id;
      if (patronalData.fiscal_address && patronalData.fiscal_address.id)
        data.address.id = patronalData.fiscal_address.id;
    }

    debugger;

    WebApiPeople.patronalRegistration(data)
      .then((response) => {
        resetForms();
        message.success(isEdit ? messageUpdateSuccess : messageSaveSuccess);
        setVisibleTable(true);
        getPatronalRegistration();
        setDisabledSwitch(false);
      })
      .catch((error) => {
        console.log(error);
        message.error(messageError);
      });
  };

  const deleteRegister = () => {
    WebApiPeople.deletePatronalRegistration(idRegister, currentNode.id)
      .then((response) => {
        message.success(messageDeleteSuccess);
        getPatronalRegistration();
      })
      .catch((error) => {
        console.log(error);
        message.error(
          "Verifica que el registro no se encuentre vinculada a una sucursal"
        );
      });
  };

  const setDeleteRegister = (data) => {
    setDeleted(data);
    setIdRegister(data.id);
  };

  const saveForms = () => {
    let jobRiskData = formJobRisk.getFieldValue();
    jobRiskData.risk_percent = parseFloat(jobRiskData.risk_percent);
    let patronalData = formPatronal.getFieldsValue();
    let meta = {...currentMeta}
    meta.save_automatic_emissions = formPatronal.getFieldValue('save_automatic_emissions') ? formPatronal.getFieldValue('save_automatic_emissions') : false;
    meta.save_job_risk_premium = formPatronal.getFieldValue('save_job_risk_premium') ? formPatronal.getFieldValue('save_job_risk_premium') : false;
    patronalData.metadata= meta;

    const data = {
      node: currentNode.id,
      patronal: patronalData,
      address: formAddress.getFieldsValue(),
      representative: formLegalRep.getFieldsValue(),
      jobRisk: jobRiskData,
    };

    try {
      if (formPatronal.getFieldValue("setup_period")) {
        let date = formPatronal.getFieldValue("setup_period");
        data.patronal.setup_period = date.year();
      }
    } catch (e) {}
    saveRegister(data);
  };

  useEffect(() => {
    if (deleted) {
      if (deleted.id) {
        Modal.confirm({
          title: "¿Está seguro de eliminar este registro?",
          content: "Si lo elimina no podrá recuperarlo",
          cancelText: "Cancelar",
          okText: "Sí, eliminar",
          onOk: () => {
            deleteRegister();
          },
        });
      }
    }
  }, [deleted]);

  //METODO PARA VALIDAR CONTRASEÑAS, DESHABILITADO POR EL MOMENTO
  const validatedPass = (value) => {
    if (value && value != "") {
      setPassword(value.trim());
      form.setFieldsValue({ passcer: value.trim() });
    }
  };

  //METODO PARA CARGAR DOCS, DESHABILITADO POR EL MOMENTO
  const uploadCsds = () => {
    if (password && certificate && key) {
      let data = new FormData();
      data.append("node", node_id);
      data.append("cer", certificate);
      data.append("key", key);
      data.append("password", password);
      WebApiFiscal.uploadCsds(data)
        .then((response) => {
          message.success(messageUploadSuccess);
        })
        .catch((error) => {
          message.error(messageError);
        });
    }
  };

  //MÉTODO PARA LIMPIAR EL FORMULARIO Y ALGUNOS ESTADOS DE LA VISTA
  const resetForms = () => {
    formPatronal.resetFields();
    formJobRisk.resetFields();
    formLegalRep.resetFields();
    formAddress.resetFields();
    setVisibleTable(true);
    setDisabledSwitch(false);
    setPatronalData(null);
  };

  //MÉTODO PARA ENSEÑAR U OCULTAR TABLA Y ENSEÑAR FORMULARIO
  const onChange = () => {
    setIsEdit(false);
    setVisibleTable(false);
    setDisabledSwitch(true);
  };

  //SE SETEAN LOS VALORES DEL REGISTRO A SUS INPUTS PARA PODER SER EDITADOS
  const editRegister = (item) => {
    setPatronalData(null);
    setDisabledSwitch(true);
    setIsEdit(true);
    setIdRegister(item.id);
    setVisibleTable(false);
    setCurrentMeta(item?.meta)

    formPatronal.setFieldsValue({
      node: currentNode?.id,
      code: item?.code,
      economic_activity: item?.economic_activity,
      social_reason: item?.social_reason,
      subsidy_reimbursement_agreement: item?.subsidy_reimbursement_agreement,
      phone: item?.phone,
      id: item?.id,
      save_automatic_emissions: item?.metadata?.save_automatic_emissions,
      save_job_risk_premium: item?.metadata?.save_job_risk_premium,
      setup_period: item?.setup_period
        ? moment().year(parseInt(item?.setup_period))
        : null,
      type_contribution: item?.type_contribution,
      geograp_area: item?.geograp_area,
      imss_delegation: item?.imss_delegation,
      imss_subdelegation: item?.imss_subdelegation,
    });

    setPatronalData(item);

    formLegalRep.setFieldsValue({
      name: item?.legal_representative?.name,
      position: item?.legal_representative?.position,
      email: item?.legal_representative?.email,
      phone: item?.legal_representative?.phone,
      contact_name: item?.legal_representative?.contact_name,
      contact_email: item?.legal_representative?.contact_email,
    });
  };

  const syncUpData = async () => {
    try {
      setLoading(true);
      let dataSend = {
        patronal_registration_id: patronalData.id,
        node_id: dataPatronalRegistration[0].node,
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

  const verifyPeriod = async () => {
    try {
      setModal(false);
      setLoading(true);
      let period = moment(year).format("YYYY").slice(2, 4).concat(bimester);
      let data = {
        period,
        node: dataPatronalRegistration[0].node,
        patronal_registration: patronalData.id,
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

  const getBimester = (month) => {
    if (month == 1 || month == 2) return 1;
    if (month == 3 || month == 4) return 2;
    if (month == 4 || month == 6) return 3;
    if (month == 7 || month == 8) return 4;
    if (month == 9 || month == 10) return 5;
    if (month == 11 || month == 12) return 6;
  };

  useEffect(() => {
    if (bimester && year) {
      const date = new Date();
      let month = date.getMonth()+1;
      let currYear = date.getFullYear();
      let bimesterCalculated =getBimester(month);
      if (year.year() <= currYear && parseInt(bimester) <= bimesterCalculated)
        setDisabledSave(false);
      else if (year.year() < currYear) setDisabledSave(false);
      else setDisabledSave(true);
    } else {
      setDisabledSave(true);
    }
  }, [year, bimester]);

  return (
    <>
      <Spin spinning={loading}>
        <Row style={{ marginBottom: "15px" }} justify="end">
          {!disabledSwitch && (
            <>
              <Button onClick={onChange}>Agregar Registro Patronal</Button>
            </>
          )}
        </Row>
        {visibleTable && (
          <Spin spinning={loadingData}>
            <ConfigProvider locale={esES}>
              <Table
                dataSource={dataPatronalRegistration}
                columns={columns}
                pagination={{
                  showSizeChanger: true,
                }}
                locale={{
                  emptyText: loading
                    ? "Cargando..."
                    : "No se encontraron resultados.",
                }}
              />
            </ConfigProvider>
          </Spin>
        )}
        {!visibleTable && (
          <>
            <Row justify="end">
              <Button onClick={resetForms} style={{ marginRight: "5px" }}>
                Cancelar
              </Button>
              <Button onClick={saveForms}>Guardar</Button>
            </Row>
            <Row>
              <Col span={24}>
                <Row>
                  <Title style={{ fontSize: "15px" }}>
                    {isEdit
                      ? "Editar Registro Patronal"
                      : "Nuevo Registro Patronal"}
                  </Title>
                </Row>
                <Divider style={{ marginTop: "2px" }} />
                <FormPatronalRegistration
                  hasImss={hasCredentialIMSS}
                  patronalRegistration={
                    patronalData && patronalData.patronal_registration
                  }
                  form={formPatronal}
                  currentNodeId={currentNode && currentNode.id}
                  imssDelegation={patronalData && patronalData.imss_delegation}
                />
                <Row>
                  <Title style={{ fontSize: "15px" }}>Dirección fiscal</Title>
                </Row>
                <Divider style={{ marginTop: "2px" }} />
                <FormFiscalAddress
                  fiscalAddress={patronalData && patronalData.fiscal_address}
                  form={formAddress}
                />
                <Row>
                  <Title style={{ fontSize: "15px" }}>
                    Prima de riesgo laboral
                  </Title>
                </Row>
                <Divider style={{ marginTop: "2px" }} />
                <JobRiskPremium
                  jobRisk={patronalData && patronalData.job_risk_premium}
                  form={formJobRisk}
                />
                <Row>
                  <Title style={{ fontSize: "15px" }}>
                    Representante legal
                  </Title>
                </Row>
                <Divider style={{ marginTop: "2px" }} />
                <LegalRepresentative
                  legalRepresentative={
                    patronalData && patronalData.legal_representative
                  }
                  form={formLegalRep}
                />
              </Col>
            </Row>
            <Row justify="end" style={{ marginTop: 20, marginBottom: 20 }}>
              <Button onClick={resetForms} style={{ marginRight: "5px" }}>
                Cancelar
              </Button>
              <Button onClick={saveForms} form="formGeneric" htmlType="submit">
                Guardar
              </Button>
            </Row>

            {isEdit ? (
              <>
                <Row>
                  <Title style={{ fontSize: "15px" }}>
                    Configuracíon de movimientos automáticos
                  </Title>
                </Row>
                <Divider style={{ marginTop: "2px" }} />
                <AutomaticMovements
                  hasInfonavit={(data) => setHasCredentialInfonavit(data)}
                  hasImss={(data) => setHasCredentialIMSS(data)}
                  patronalData={patronalData}
                />
                <Alert
                  message=""
                  showIcon
                  description={
                    <p>
                      Las funcionalidades relacionadas a los movimientos
                      automáticos de IMSS e INFONAVIT están sujetos a la
                      disponibilidad de ambos servicios ya que son externos a
                      nuestra plataforma.
                    </p>
                  }
                  type="info"
                />
                <Row>
                  <Col>
                    <Divider style={{ marginTop: "2px" }} />
                    <div style={{ width: "100%" }}>
                      {acceptAgreement && (
                        <Form layout={"vertical"} form={form}>
                          <Col
                            style={{
                              marginBottom: "15px",
                              marginLeft: "15px",
                              width: "50%",
                            }}
                          >
                            <Form.Item name="passcer">
                              <Input.Password
                                type="password"
                                placeholder="Contraseña"
                                maxLength={12}
                                onChange={(value) =>
                                  validatedPass(value.target.value)
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col lg={12} xs={22}>
                            <UploadFile
                              textButton={"Cargar certificado"}
                              setFile={setCertificate}
                              validateExtension={".cer"}
                              showList={true}
                            />
                          </Col>
                          <Col lg={12} xs={22}>
                            <UploadFile
                              textButton={"Firma electronica"}
                              setFile={setKey}
                              validateExtension={".cer"}
                              showList={true}
                            />
                          </Col>
                          <Row justify="end">
                            <Button
                              disabled={
                                password && certificate && key ? false : true
                              }
                              onClick={() => uploadCsds()}
                            >
                              Guardar certificados
                            </Button>
                          </Row>
                        </Form>
                      )}
                    </div>
                  </Col>
                </Row>

                {hasCredentialInfonavit && (
                  <a href={`/payroll/imssMovements?regPatronal=${patronalData.id}`} style={{fontStyle:'underline'}}>Ir a la sección de IMSS e Infonavit</a>
                )}

                <GenericModal
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
                </GenericModal>
              </>
            ) : null}
          </>
        )}
      </Spin>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(ImssInformationNode));
