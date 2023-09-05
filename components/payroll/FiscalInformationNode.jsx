import { useLayoutEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Divider,
  Alert,
  Form,
  Button,
  message,
  Switch,
  Spin,
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
import moment from 'moment'

const FiscalInformationNode = ({ node_id = null, fiscal }) => {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [formFiscal] = Form.useForm();
  const [formAddress] = Form.useForm();
  const [formLegalRep] = Form.useForm();
  const [fiscalData, setFiscalData] = useState(null);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [messageCert, setMessageCert] = useState(null);
  const [loadingCert, setLoadingCert] = useState(false);
  const [existsCSD, setExistsCSD] = useState(false);

  const [key, setKey] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [password, setPassword] = useState("");
  const [dateExpirationCertificate, setDateExpirationCertificate] = useState(null)
  const [validateExpirationCertificate, setValidateExpirationCertificate] = useState(false)

  useLayoutEffect(() => {
    if (node_id) {
      WebApiPeople.getfiscalInformationNode(node_id)
        .then((response) => {
          setFiscalData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
        validateCSDExists()
    }
  }, [node_id]);

  const saveForms = async () => {
    if (!(await validateForms())) return;
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

  const validateCSDExists=async ()=>{
    setLoadingCert(true)
    setExistsCSD(false)
    try {
      const response = await WebApiFiscal.validateExistsCsdsMultiEmmiter(node_id)
      if(typeof response?.data?.message === 'boolean' && response?.data?.message===true){
        setExistsCSD(true)
        let dateExp = moment(response.data.data.CsdExpirationDate)
        let diffDate = dateExp.diff(moment())
        if (diffDate > 0){
          setValidateExpirationCertificate(true)
        }
        setDateExpirationCertificate(moment(response.data.data.CsdExpirationDate).format('L'))
      }
    }catch (e){
      console.log('error',e)
      setExistsCSD(false)
    }finally {
      setLoadingCert(false)
    }
  }


  const uploadCsds = () => {
    if (password && certificate && key) {
      setLoadingCert(true)
      let data = new FormData();
      data.append("node", node_id);
      data.append("cer", certificate);
      data.append("key", key);
      data.append("password", password);
      setMessageCert(null);
      setExistsCSD(false)
      WebApiFiscal.uploadCsdsMultiEmmiter(data, node_id)
        .then((response) => {
          if(response?.data?.message){
            //gdzul
            if(typeof response?.data?.message?.status === 'boolean' && response?.data?.message?.status===true){
              message.success(messageUploadSuccess);
              setAcceptAgreement(false)
              form.resetFields()
            }else{
              setMessageCert(response?.data?.message);
            }
            validateCSDExists()

           // openNotification('info',response?.data?.message)
          }else{
            setMessageCert(null)
            message.success(messageUploadSuccess);
          }
          setLoadingCert(false)

        })
        .catch((error) => {
          console.log(error)
          message.error(messageError);
          setLoadingCert(false)
        });
    }
  };

  const validateForms = async () => {
    let validformFiscal = await formFiscal
      .validateFields()
      .then((result) => {
        return true;
      })
      .catch((err) => {
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

    if (validformFiscal && validformAddress) return true;
    return false;
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
          <Spin spinning={loadingCert}>
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
                <Col span={24}>
                  {
                    messageCert && <Alert
                    message="Información"
                    description={messageCert}
                    type="info"
                    showIcon
                    />
                  }
                </Col>
                <Row justify="end">
                  <Button
                      loading={loadingCert}
                    disabled={password && certificate && key ? false : true}
                    onClick={() => uploadCsds()}
                  >
                    Guardar certificados
                  </Button>
                </Row>
              </Form>
            )}
            {
                existsCSD && <Alert
                    message="Archivos detectados"
                    description={`Se detectaron los CSD para esta empresa, ${validateExpirationCertificate?'':'sin embargo se encuentran vencidos, recuerda que '}la opción de subir nuevos Certificados
                    y Sellos Digitales estará siempre disponible.`}
                    type={validateExpirationCertificate?'success':'warning'}
                    showIcon
                />
            }
            {
              dateExpirationCertificate && <div><br /><Alert
              message={validateExpirationCertificate?'Certificado vigente':'Certificado vencido'}
              description={`La vigencia de tu certificado es ${dateExpirationCertificate}`}
              type={validateExpirationCertificate?'success':'error'}
              showIcon
          /></div>
            }
          </div>
          </Spin>


        </Col>
      </Row>
    </>
  );
};

export default FiscalInformationNode;
