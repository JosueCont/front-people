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
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@material-ui/icons";
import WebApiPeople from "../../api/WebApiPeople";
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
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
import JobRiskPremium from "./forms/jobRiskPremium";

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
  const [ fiscalData, setFiscalData ] = useState(null)
  const [patronalData, setPatronalData] = useState(null);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [password, setPassword] = useState("");

  const [visibleTable, setVisibleTable] = useState(true);

  const [dataPatronalRegistration, setDataPatronalRegistration] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [idRegister, setIdRegister] = useState(null);
  const [deleted, setDeleted] = useState({});
  const [disabledSwitch, setDisabledSwitch] = useState(false);

  const [loadingData, setLoadingData] = useState(false);

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
                <EditOutlined onClick={() => editRegister(item, "td")} />
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
    if(fiscalData){
      form
    }
  },[fiscalData])

  const getPatronalRegistration = () => {
    setLoadingData(true);
    WebApiPeople.getPatronalRegistrationData(currentNode.id)
      .then((response) => {
        setDataPatronalRegistration(response.data);
        setLoadingData(false);
      })
      .catch((error) => {
        setLoadingData(false);
        console.log("error", error);
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
    let validformLegalRep = await formLegalRep
      .validateFields()
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });

    if (
      validformPatronal &&
      validformJobRisk &&
      validformAddress &&
      validformLegalRep
    )
      return true;
    return false;
  };

  const saveRegister = async (data) => {
    if (!(await validateForms())) return;
    data.node = currentNode.id;
    if (isEdit) {
      data.patronal.id = patronalData.id;
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

    let jobRiskData = formJobRisk.getFieldValue()
    jobRiskData.risk_percent = parseFloat(jobRiskData.risk_percent)
    const data = {
      node: currentNode.id,
      patronal: formPatronal.getFieldsValue(),
      address: formAddress.getFieldsValue(),
      representative: formLegalRep.getFieldsValue(),
      jobRisk: jobRiskData,
    };
    
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
    setVisibleTable(false);
    setDisabledSwitch(true);
  };

  //SE SETEAN LOS VALORES DEL REGISTRO A SUS INPUTS PARA PODER SER EDITADOS
  const editRegister = (item) => {
    setPatronalData(item);
    setDisabledSwitch(true);
    setIsEdit(true);
    setIdRegister(item.id);
    setVisibleTable(false);

    formPatronal.setFieldsValue({
      node: currentNode?.id,
      code: item?.code,
      economic_activity: item?.economic_activity,
      social_reason: item?.social_reason,
      subsidy_reimbursement_agreement: item?.subsidy_reimbursement_agreement,
      phone: item?.phone,
      id: item?.id,
      type_contribution: item?.type_contribution,
      geographic_area: item?.geographic_area,
      imss_delegation: item?.imss_delegation,
      imss_subdelegation: item?.imss_subdelegation,
    });

    formLegalRep.setFieldsValue({
      name: item?.legal_representative?.name,
      position: item?.legal_representative?.position,
      email: item?.legal_representative?.email,
      phone: item?.legal_representative?.phone,
      contact_name: item?.legal_representative?.contact_name,
      contact_email: item?.legal_representative?.contact_email,
    });
  };

  console.log('Patronal Data', patronalData)

  return (
    <>
      <Row style={{ marginBottom: "15px" }} justify="end">
        {!disabledSwitch && (
          <>
            <Button onClick={onChange}>Agregar Registro Patronal</Button>
          </>
        )}
      </Row>
      {visibleTable && (
        <Spin spinning={loadingData}>
          <Table
            dataSource={dataPatronalRegistration}
            columns={columns}
            locale={{
              emptyText: loading
                ? "Cargando..."
                : "No se encontraron resultados.",
            }}
          />
        </Spin>
      )}
      {!visibleTable && (
        <>
          <Row justify="end">
            <Button onClick={resetForms} style={{ marginRight: "5px" }}>
              Cancelar
            </Button>
            <Button onClick={saveForms} form="formGeneric" htmlType="submit">
              Guardar
            </Button>
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
                patronalRegistration={
                  patronalData && patronalData.patronal_registartion
                }
                form={formPatronal}
                currentNodeId = { currentNode.id }
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
                <Title style={{ fontSize: "15px" }}>Representante legal</Title>
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
          <Row justify="end">
            <Button onClick={resetForms} style={{ marginRight: "5px" }}>
              Cancelar
            </Button>
            <Button onClick={saveForms} form="formGeneric" htmlType="submit">
              Guardar
            </Button>
          </Row>
          <Row>
            <Title style={{ fontSize: "15px" }}>Certificados digitales</Title>
          </Row>
          <Row>
            <Col>
              <Divider style={{ marginTop: "2px" }} />
              <Row>
                <Col lg={2} xs={22} offset={1}>
                  <Form form={form}>
                    <Switch
                      onChange={(value) => setAcceptAgreement(value)}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                    />
                  </Form>
                </Col>
                <Col lg={14} xs={22} offset={1}>
                  <p>
                    Estoy de acuerdo y doy mi consentimiento para que EL SISTEMA
                    almacene y utilice estos archivos con fines exclusivos para
                    emisión y consulta de datos del IMSS.
                  </p>
                </Col>
              </Row>
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
                        disabled={password && certificate && key ? false : true}
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
        </>
      )}
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(ImssInformationNode));
