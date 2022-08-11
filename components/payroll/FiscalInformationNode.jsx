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
import FormFiscalInformation from "./forms/FormFiscalInformation";
import LegalRepresentative from "./forms/LegalRepresentative";
import FormFiscalAddress from "./forms/FormFiscalAddress";

const FiscalInformationNode = ({ node_id = null, fiscal }) => {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [formFiscal] = Form.useForm();
  const [formAddress] = Form.useForm();
  const [formLegalRep] = Form.useForm();
  const [fiscalData, setFiscalData] = useState(null);
  const [acceptAgreement, setAcceptAgreement] = useState(false);

  const [key, setKey] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    if (node_id) {
      WebApiPeople.getfiscalInformationNode(node_id)
        .then((response) => {
          setFiscalData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [node_id]);

  const saveForms = () => {
    const data = {
      node: node_id,
      fiscal: formFiscal.getFieldsValue(),
      address: formAddress.getFieldsValue(),
      representative: formLegalRep.getFieldsValue(),
    };
    WebApiPeople.savefiscalInformation(data)
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
          <Divider style={{ marginTop: "2px" }} />
          <FormFiscalInformation
            form={formFiscal}
            fiscalData={fiscalData && fiscalData}
          />
          <Row>
            <Title style={{ fontSize: "15px" }}>Dirección fiscal</Title>
          </Row>
          <Divider style={{ marginTop: "2px" }} />
          <FormFiscalAddress
            fiscalAddress={fiscalData && fiscalData.fiscal_address}
            form={formAddress}
          />
          <Row>
            <Title style={{ fontSize: "15px" }}>Representante legal</Title>
          </Row>
          <Divider style={{ marginTop: "2px" }} />
          <LegalRepresentative
            legalRepresentative={fiscalData && fiscalData.legal_representative}
            form={formLegalRep}
          />
        </Col>
      </Row>
      <Row justify="end">
        <Button onClick={saveForms}>Guardar</Button>
      </Row>
      <Row>
        <Title style={{ fontSize: "15px" }}>
          Certificados y sellos digitales
        </Title>
      </Row>
      <Row>
        <Col>
          <Divider style={{ marginTop: "2px" }} />
          <Row>
            <Col lg={2} xs={22} offset={1}>
              <Form form={form}>
                <Form.Item name="consent" label="" valuePropName="checked">
                  <Switch
                    onChange={(value) => setAcceptAgreement(value)}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col lg={14} xs={22} offset={1}>
              <p>
                Estoy de acuerdo y doy mi consentimiento para que EL SISTEMA
                almacene y utilice estos archivos con fines exclusivos para
                emisión de CFDI para el timbrado de nómina.
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
                    textButton={"Cargar llave"}
                    setFile={setKey}
                    validateExtension={".key"}
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

export default FiscalInformationNode;
