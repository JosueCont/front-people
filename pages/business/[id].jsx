import {
  Breadcrumb,
  Col,
  Input,
  Row,
  Spin,
  Typography,
  Form,
  Button,
  message,
} from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { withAuthSync } from "../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../config/config";

const ConfigCompany = () => {
  let router = useRouter();
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [company, setCompany] = useState();
  const [companyInfo, setCompanyInfo] = useState();
  const [form] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;

  useEffect(() => {
    {
      Axios.get(API_URL + "/business/node/" + router.query.id + "/")
        .then(function (response) {
          setCompany(response.data);
        })
        .catch(function (error) {});
      Axios.get(API_URL + `/business/node-information/?node=${router.query.id}`)
        .then(function (response) {
          if (response.data.results.length > 0) {
            setUpdate(true);
            setCompanyInfo(response.data.results[0]);
            form.setFieldsValue({
              address: response.data.results[0].address,
              contact_email: response.data.results[0].contact_email,
              contact_phone: response.data.results[0].contact_phone,
              about_us: response.data.results[0].about_us,
              policies: response.data.results[0].policies,
              business_rules: response.data.results[0].business_rules,
            });
          }
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }
  }, [router.query.id]);

  const onFinish = (data) => {
    data.node = company.id;
    setLoading(true);
    if (update) {
      updateInfo(data);
    } else {
      createInfo(data);
    }
  };

  const createInfo = (data) => {
    Axios.post(API_URL + `/business/node-information/`, data)
      .then(function (response) {
        message.success("Agregado correctamente.");
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch(function (error) {
        message.error("Ocurrio un error, intente de nuevo");
        setLoading(false);
        console.log(error);
      });
  };

  const updateInfo = (data) => {
    Axios.put(API_URL + `/business/node-information/${companyInfo.id}/`, data)
      .then(function (response) {
        message.success("Actualizado correctamente.");
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch(function (error) {
        message.error("Ocurrio un error, intente de nuevo");
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <MainLayout currentKey="2">
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/business" })}
        >
          Empresas
        </Breadcrumb.Item>
        <Breadcrumb.Item className={"pointer"}>
          Datos de la empresa
        </Breadcrumb.Item>
      </Breadcrumb>
      <Spin tip="Cargando..." spinning={loading}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          {company && <Title level={3}>{company.name}</Title>}

          <Form onFinish={onFinish} layout={"vertical"} form={form}>
            <Row className="container-items-center">
              <Col lg={6} xs={22} offset={1}>
                <Form.Item name="address" label="Dirección:" form={form}>
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item name="contact_email" label="Email:">
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item name="contact_phone" label="Teléfono:">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row className="container-items-center">
              <Col lg={20} xs={22} offset={1}>
                <Form.Item name="about_us" label="Descripción:">
                  <TextArea rows={6} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="container-items-center">
              <Col lg={20} xs={22} offset={1}>
                <Form.Item name="policies" label="Políticas:">
                  <TextArea rows={6} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="container-items-center">
              <Col lg={20} xs={22} offset={1}>
                <Form.Item name="business_rules" label="Reglas del negocio:">
                  <TextArea rows={6} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"end"} className="container-items-center">
              <Col lg={20} xs={22} offset={1} justify={"end"}>
                <Row justify={"end"}>
                  <Col offset={1}>
                    <Button
                      type="danger"
                      onClick={() => router.push("/business")}
                    >
                      Cancelar
                    </Button>
                  </Col>
                  <Col offset={1}>
                    <Button type="primary" htmlType="submit">
                      Guardar
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </MainLayout>
  );
};

export default withAuthSync(ConfigCompany);
