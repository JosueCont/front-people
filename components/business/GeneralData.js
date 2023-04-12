import { Col, Input, Row, Typography, Form, Button, message, Tabs } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { withAuthSync } from "../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../config/config";
import WebApiPeople from "../../api/WebApiPeople";
import {
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import {ruleEmail, rulePhone} from "../../utils/rules";

const GeneralData = ({ node_id, ...props }) => {
  let router = useRouter();
  const [companyInfo, setCompanyInfo] = useState(null);
  const [form] = Form.useForm();
  const { TextArea } = Input;

  useEffect(() => {
    if (node_id) getNodeInformation();
  }, [node_id]);

  const getNodeInformation = () => {
    WebApiPeople.generalInfoNode("get", null, `?node=${node_id}`)
      .then((response) => {
        setCompanyInfo(response.data);
        form.setFieldsValue({
          contact_email: response.data.contact_email,
          contact_phone: response.data.contact_phone,
          about_us: response.data.about_us,
          policies: response.data.policies,
          business_rules: response.data.business_rules,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinish = (data) => {
    data.node = node_id;
    if (companyInfo) {
      updateInfo(data);
    } else {
      createInfo(data);
    }
  };

  const createInfo = (data) => {
    WebApiPeople.generalInfoNode("post", data)
      .then((response) => {
        message.success(messageSaveSuccess);
        setCompanyInfo(response.data);
      })
      .catch((error) => {
        message.error(messageError);
        console.log(error);
      });
  };

  const updateInfo = (data) => {
    WebApiPeople.generalInfoNode("put", data, `${companyInfo.id}/`)
      .then(function (response) {
        message.success(messageUpdateSuccess);
      })
      .catch(function (error) {
        message.error(messageError);
      });
  };
  return (
    <Form onFinish={onFinish} layout={"vertical"} form={form}>
      <Row className="container-items-center">
        <Col lg={6} xs={22} offset={1}>
          <Form.Item rules={[ruleEmail]} name="contact_email" label="Email:">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item rules={[rulePhone]} name="contact_phone" label="Teléfono:">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} offset={1}></Col>
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
              <Button type="danger" onClick={() => router.push("/business/companies")}>
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
  );
};

export default withAuthSync(GeneralData);
