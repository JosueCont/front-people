import {
  Form,
  Input,
  Spin,
  Button,
  message,
  Row,
  Col,
  Typography,
  Select,
  Switch,
  Divider,
} from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import UploadFile from "../../UploadFile";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import { curpFormat, rfcFormat, ruleRequired } from "../../../utils/rules";
import FiscalAddress from "../../forms/FiscalAddress";
import FiscalInformation from '../../forms/FiscalInformation';

const FiscalInformationNode = ({ node_id, fiscal }) => {
  const { Title } = Typography;
  const [formTaxInfo] = Form.useForm();
  const [fiscalAddress] = Form.useForm();
  const [pTypeSelected, setPTypeSelected] = useState(0);
  const [acceptAgreement, setAcceptAgreement] = useState(false);

  const [loading, setLoading] = useState(false);
  const [infoId, setInfoId] = useState(null);
  const [taxRegimePhysical, setTaxRegimePhysical] = useState([]);
  const [taxRegimeMoral, setTaxRegimeMoral] = useState([]);

  /* Files */
  const [taxStamp, setTaxStamp] = useState(null);
  const [nameTaxStamp, setNameTaxStamp] = useState(null);
  const [key, setKey] = useState(null);
  const [nameKey, setNameKey] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [nameCertificate, setNameCertificate] = useState(null);

  useEffect(() => {
    getTaxRegime();
    getFiscalInfotmation(node_id);
  }, [node_id]);

  useEffect(() => {
    if (pTypeSelected == 1) {
      formTaxInfo.setFieldsValue({
        curp: "",
        tax_regime: "",
      });
    }
  }, [pTypeSelected]);

  useEffect(() => {}, [nameTaxStamp]);
  useEffect(() => {}, [nameKey]);
  useEffect(() => {}, [nameCertificate]);

  

  const selectPersonType = (value) => {
    setPTypeSelected(value);
  };

  const changeAcceptment = () => {
    if (acceptAgreement) {
      setTaxStamp(null);
      setKey(null);
      setCertificate(null);
    }
    setAcceptAgreement(!acceptAgreement);
  };

  const getTaxRegime = async () => {
    Axios.get(API_URL + `/fiscal/tax-regime/`)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.results.length > 0) {
            let tax_regime_physical = [];
            response.data.results.map((a) => {
              if (a.physical == true) {
                tax_regime_physical.push({ value: a.id, label: a.description });
              }
            });
            setTaxRegimePhysical(tax_regime_physical);

            let tax_regime_moral = [];
            response.data.results.map((a) => {
              if (a.moral == true) {
                tax_regime_moral.push({ value: a.id, label: a.description });
              }
            });
            setTaxRegimeMoral(tax_regime_moral);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const formFinish = (value) => {
    let fiscalInfo = formTaxInfo.getFieldsValue();
    let address = fiscalAddress.getFieldsValue();
  };

  // const formFinish = (value) => {
  //   let data = new FormData();
  //   data.append("node", node_id);
  //   data.append(
  //     "assimilated_pay",
  //     value.assimilated_pay == undefined ? false : value.assimilated_pay
  //   );
  //   data.append("tax_regime", value.tax_regime);
  //   data.append("country", value.country);
  //   data.append("state", value.state);
  //   data.append("person_type", value.person_type);
  //   data.append("curp", value.curp ? value.curp : "");
  //   data.append("rfc", value.rfc ? value.rfc : "");
  //   data.append(
  //     "assimilated_pay",
  //     value.assimilated_pay ? value.assimilated_pay : false
  //   );
  //   data.append("suburb", value.suburb);
  //   data.append("street", value.street);
  //   data.append("interior_number", value.interior_number);
  //   data.append("password_fiscal", value.password ? value.password : "");
  //   if (taxStamp) {
  //     data.append("tax_stamp", taxStamp);
  //   } else if (taxStamp == null && nameTaxStamp == null) {
  //     data.append("tax_stamp", "");
  //   }
  //   if (key) {
  //     data.append("key", key);
  //   } else if (key == null && nameKey == null) {
  //     data.append("key", "");
  //   }
  //   if (certificate) {
  //     data.append("certificate", certificate);
  //   } else if (certificate == null && nameCertificate == null) {
  //     data.append("certificate", "");
  //   }
  //   if (infoId) {
  //     data.append("id", infoId);
  //     updateFiscalnformation(data);
  //   } else {
  //     saveFiscalnformation(data);
  //   }
  // };

  const getFiscalInfotmation = async (node_id) => {
    setLoading(true);
    Axios.get(API_URL + `/business/fiscal-information/?node__id=${node_id}`)
      .then((response) => {
        if (response.status === 200) {
          if (response.data) {
            let info = response.data;
            console.log("fiscal info  => ", info);
            setInfoId(info.id);
            setPTypeSelected(info.person_type);
            console.log('person_type =>',info.person_type);
            if (info.tax_stamp) {
              setNameTaxStamp(info.tax_stamp);
            }
            if (info.key) {
              setNameKey(info.key);
            }
            if (info.certificate) {
              setNameCertificate(info.certificate);
            }
            formTaxInfo.setFieldsValue({
              tax_regime: info.tax_regime,
              country: info.country,
              state: info.state,
              person_type: info.person_type,
              curp: info.curp ? info.curp : "",
              rfc: info.rfc ? info.rfc : "",
              assimilated_pay: info.assimilated_pay,
              suburb: info.suburb,
              street: info.street,
              interior_number: info.interior_number,
              password: info.password_fiscal,
              consent:
                info.tax_stamp || info.key || info.certificate ? true : false,
            });
            setAcceptAgreement(
              info.tax_stamp || info.key || info.certificate ? true : false
            );
          }
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const saveFiscalnformation = async (data) => {
    setLoading(true);
    Axios.post(API_URL + `/business/fiscal-information/`, data)
      .then((response) => {
        if (response.status == 200) {
          setLoading(false);
          message.success({
            content: "Guardado correctamente.",
            className: "custom-class",
          });
        }
      })
      .catch((e) => {
        message.error("Error al actualizar, intente de nuevo.");
        console.log(e);
      });
  };

  const updateFiscalnformation = async (data) => {
    setLoading(true);

    Axios.put(API_URL + `/business/fiscal-information/${infoId}/`, data)
      .then((response) => {
        if (response.status == 200) {
          setLoading(false);
          message.success({
            content: "Actualizado correctamente.",
            className: "custom-class",
          });
        }
      })
      .catch((e) => {
        message.error("Error al actualizar, intente de nuevo.");
        console.log(e);
      });
  };

  return (
    <>
      <Spin tip="Cargando..." spinning={loading}>
      <Row>
          <Col span={24}>
            <Row>
              <Title style={{ fontSize: "15px" }}>Informacion fiscal</Title>
            </Row>
            <Divider style={{ marginTop: "2px" }} />
            <FiscalInformation 
              infoId={infoId}
              formTaxInfo={formTaxInfo} 
              taxRegimePhysical={taxRegimePhysical} 
              taxRegimeMoral={taxRegimeMoral} 
              pTypeSelected={pTypeSelected}
              setPTypeSelected={setPTypeSelected}
            />
            <Row>
              <Title style={{ fontSize: "15px" }}>Dirección fiscal</Title>
            </Row>
            <Divider style={{ marginTop: "2px" }} />
            <FiscalAddress node={node_id} formAddress={fiscalAddress} />
          </Col>
          {/* <Row justify={"end"}>
            <Form.Item>
              <Button type="primary" onClick={() => formFinish()}>
                Guardar
              </Button>
            </Form.Item>
          </Row> */}
        </Row>
      </Spin>
    </>
  );
};

export default FiscalInformationNode;
