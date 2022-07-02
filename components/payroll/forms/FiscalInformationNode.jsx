import { CheckOutlined, CloseOutlined } from "@material-ui/icons";
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
import { useLayoutEffect, useState } from "react";
import WebApiPeople from "../../../api/WebApiPeople";
import { messageError, messageSaveSuccess } from "../../../utils/constant";
import UploadFile from "../../UploadFile";
import FiscalAddress from "../../forms/FiscalAddress";
import FiscalInformation from "../../forms/FiscalInformation";
import LegalRepresentative from "../../forms/LegalRepresentative";

const FiscalInformationNode = ({ node_id = null, fiscal }) => {
  const { Title } = Typography;
  const [formFiscal] = Form.useForm();
  const [formAddress] = Form.useForm();
  const [formLegalRep] = Form.useForm();
  const [fiscalData, setFiscalData] = useState(null);
  const [acceptAgreement, setAcceptAgreement] = useState(false);

  const [taxStamp, setTaxStamp] = useState(null);
  const [nameTaxStamp, setNameTaxStamp] = useState(null);
  const [key, setKey] = useState(null);
  const [nameKey, setNameKey] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [nameCertificate, setNameCertificate] = useState(null);

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

  return (
    <>
      <Row>
        <Col span={24}>
          <Divider style={{ marginTop: "2px" }} />
          <FiscalInformation
            form={formFiscal}
            fiscalData={fiscalData && fiscalData}
          />
          <Row>
            <Title style={{ fontSize: "15px" }}>Dirección fiscal</Title>
          </Row>
          <Divider style={{ marginTop: "2px" }} />
          <FiscalAddress
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
              <Form.Item name="consent" label="" valuePropName="checked">
                <Switch
                  onChange={(value) => setAcceptAgreement(value)}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col lg={14} xs={22} offset={1}>
              <p>
                Estoy de acuerdo y doy mi consentimiento para que EL SISTEMA
                almacene y utilice estos archivos con fines exclusivos para
                emisión de CFDI para el timbrado de nómina
              </p>
            </Col>
          </Row>
          <Row>
            {acceptAgreement && (
              <Form layout={"vertical"}>
                <Col offset={1} style={{ marginBottom: "15px", width: "100%" }}>
                  <Form.Item name="password" label="Contraseña">
                    <Input.Password maxLength={12} />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={22}>
                  <UploadFile
                    textButton={"Cargar sello fiscal"}
                    setDataFile={setTaxStamp}
                    file_name={nameTaxStamp}
                    setFileName={setNameTaxStamp}
                    set_disabled={nameTaxStamp ? false : true}
                  />
                </Col>
                <Col lg={12} xs={22}>
                  <UploadFile
                    textButton={"Cargar llave"}
                    setDataFile={setKey}
                    file_name={nameKey}
                    setFileName={setNameKey}
                    set_disabled={nameKey ? false : true}
                  />
                </Col>
                <Col lg={12} xs={22}>
                  <UploadFile
                    textButton={"Cargar certificado"}
                    setDataFile={setCertificate}
                    file_name={nameCertificate}
                    setFileName={setNameCertificate}
                    set_disabled={nameCertificate ? false : true}
                  />
                </Col>
                <Row justify="end">
                  <Button onClick={saveForms}>Guardar</Button>
                </Row>
              </Form>
            )}
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default FiscalInformationNode;
