import { useEffect, useLayoutEffect, useMemo, useState } from "react";
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
import { CheckCircleOutline, CheckOutlined, CloseOutlined } from "@material-ui/icons";
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
import styled from '@emotion/styled';
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const AlertCert = styled.div`
  background-color: ${({ type }) => type == 'success' ? '#f6ffed' : '#fffbe6'} ;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ type }) => type == 'success' ? '#b7eb8f' : '#ffe58f'};
  padding: 8px;
  margin-bottom: 24px;
  .anticon{
    font-size: 24px;
    color: ${({ type }) => type == 'success' ? '#52c41a' : '#faad14'};
  }
`;

const FiscalInformationNode = ({ node_id = null, fiscal }) => {
  const { Title } = Typography;
  const [formCert] = Form.useForm();
  const [formFiscal] = Form.useForm();
  const [formAddress] = Form.useForm();
  const [formLegalRep] = Form.useForm();

  const [loading, setLoading] = useState(true);
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

  const { current_node } = useSelector(state => state.userStore);
  
  const showDownload = useMemo(() => {
    if (current_node?.id != node_id) return false;
    return current_node?.cer_file_name && current_node?.key_file_name;
  }, [current_node, node_id])

  useEffect(() => {
    if (node_id) {
      getInfoFiscal();
    }
  }, [node_id]);

  const getInfoFiscal = async () => {
    try {
      setLoading(true)
      let response = await WebApiPeople.getfiscalInformationNode(node_id);
      if (response?.data?.rfc) validateCSDExists();
      setFiscalData(response.data)
      setLoading(false)
    } catch (e) {
      setFiscalData([])
      setLoading(false)
      console.log(e)
    }
  }

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
        setFiscalData({ ...fiscalData, ...response?.data?.fiscal })
        message.success(messageSaveSuccess);
      })
      .catch((error) => {
        console.log(error);
        message.error(messageError);
      });
  };

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
      message.error('Archivos no cargados')
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
      if (!cer || !key) {
        message.error('Archivos no encontrados')
        return;
      }
      downloadCustomFile({ url: cer, name: cer?.split('?')[0].split('/').at(-1) })
      downloadCustomFile({ url: key, name: key?.split('?')[0].split('/').at(-1) })
    } catch (e) {
      console.log(e)
      message.error('Archivos no descargados')
    }
  }

  const normalizePass = (value = '') => value?.trim();

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
      {!loading && (
        <>
          {fiscalData?.rfc ? (
            <Row>
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
                        <AlertCert type={validateExpirationCertificate ? 'success' : 'warning'}>
                          <Space align='start'>
                            {validateExpirationCertificate ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                            <div>
                              <h3 style={{ marginBottom: 0 }}>
                                Archivos detectados
                              </h3>
                              <p style={{ marginBottom: 0 }}>
                                Se detectaron los CSD para esta empresa, {validateExpirationCertificate ? '' : 'sin embargo se encuentran vencidos, recuerda que '}la opción de subir nuevos Certificados
                                y Sellos Digitales estará siempre disponible.
                              </p>
                              <h3 style={{ marginBottom: 0 }}>
                                {validateExpirationCertificate ? 'Certificado vigente' : 'Certificado vencido'}
                              </h3>
                              <p>
                                La vigencia de tu certificado es {dateExpirationCertificate}
                              </p>
                            </div>
                          </Space>
                        </AlertCert>
                      )}
                    </Col>
                    <Col span={24} style={{ display: 'flex' }}>
                      <Space style={{ marginLeft: 'auto' }}>
                        {(existsCSD || showDownload) && (
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
          ) : (
            <Alert
              type="warning"
              message="RFC no detectado"
              description="Para visualizar este apartado es necesario registrar dicho valor."
              showIcon
            />
          )}
        </>
      )}
    </>
  );
};

export default FiscalInformationNode;
