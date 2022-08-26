import { useLayoutEffect, useState, useEffect } from "react";
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
import moment from "moment";

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
  const [patronalData, setPatronalData] = useState(null);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [password, setPassword] = useState("");
  const [visibleTable, setVisibleTable] = useState(true);
  const [labelForm, setLabelForm] = useState("Nuevo Registro Patronal");
  const [dataPatronalRegistration, setDataPatronalRegistration] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [idRegister, setIdRegister] = useState(null);
  const [deleted, setDeleted] = useState({});
  const [disabledSwitch, setDisabledSwitch] = useState(false);
  const [cp, setCp] = useState(null);
  const [municipality, setMunicipality] = useState(null);
  const [state, setState] = useState(null);
  const [country, setCountry] = useState(null);
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

  //ESPERAMOS EL NODO PARA LUEGO HACER EL GET DE LOS REGISTROS PATRONALES.
  useEffect(() => {
    if (currentNode) {
      getPatronalRegistration();
    }
  }, [currentNode]);

  //HACEMOS EL GET DE LOS ELEMENTOS Y ENLISTAMOS
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

  //MÉTODO PARA GUARDAR UN NUEVO REGISTRO
  const saveRegister = (data) => {
    WebApiPeople.savePatronalRegistration(currentNode.id, data)
      .then((response) => {
        resetForms();
        message.success(messageSaveSuccess);
        setVisibleTable(true);
        getPatronalRegistration();
        setDisabledSwitch(false);
      })
      .catch((error) => {
        console.log(error);
        message.error(messageError);
        setDisabledSwitch(false);
      });
  };

  //MÉTODO PARA ACTUALIZAR REGISTRO
  const updateRegister = (data) => {
    WebApiPeople.updatePatronalRegistration(idRegister, currentNode.id, data)
      .then((response) => {
        resetForms();
        message.success(messageUpdateSuccess);
        setVisibleTable(true);
        getPatronalRegistration();
        setIsEdit(false);
        setDisabledSwitch(false);
        setLabelForm("Nuevo Registro Patronal");
      })
      .catch((error) => {
        setIsEdit(false);
        console.log(error);
        message.error(messageError);
        setDisabledSwitch(false);
      });
  };

  //MÉTODO PARA ELIMINAR REGISTRO
  const deleteRegister = () => {
    WebApiPeople.deletePatronalRegistration(idRegister, currentNode.id)
      .then((response) => {
        console.log("response", response);
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

  //PASAMOS DATA DEL REGISTRO A ELIMINAR PARA LUEGO ABRIR MODAL
  const setDeleteRegister = (data) => {
    setDeleted(data);
    setIdRegister(data.id);
  };

  //RECOPILAMOS LOS DATOS DE LOS FORMULARIOS
  const saveForms = () => {
    const data = {
      node: currentNode.id,
      patronal: formPatronal.getFieldsValue(),
      address: formAddress.getFieldsValue(),
      representative: formLegalRep.getFieldsValue(),
      jobRisk: formJobRisk.getFieldValue(),
    };
    console.log("antes de enviar", data);
    if (isEdit) {
      //PASAMOS DATOS FALTANTES DEL FORM ADRESS.
      data.address.country = country;
      data.address.municipality = municipality;
      data.address.state = state;
      //FORMATEAMOS FECHA QUE VIENE POR OBJETO MOMENT PARA PASARLO CON FORMATO CORRECTO.
      data.jobRisk.month = data?.jobRisk?.month
        ? parseInt(moment(data?.jobRisk?.month?._d).format("MM"))
        : null;
      data.jobRisk.year = data?.jobRisk?.year
        ? parseInt(moment(data?.jobRisk?.year?._d).format("YYYY"))
        : null;
      updateRegister(data);
    } else {
      saveRegister(data);
    }
  };

  //MODAL PARA CONFIRMAR SI SE VA ELIMINAR EL REGISTRO
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
    setLabelForm("Nuevo Registro Patronal");
  };

  //MÉTODO PARA ENSEÑAR U OCULTAR TABLA Y ENSEÑAR FORMULARIO
  const onChange = () => {
    setVisibleTable(false);
    setDisabledSwitch(true);
  };

  //SE SETEAN LOS VALORES DEL REGISTRO A SUS INPUTS PARA PODER SER EDITADOS
  const editRegister = (item) => {
    setLabelForm("Editar Registro Patronal");
    setDisabledSwitch(true);
    setIsEdit(true);
    setIdRegister(item.id);
    setVisibleTable(false);
    setCp(item?.fiscal_address?.postal_code?.id);
    setCountry(item?.fiscal_address?.country?.id);
    setMunicipality(item?.fiscal_address?.municipality?.id);
    setState(item?.fiscal_address?.state?.id);
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
    formJobRisk.setFieldsValue({
      patronal_registartion: item?.id,
      id: item?.job_risk_premium?.id,
      job_risk_class: item?.job_risk_premium?.job_risk_class,
      job_risk_percent: item?.job_risk_premium?.job_risk_percent,
      //FORMATEAMOS LOS DATOS PARA CONVERTIRLOS EN OBJETO DE MOMENT PARA QUE PUEDAN SER LEÍDOS POR EL DATEPICKER.
      year: moment(
        item?.job_risk_premium?.year + "-01-15T16:18:56.355272-05:00"
      ),
      month: moment(
        "2022-" + item?.job_risk_premium?.month + "-15T16:18:56.355272-05:00"
      ),
      stps_accreditation: item?.job_risk_premium?.stps_accreditation,
      rt_fraction: item?.job_risk_premium?.rt_fraction,
    });
    formLegalRep.setFieldsValue({
      name: item?.legal_representative?.name,
      position: item?.legal_representative?.position,
      email: item?.legal_representative?.email,
      phone: item?.legal_representative?.phone,
      contact_name: item?.legal_representative?.contact_name,
      contact_email: item?.legal_representative?.contact_email,
    });
    formAddress.setFieldsValue({
      postal_code: item?.fiscal_address?.postal_code?.code,
      country: item?.fiscal_address?.country?.description,
      state: item?.fiscal_address?.state?.name_state,
      municipality: item?.fiscal_address?.municipality?.description,
      street: item?.fiscal_address?.street,
      suburb: item?.fiscal_address?.suburb,
      interior_number: item?.fiscal_address?.interior_number,
      outdoor_number: item?.fiscal_address?.outdoor_number,
    });
  };

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
          <Table dataSource={dataPatronalRegistration} columns={columns} />
        </Spin>
      )}
      {!visibleTable && (
        <>
          <Row>
            <Col span={24}>
              <Row>
                <Title style={{ fontSize: "15px" }}>{labelForm}</Title>
              </Row>
              <Divider style={{ marginTop: "2px" }} />
              <FormPatronalRegistration
                patronalRegistration={
                  patronalData && patronalData.patronal_registartion
                }
                form={formPatronal}
              />
              <Row>
                <Title style={{ fontSize: "15px" }}>Dirección fiscal</Title>
              </Row>
              <Divider style={{ marginTop: "2px" }} />
              <FormFiscalAddress
                fiscalAddress={patronalData && patronalData.fiscal_address}
                form={formAddress}
                pos_cod={cp}
              />
              <Row>
                <Title style={{ fontSize: "15px" }}>
                  Prima de riesgo laboral
                </Title>
              </Row>
              <Divider style={{ marginTop: "2px" }} />
              <JobRiskPremium
                JobRiskPremium={patronalData && patronalData.job_risk_premium}
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
    currentNode: state.userStore.current_node
  };
};

export default connect(mapState)(withAuthSync(ImssInformationNode));
