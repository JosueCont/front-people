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

const HolidaysNew = () => {
  const route = useRouter();
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [sending, setSending] = useState(false);
  const { Option } = Select;
  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);
  const [job, setJob] = useState(null);
  const [dateOfAdmission, setDateOfAdmission] = useState(null);
  const [availableDays, setAvailableDays] = useState(null);
  const [personList, setPersonList] = useState(null);
  const [allPersons, setAllPersons] = useState(null);
  const [antiquity, setAntiquity] = useState(null);

  const onCancel = () => {
    route.push("/lending");
  };

  return (
    <MainLayout currentKey="7.1">
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item href="./">Prestamos</Breadcrumb.Item>
        <Breadcrumb.Item>Configuración</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row justify={"center"}>
          <Col span={23}>
            <Form layout="horizontal">
              <Row justify={"start"}>
                <Col span={24}>
                  <Title key="dats_gnrl" level={4}>
                    Cantidad
                  </Title>
                </Col>
                <Col span="8">
                  <Form.Item
                    label="Minimo"
                    labelCol={{ span: 10 }}
                    labelAlign={"left"}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Maximo"
                    labelCol={{ span: 10 }}
                    labelAlign={"left"}
                  >
                    <Input />
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
                    labelCol={{ span: 10 }}
                    labelAlign={"left"}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Maximo"
                    labelCol={{ span: 10 }}
                    labelAlign={"left"}
                  >
                    <Input />
                  </Form.Item>
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
