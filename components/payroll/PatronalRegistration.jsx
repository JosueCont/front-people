import { useLayoutEffect, useState } from "react";
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
} from "antd";
import { CheckOutlined, CloseOutlined } from "@material-ui/icons";
import WebApiPeople from "../../api/WebApiPeople";
import {
  messageError,
  messageSaveSuccess,
  messageUploadSuccess,
} from "../../utils/constant";
import UploadFile from "../UploadFile";
import WebApiFiscal from "../../api/WebApiFiscal";
import LegalRepresentative from "./forms/LegalRepresentative";
import FormFiscalAddress from "./forms/FormFiscalAddress";
import FormPatronalRegistration from "./forms/FormPatronalRegistration";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
import JobRiskPremium from "./forms/jobRiskPremium";

const ImssInformationNode = ({ node_id = null, fiscal, ...props }) => {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [formPatronal] = Form.useForm();
  const [formAddress] = Form.useForm();
  const [formLegalRep] = Form.useForm();
  const [patronalData, setPatronalData] = useState(null);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    if (node_id) {
      WebApiPeople.getfiscalInformationNode(node_id)
        .then((response) => {
          setPatronalData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [node_id]);

  const saveForms = () => {
    const data = {
      node: node_id,
      patronal: formPatronal.getFieldsValue(),
      address: formAddress.getFieldsValue(),
      representative: formLegalRep.getFieldsValue(),
    };
    console.log("FORMS--->> ", data);
    WebApiPeople.patronalRegistration(data)
      .then((response) => {
        message.success(messageSaveSuccess);
      })
      .catch((error) => {
        console.log(error);
        message.error(messageError);
      });
  };

  const validatedPass = (value) => {
    if (value && value != "") {
      setPassword(value.trim());
      form.setFieldsValue({ passcer: value.trim() });
    }
  };

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

  return (
    <>
      <Row>
        <Col span={24}>
          <Row>
            <Title style={{ fontSize: "15px" }}>Registro patronal</Title>
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
          />
          <Row>
            <Title style={{ fontSize: "15px" }}>Prima de riezgo laboral</Title>
          </Row>
          <Divider style={{ marginTop: "2px" }} />
          <JobRiskPremium />
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
        <Button onClick={saveForms}>Guardar</Button>
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
                      onChange={(value) => validatedPass(value.target.value)}
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
  );
};

const mapState = (state) => {
  return { currentNode: state.userStore.current_node };
};

export default connect(mapState)(withAuthSync(ImssInformationNode));
