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
import { curpFormat, rfcFormat } from "../../../utils/constant";
import { ruleRequired } from "../../../utils/rules";

const TaxInformationForm = ({ node_id }) => {
  const { Title } = Typography;
  const [formTaxInfo] = Form.useForm();
  const [pTypeSelected, setPTypeSelected] = useState(0);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
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
    getCountries();
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

  const personType = [
    { value: 1, label: "Fisica" },
    { value: 2, label: "Moral" },
  ];

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

  const getCountries = async () => {
    Axios.get(API_URL + `/fiscal/country/`)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.results.length > 0) {
            let countries = response.data.results.map((st) => {
              return { value: st.id, label: st.description };
            });
            setCountries(countries);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getStates = async (country) => {
    Axios.get(API_URL + `/fiscal/state/?country=${country}`)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.results.length > 0) {
            let states = response.data.results.map((a) => {
              return { value: a.id, label: a.name_state };
            });
            setStates(states);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
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

  onchange = (value) => {
    getStates(value);
  };

  const formFinish = (value) => {
    let data = new FormData();
    data.append("node", node_id);
    data.append(
      "assimilated_pay",
      value.assimilated_pay == undefined ? false : value.assimilated_pay
    );
    data.append("tax_regime", value.tax_regime);
    data.append("country", value.country);
    data.append("state", value.state);
    data.append("person_type", value.person_type);
    data.append("curp", value.curp ? value.curp : "");
    data.append("rfc", value.rfc ? value.rfc : "");
    data.append(
      "assimilated_pay",
      value.assimilated_pay ? value.assimilated_pay : false
    );
    data.append("suburb", value.suburb);
    data.append("street", value.street);
    data.append("interior_number", value.interior_number);
    data.append("password_fiscal", value.password ? value.password : "");
    if (taxStamp) {
      data.append("tax_stamp", taxStamp);
    } else if (taxStamp == null && nameTaxStamp == null) {
      data.append("tax_stamp", "");
    }
    if (key) {
      data.append("key", key);
    } else if (key == null && nameKey == null) {
      data.append("key", "");
    }
    if (certificate) {
      data.append("certificate", certificate);
    } else if (certificate == null && nameCertificate == null) {
      data.append("certificate", "");
    }
    if (infoId) {
      data.append("id", infoId);
      updateFiscalnformation(data);
    } else {
      saveFiscalnformation(data);
    }
  };

  const getFiscalInfotmation = async (node_id) => {
    setLoading(true);
    Axios.get(API_URL + `/business/fiscal-information/?node__id=${node_id}`)
      .then((response) => {
        if (response.status === 200) {
          if (response.data) {
            let info = response.data;
            getStates(info.country);
            setInfoId(info.id);
            setPTypeSelected(info.person_type);
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
        <Form layout={"vertical"} form={formTaxInfo} onFinish={formFinish}>
          <Col span={24}>
            <Row>
              <Title style={{ fontSize: "15px" }}>Generales</Title>
            </Row>
            <Divider style={{ marginTop: "2px" }} />
            <Row>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="person_type"
                  label="Tipo de persona"
                  rules={[ruleRequired]}
                >
                  <Select
                    options={personType}
                    onChange={selectPersonType}
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Form.Item>
              </Col>
              {pTypeSelected === 1 && (
                <Col lg={6} xs={22} offset={1}>
                  <Form.Item name="curp" label="CURP" rules={[curpFormat]}>
                    <Input maxLength={18} />
                  </Form.Item>
                </Col>
              )}

              <Col lg={6} xs={22} offset={1}>
                <Form.Item name="rfc" label="RFC" rules={[rfcFormat]}>
                  <Input maxLength={13} />
                </Form.Item>
              </Col>
              <Col lg={13} xs={22} offset={1}>
                <Form.Item
                  name="tax_regime"
                  label="Regimen fiscal"
                  rules={[ruleRequired]}
                >
                  <Select
                    options={
                      pTypeSelected == 1 ? taxRegimePhysical : taxRegimeMoral
                    }
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="assimilated_pay"
                  label="Pago asimilados"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Title style={{ fontSize: "15px" }}>Dirección fiscal</Title>
            </Row>
            <Divider style={{ marginTop: "2px" }} />
            <Row>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item name="country" label="Pais" rules={[ruleRequired]}>
                  <Select
                    options={countries}
                    notFoundContent={"No se encontraron resultados."}
                    onChange={onchange}
                  />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item name="state" label="Estado" rules={[ruleRequired]}>
                  <Select
                    options={states}
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item name="suburb" label="Suburbio">
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item name="street" label="Calle" rules={[ruleRequired]}>
                  <Input maxLength={35} />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="interior_number"
                  label="Numero interior"
                  rules={[ruleRequired]}
                >
                  <Input maxLength={10} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Title style={{ fontSize: "15px" }}>
                Certificados y sellos digitales
              </Title>
            </Row>
            <Divider style={{ marginTop: "2px" }} />
            <Row>
              <Col lg={2} xs={22} offset={1}>
                <Form.Item name="consent" label="" valuePropName="checked">
                  <Switch
                    onChange={changeAcceptment}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col lg={14} xs={22} offset={1}>
                <p>
                  Estoy de acuerdo y doy mi consentimiento para que EL SISTEMA
                  almacene y utilice estos archivos con fines exclusivos para
                  emisión de CFDI para el timbrado de nomina
                </p>
              </Col>
              {acceptAgreement && (
                <>
                  <Col
                    lg={8}
                    xs={22}
                    offset={1}
                    style={{ marginBottom: "15px" }}
                  >
                    <Form.Item name="password" label="Contraseña">
                      <Input.Password maxLength={12} />
                    </Form.Item>
                  </Col>
                  <UploadFile
                    textButton={"Cargar sello fiscal"}
                    setDataFile={setTaxStamp}
                    file_name={nameTaxStamp}
                    setFileName={setNameTaxStamp}
                    set_disabled={nameTaxStamp ? false : true}
                  />
                  <UploadFile
                    textButton={"Cargar llave"}
                    setDataFile={setKey}
                    file_name={nameKey}
                    setFileName={setNameKey}
                    set_disabled={nameKey ? false : true}
                  />
                  <UploadFile
                    textButton={"Cargar certificado"}
                    setDataFile={setCertificate}
                    file_name={nameCertificate}
                    setFileName={setNameCertificate}
                    set_disabled={nameCertificate ? false : true}
                  />
                </>
              )}
            </Row>
          </Col>
          <Row justify={"end"}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default TaxInformationForm;
