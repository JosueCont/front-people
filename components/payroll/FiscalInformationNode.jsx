import { useEffect, useLayoutEffect, useState } from "react";
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
  Space,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@material-ui/icons";
import WebApiPeople from "../../api/WebApiPeople";
import {
  messageError,
  messageSaveSuccess,
  messageUploadSuccess,
  redirectTo,
} from "../../utils/constant";
import UploadFile from "../UploadFile";
import WebApiFiscal from "../../api/WebApiFiscal";
import FormFiscalInformation from "./forms/FormFiscalInformation";
import LegalRepresentative from "./forms/LegalRepresentative";
import FormFiscalAddress from "./forms/FormFiscalAddress";
import FileUpload from '../jobbank/FileUpload';
import moment from 'moment'
import { ruleRequired } from "../../utils/rules";
import { downloadCustomFile } from "../../utils/functions";

const FiscalInformationNode = ({ node_id = null, fiscal }) => {
  const { Title } = Typography;
  const [formCert] = Form.useForm();
  const [formFiscal] = Form.useForm();
  const [formAddress] = Form.useForm();
  const [formLegalRep] = Form.useForm();
  const [fiscalData, setFiscalData] = useState(null);
  // const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [messageCert, setMessageCert] = useState(null);
  const [loadingCert, setLoadingCert] = useState(false);
  const [existsCSD, setExistsCSD] = useState(false);

  const [key, setKey] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [password, setPassword] = useState("");
  const [dateExpirationCertificate, setDateExpirationCertificate] = useState(null)
  const [validateExpirationCertificate, setValidateExpirationCertificate] = useState(false)

  const [fileCert, setFileCert] = useState([]);
  const [fileKey, setFileKey] = useState([]);

  useEffect(() => {
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

  useEffect(() => {
    if (fiscalData) {
      let values = {};
      values.cer_name_read = values.certificate
        ? values.certificate?.split('/').at(-1) : null;
      values.key_name_read = values.key ? values.key?.split('/').at(-1) : null;
      values.password = values.password ? values.password : null;
      formCert.setFieldsValue(values)
    }
  }, [fiscalData])

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

  // const validatedPass = (value) => {
  //   if (value && value != "") {
  //     setPassword(value.trim());
  //     formCert.setFieldsValue({ passcer: value.trim() });
  //   }
  // };

  const validateCSDExists = async () => {
    try {
      setLoadingCert(true)
      setExistsCSD(false)
      let response = await WebApiFiscal.validateExistsCsdsMultiEmmiter(node_id);
      if (response?.data?.message) {
        setExistsCSD(true)
        setLoadingCert(false)
        let expDate = response?.data?.data?.CsdExpirationDate;
        let expired = moment().isAfter(moment(expDate));
        setValidateExpirationCertificate(!expired);
        setDateExpirationCertificate(moment(expDate).format('L'))
        return;
      }
      setExistsCSD(false)
      setLoadingCert(false)
    } catch (e) {
      console.log(e)
      setLoadingCert(false)
      setExistsCSD(false)
    }
  }

  const actionCert = async (data) => {
    try {
      setLoadingCert(true)
      let response = await WebApiFiscal.uploadCsdsMultiEmmiter(data, node_id);
      if (response?.data?.message?.status) {
        setMessageCert(null)
        formCert.resetFields();
        message.success('Archivos cargados')
        validateCSDExists();
        return;
      }
      let msg = response?.data?.message || null;
      setLoadingCert(false)
      setMessageCert(msg)
    } catch (e) {
      console.log(e)
      setLoadingCert(false)
      setMessageCert(null)
    }
  }

  const onFinishCert = (values) => {
    let data = new FormData();
    data.append('node', node_id);
    data.append('password', values?.password);
    if (fileCert.length > 0) data.append('cer', fileCert[0]);
    if (fileKey.length > 0) data.append('key', fileKey[0]);
    actionCert(data)
  }

  const actionCertDownload = async () => {
    try {
      let response = await WebApiPeople.downloadCsdsMultiEmmiter(node_id);
      let cer = response?.data?.cer_file_url;
      let key = response?.data?.key_file_url;
      downloadCustomFile({ url: cer, name: cer?.split('?')[0].split('/').at(-1) })
      downloadCustomFile({ url: key, name: key?.split('?')[0].split('/').at(-1) })
    } catch (e) {
      console.log(e)
      message.error('Archivos no descargados')
    }
  }

  const normalizePass = (value = '') => value?.trim();

  // const uploadCsds = () => {
  //   if (password && certificate && key) {
  //     setLoadingCert(true)
  //     let data = new FormData();
  //     data.append("node", node_id);
  //     data.append("cer", certificate);
  //     data.append("key", key);
  //     data.append("password", password);
  //     setMessageCert(null);
  //     setExistsCSD(false)
  //     WebApiFiscal.uploadCsdsMultiEmmiter(data, node_id)
  //       .then((response) => {
  //         if (response?.data?.message) {
  //           //gdzul
  //           if (typeof response?.data?.message?.status === 'boolean' && response?.data?.message?.status === true) {
  //             message.success(messageUploadSuccess);
  //             setAcceptAgreement(false)
  //             formCert.resetFields()
  //           } else {
  //             setMessageCert(response?.data?.message);
  //           }
  //           validateCSDExists()

  //           openNotification('info',response?.data?.message)
  //         } else {
  //           setMessageCert(null)
  //           message.success(messageUploadSuccess);
  //         }
  //         setLoadingCert(false)

  //       })
  //       .catch((error) => {
  //         console.log(error)
  //         message.error(messageError);
  //         setLoadingCert(false)
  //       });
  //   }
  // };

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
        <Space>
          <Title level={5} style={{ marginBottom: 0 }}>
            Certificados y sellos digitales
          </Title>
          <Typography.Link
            style={{
              backgroundColor: '#fafafa',
              padding: '0px 5px',
              borderRadius: 4
            }}
            target="_blank"
            href="https://www.sat.gob.mx/aplicacion/16660/genera-y-descarga-tus-archivos-a-traves-de-la-aplicacion-certifica"
          >
            Liga para generar o renovar tu e.firma
          </Typography.Link>
        </Space>
        <Divider style={{ marginTop: "2px" }} />
      </Row>
      <Row styl>
        <Form
          form={formCert}
          layout="vertical"
          onFinish={onFinishCert}
          style={{ width: '100%' }}
        >
          <Spin spinning={loadingCert}>
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="password"
                  label="Contraseña"
                  rules={[ruleRequired]}
                  normalize={normalizePass}
                >
                  <Input.Password
                    placeholder="Contraseña"
                    maxLength={12}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <FileUpload
                  upload={false}
                  isRequired={true}
                  label='Certificado (cer)'
                  keyName='cer_name_red'
                  typeFile={['cer']}
                  setFile={setFileCert}
                  tooltip={`Archivos permitidos: cer`}
                  onError={e => formCert.setFields([{ name: 'cer_name_red', errors: [e] }])}
                  setNameFile={e => formCert.setFieldsValue({ cer_name_red: e })}
                />
              </Col>
              <Col xs={24} lg={8}>
                <FileUpload
                  upload={false}
                  isRequired={true}
                  label='Llave (key)'
                  keyName='key_name_read'
                  typeFile={['key']}
                  setFile={setFileKey}
                  tooltip={`Archivos permitidos: key`}
                  onError={e => formCert.setFields([{ name: 'cer_name_red', errors: [e] }])}
                  setNameFile={e => formCert.setFieldsValue({ key_name_read: e })}
                />
              </Col>
              <Col span={24}>
                {messageCert && (
                  <Alert
                    message="Información"
                    description={messageCert}
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                )}
                {existsCSD && (
                  <Alert
                    message="Archivos detectados"
                    description={`Se detectaron los CSD para esta empresa, ${validateExpirationCertificate ? '' : 'sin embargo se encuentran vencidos, recuerda que '}la opción de subir nuevos Certificados
                   y Sellos Digitales estará siempre disponible.`}
                    type={validateExpirationCertificate ? 'success' : 'warning'}
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                )}
                {dateExpirationCertificate && (
                  <Alert
                    message={validateExpirationCertificate ? 'Certificado vigente' : 'Certificado vencido'}
                    description={`La vigencia de tu certificado es ${dateExpirationCertificate}`}
                    type={validateExpirationCertificate ? 'success' : 'error'}
                    showIcon
                    style={{ marginBottom: 24 }}
                  />
                )}
              </Col>
              <Col span={24} style={{ display: 'flex' }}>
                <Space style={{ marginLeft: 'auto' }}>
                  {existsCSD && (
                    <Button htmlType="button" onClick={() => actionCertDownload()}>
                      Descargar archivos
                    </Button>
                  )}
                  <Button htmlType="submit">
                    {existsCSD ? 'Actualizar' : 'Guardar'}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Row>
    </>
  );
};

export default FiscalInformationNode;
