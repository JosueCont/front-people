import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Input,
  Row,
  Typography,
  Upload,
  Form,
  message,
  InputNumber,
  Tabs,
  Space,
  Switch,
} from "antd";
import { API_URL_TENANT } from "../../config/config";
import { downLoadFileBlob, getDomain } from "../../utils/functions";
import { CheckOutlined, CloseOutlined, DownloadOutlined } from "@ant-design/icons";
import UploadFile from "../UploadFile";
import WebApiFiscal from "../../api/WebApiFiscal";
import { toInteger } from "lodash";
import { useRouter } from "next/router";
import { ruleRequired } from "../../utils/rules";

const IntegrationFactorsForm = ({ nodeId, factor }) => {
  const { Title, Text } = Typography;
  const { TabPane } = Tabs;
  const [formFactor] = Form.useForm();
  const [formExcel] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [excel, setExcel] = useState(null);
  const [description, setDescription] = useState("");
  const route = useRouter();

  useEffect(() => {
    if (factor) {
      formFactor.setFieldsValue({
        vacations_days: factor.vacations_days,
        vacation_percent: factor.vacation_percent,
        bonus_days: factor.bonus_days,
        description: factor.description,
        distribute_with_previous_law: factor.distribute_with_previous_law
      });
      formExcel.setFieldsValue({
        excelDescription: factor.description,
      });
      setDescription(factor.description);
    }
  }, [factor]);

  const routeIndex = () => {
    route.push({ pathname: "/business/integrationFactors" });
  };

  const clearErrors = () => {
    formFactor.setFields([
      {
        name: "vacations_days",
        errors: [],
      },
      {
        name: "vacation_percent",
        errors: [],
      },
      {
        name: "bonus_days",
        errors: [],
      },
    ]);
  };

  const onSaveFactor = async (values) => {
    setLoading(true);
    values.node = nodeId;
    values.bonus_days = toInteger(values.bonus_days);
    values.vacation_percent = toInteger(values.vacation_percent);
    values.vacations_days = toInteger(values.vacations_days);
    WebApiFiscal.saveIntegrationFactor(values)
      .then((response) => {
        if (response.data.message && response.data.message == "success") {
          setLoading(false);
          formFactor.resetFields();
          message.success("Configuración agregada");
          setTimeout(routeIndex(), 3000);
        }
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          message.error("Configuración existente");
          setLoading(false);
        }, 3000);
      });
  };

  const updateFactor = async (values) => {
    setLoading(true);
    values.node = nodeId;
    values.bonus_days = toInteger(values.bonus_days);
    values.vacation_percent = toInteger(values.vacation_percent);
    values.vacations_days = toInteger(values.vacations_days);
    await WebApiFiscal.updateIntegratorFactor(values, factor.id)
      .then((response) => {
        if (response.data.message && response.data.message == "success") {
          setLoading(false);
          formFactor.resetFields();
          message.success("Configuración Editada");
          setTimeout(routeIndex(), 3000);
        }
      })
      .catch((error) => {
        console.log("Error=>", error.response);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(error.response.data.message);
        } else message.error(messageError);

        // console.log(error);
        // setTimeout(() => {
        //   message.error("Configuración existente");
        //   setLoading(false);
        // }, 3000);
      });
  };

  const downloadIntegratorFactor = async () => {
    setLoading(true);
    downLoadFileBlob(
      `${getDomain(
        API_URL_TENANT
      )}/fiscal/integration-factors-report?integration_factor_id=${factor.id}`,
      `${
        factor && factor.description
          ? factor.description + ".xlsx"
          : "Factor.xlsx"
      }`,
      "GET"
    );
    setLoading(false);
  };

  const updatebyExcel = async () => {
    setLoading(true);
    let data = new FormData();
    data.append("File", excel);
    data.append("description", description);
    data.append("integration_factor_id", factor.id);
    WebApiFiscal.updatebyExcel(data)
      .then((response) => {
        let success = response.data.message == "success";
        if (success) {
          setLoading(false);
          message.success("Configuración Editada");
          setTimeout(routeIndex(), 3000);
        }
      })
      .catch((e) => {
        console.log("Error=>", e.response);
        if (e.response && e.response.data && e.response.data.message) {
          message.error(e.response.data.message);
          setLoading(false);
        } else {
          let dataError = e.response.data || null;
          if (dataError && dataError.message == "Excepcion 'File'") {
            message.error("suba un archivo");
          }
          setLoading(false);
        }
      });
  };

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab={factor ? "Editar" : "Crear"} key={"1"}>
        <Form
          layout={"vertical"}
          form={formFactor}
          onFinish={factor ? updateFactor : onSaveFactor}
          size="large"
        >
          <Row gutter={30} style={{ marginBottom: 20 }}>
            <Col lg={8} xs={12}>
              <Form.Item
                  label="Nombre"
                  name="description"
                  rules={[ruleRequired]}
              >
                <Input maxLength={150} showCount={true} />
              </Form.Item>
            </Col>
            <Col lg={8} xs={12}>
              <Form.Item
                label="Número de días de vacaciones"
                name="vacations_days"
                rules={[ruleRequired]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  onFocus={clearErrors}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={12}>
              <Form.Item
                label="Porcentaje de prima vacacional"
                name="vacation_percent"
                rules={[ruleRequired]}
              >
                <InputNumber
                  max={100}
                  min={1}
                  style={{ width: "100%" }}
                  onFocus={clearErrors}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={12}>
              <Form.Item
                label="Días de aguinaldo"
                name="bonus_days"
                rules={[ruleRequired]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  onFocus={clearErrors}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={12}>
              <Form.Item
                label="¿Repartir vacaciones con ley anterior?"
                name="distribute_with_previous_law"
                valuePropName="checked"
                >
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
              </Form.Item>
            </Col>

          </Row>
          <Row justify={"end"}>
            <Col>
              <Button
                className="close_modal"
                htmlType="button"
                style={{ marginRight: 10 }}
                onClick={() =>
                  route.push({ pathname: "/business/integrationFactors" })
                }
              >
                {factor && factor.id ? "Cerrar" : "Cancelar"}
              </Button>
              <Button loading={loading} type="primary" htmlType="submit">
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </TabPane>
      {factor && (
        <TabPane tab="Editar con Excel" key={2}>
          <Row gutter={30} style={{ marginBottom: 20, marginTop: 10 }}>
            <Col span={24}>
              <Text>
                Para editar el factor de integración primero descargue el
                archivo excel, siga las intrucciones del documento descargado y
                suba el documento usando el botón de Cargar Excel
              </Text>
            </Col>
          </Row>
          <Row gutter={30} style={{ marginBottom: 20, marginTop: 10 }}>
            <Col lg={8}>
              <Form form={formExcel}>
                <Form.Item name="excelDescription">
                  <Input.TextArea
                    style={{ height: "40px", maxHeight: "40px", width: "100%" }}
                    onChange={({ target }) => setDescription(target.value)}
                    placeholder="Descripción"
                    maxLength={150}
                    showCount={true}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col lg={4}>
              <Button
                className={"ml-20"}
                type="primary"
                style={{
                  height: "40px",
                  padding: "6.4px 15px",
                  fontSize: 16,
                }}
                icon={<DownloadOutlined />}
                size={{ size: "large" }}
                onClick={() => downloadIntegratorFactor()}
              >
                Descargar excel
              </Button>
            </Col>
            <Col lg={8}>
              <UploadFile
                textButton={"Cargar excel"}
                setFile={setExcel}
                showList={true}
              />
            </Col>
          </Row>
          <Row justify={"end"}>
            <Col>
              <Button
                className="close_modal"
                htmlType="button"
                style={{ marginRight: 10 }}
                onClick={() =>
                  route.push({ pathname: "/business/integrationFactors" })
                }
              >
                {factor && factor.id ? "Cerrar" : "Cancelar"}
              </Button>
              <Button
                disabled={excel ? false : true}
                loading={loading}
                type="primary"
                onClick={() => updatebyExcel()}
              >
                Guardar
              </Button>
            </Col>
          </Row>

          {/* <Form
              form={ formExcel }
              layout = 'vertical'
              onFinish={ (values) => { console.log(values) } }
            >
              <Row gutter={30} style={{ marginBottom: 20, marginTop: 10 }}>
                <Form.Item>
                  <UploadFile 
                    textButton={"Cargar excel"}
                    setFile={setExcel}
                    showList={true}
                  />
                </Form.Item>
              </Row>
            </Form> */}
        </TabPane>
      )}
    </Tabs>
  );
};

export default IntegrationFactorsForm;
