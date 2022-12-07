import React, { useEffect, useState, useLayoutEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Typography,
  Breadcrumb,
  Button,
  Form,
  Input,
  notification,
  message,
  Spin,
} from "antd";
import { useRouter } from "next/router";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
import WebApiPayroll from "../../api/WebApiPayroll";
import { ruleRequired, onlyNumeric } from "../../utils/rules";

const LendingConfig = (props) => {
  const route = useRouter();
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [permissions, setPermissions] = useState({});

  useLayoutEffect(() => {
    setPermissions(props.permissions);
    setTimeout(() => {
      permissions;
    }, 5000);
  }, [props.permissions]);

  const getConfig = async () => {
    setLoading(true);
    let url = `get_config_for_node/?node=${props.currentNode.id}`;
    WebApiPayroll.getConfigLoan(url)
      .then(function (response) {
        let data = response.data;
        setConfig(data);
        form.setFieldsValue({
          min_amount: data.min_amount ? parseInt(data.min_amount) : "",
          max_amount: data.max_amount ? parseInt(data.max_amount) : "",
          min_deadline: data.min_deadline ? data.min_deadline : "",
          max_deadline: data.max_deadline ? data.max_deadline : "",
        });
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const saveConfig = async (values) => {
    setSending(true);
    if (config && config.id) {
      WebApiPayroll.updateConfigLoan(config.id, values)
        .then(function (response) {
          route.push("/lending");
          notification["success"]({
            message: "Aviso",
            description: "Información guardada correctamente.",
          });
        })
        .catch(function (error) {
          console.log(error);
          setSending(false);
        });
    } else {
      values.node = props.currentNode.id;
      WebApiPayroll.saveConfigLoan(values)
        .then(function (response) {
          route.push("/lending");
          notification["success"]({
            message: "Aviso",
            description: "Información guardada correctamente.",
          });
        })
        .catch(function (error) {
          setSending(false);
          console.log(error);
          message.error("Ocurrio un error, intente de nuevo.");
        });
    }
  };

  useEffect(() => {
    if (props.currentNode) getConfig();
  }, [props.currentNode]);

  return (
    <MainLayout currentKey={["lending"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
        <Breadcrumb.Item>Concierge</Breadcrumb.Item>
        <Breadcrumb.Item>Solicitudes</Breadcrumb.Item>
        <Breadcrumb.Item className={"pointer"}
                         onClick={() => route.push({ pathname: "/lending" })}>Préstamos</Breadcrumb.Item>
        <Breadcrumb.Item>Configuración</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: 20 }}
      >
        {permissions.view && (
          <Row>
            <Col span={24}>
              <Spin tip="Cargando..." spinning={loading}>
                <Form layout="vertical" onFinish={saveConfig} form={form}>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Title key="dats_gnrl" level={4}>
                        Monto
                      </Title>
                    </Col>
                    <Col xl={12} md={12} sm={24}>
                      <Form.Item
                        name="min_amount"
                        label="Mínimo"
                        rules={[ruleRequired, onlyNumeric]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col xl={12} md={12} sm={24}>
                      <Form.Item
                        label="Máximo"
                        name="max_amount"
                        rules={[ruleRequired, onlyNumeric]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Title key="dats_gnrl" level={4}>
                        Plazos
                      </Title>
                    </Col>
                    <Col xl={12} md={12} sm={24}>
                      <Form.Item
                        label="Mínimo"
                        name="min_deadline"
                        rules={[ruleRequired, onlyNumeric]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col xl={12} md={12} sm={24}>
                      <Form.Item
                        label="Máximo"
                        name="max_deadline"
                        rules={[ruleRequired, onlyNumeric]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ paddingTop: 20 }} justify={"end"}>
                    <Col span={24} style={{ textAlign: "right" }}>
                      <Button
                        onClick={() => route.push("/lending")}
                        style={{ padding: "0 40px", margin: "0 10px" }}
                      >
                        Cancelar
                      </Button>

                      {config &&
                      config.id != 0 &&
                      config.id != "" &&
                      config.id != undefined &&
                      permissions.edit ? (
                        <Button
                          loading={sending}
                          key="update"
                          htmlType="submit"
                          type="primary"
                          style={{ padding: "0 40px", margin: "0 10px" }}
                        >
                          Guardar
                        </Button>
                      ) : (
                        permissions.create && (
                          <Button
                            loading={sending}
                            key="save"
                            htmlType="submit"
                            type="primary"
                            style={{ padding: "0 40px", margin: "0 10px" }}
                          >
                            Guardar
                          </Button>
                        )
                      )}
                    </Col>
                  </Row>
                </Form>
              </Spin>
            </Col>
          </Row>
        )}
      </div>
    </MainLayout>
  );
};
const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.loanconfigure,
  };
};

export default connect(mapState)(withAuthSync(LendingConfig));
