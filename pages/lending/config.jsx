import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Typography,
  Table,
  Breadcrumb,
  Image,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  notification,
  Space,
  Switch,
} from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import moduleName from "../../components/forms/LendingForm";
import moment from "moment";
import Lendingform from "../../components/forms/LendingForm";
import { withAuthSync } from "../../libs/auth";
import Axios from 'axios'
import {API_URL} from '../../config/config'


const HolidaysNew = () => {
  const route = useRouter();
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);

  const onCancel = () => {
    route.push("/lending");
  };

  const getConfig = async () =>{
      setLoading(true);
      try {
          let repsonse = await Axios.get(API_URL+`/payroll/loan-config/1/`);
          console.log('response', repsonse);
          let data = repsonse.data;
          form.setFieldsValue({
            min_amount: parseInt(data.max_amount),
            max_amount:  parseInt(data.max_amount),
            min_deadline: data.min_deadline,
            max_deadline: data.max_deadline
          })

      } catch (error) {
          console.log(error)
      }
  }

  const saveConfig = async (values) => {
      console.log(values);
      setSending(true);
      try {
          let response = await Axios.patch(API_URL+`/payroll/loan-config/1/`, values);
          console.log(values);
          route.push('/lending');
          notification["success"]({
            message: "Aviso",
            description: "Información guardada correctamente.",
          });
      } catch (error) {
          console.log('error', error);
      }finally{
        setSending(false);
      }
  }

  useEffect(() => {
    getConfig();
  },[])


  return (
    <MainLayout currentKey="7.1">
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item href="./">Préstamos</Breadcrumb.Item>
        <Breadcrumb.Item>Configuración</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row justify={"center"}>
          <Col span={23}>
            <Form layout="horizontal" onFinish={saveConfig} form={form}>
              <Row justify={"start"}>
                <Col span={24}>
                  <Title key="dats_gnrl" level={4}>
                    Cantidad
                  </Title>
                </Col>
                <Col span="8">
                  <Form.Item
                    name="min_amount"
                    label="minimum"
                    labelCol={{ span: 10 }}
                    labelAlign={"left"}
                  >
                    <InputNumber style={{ width: '150px' }} />
                  </Form.Item>
                  <Form.Item
                    label="Maximo"
                    name="max_amount"
                    labelCol={{ span: 10 }}
                    labelAlign={"left"}
                  >
                    <InputNumber style={{ width: '150px' }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Title key="dats_gnrl" level={4}>
                    Plazos
                  </Title>
                </Col>
                <Col span="8">
                  <Form.Item
                    label="Minimo"
                    name="min_deadline"
                    labelCol={{ span: 10 }}
                    labelAlign={"left"}
                  >
                    <InputNumber style={{ width: '150px' }} />
                  </Form.Item>
                  <Form.Item
                    label="Maximo"
                    name="max_deadline"
                    labelCol={{ span: 10 }}
                    labelAlign={"left"}
                  >
                    <InputNumber style={{ width: '150px' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ paddingTop: 20 }}>
                <Col span={10} style={{ textAlign: 'right' }}>
                    <Button style={{ padding: '0 40px', margin: '0 10px' }}>
                        Cancelar
                    </Button>
                    <Button loading={sending} htmlType="submit" type={'primary'} style={{ padding: '0 40px', margin: '0 10px' }}>
                        Guardar
                    </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(HolidaysNew);
