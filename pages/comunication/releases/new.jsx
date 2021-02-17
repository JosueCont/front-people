import React, { useEffect, useState, useRef } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Typography,
  Table,
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  notification,
  Space,
  Switch,
} from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import cookie from "js-cookie";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import BreadcrumbHome from "../../../components/BreadcrumbHome";
import SelectCompany from "../../../components/selects/SelectCompany";
import FormItemHTMLPlace from '../../../components/draft';


import dynamic from "next/dynamic";
import { withAuthSync } from "../../../libs/auth";


const Newrelease = () => {
  let userToken = cookie.get("token") ? cookie.get("token") : null;
  const [form] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const route = useRouter();

  const [message, setMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState(null);
  const [khonnectId, setKhonnectId] = useState(null);
  const [bussinessList, setBusinessList] = useState(null);
  const [messageAlert, setMessageAlert] = useState(false);

  const [personType, setPersonType] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);

  let json = JSON.parse(userToken);

  useEffect(() => {
    if (json) {
      setUserId(json.user_id);
      /* getBussiness(); */
      getValueSelects();
    } else {
      console.log("no json");
    }
  }, []);

  const saveNotification = async (values) => {
    setMessageAlert(false);
    values["khonnect_id"] = userId;
    values["created_by"] = userId;
    values["message"] = message;
    if (values.target_gender == 0) {
      delete values["target_gender"];
    }
    if(!message || (message && message.length <= 8)){
        console.log("Requerido");
        setMessageAlert(true);
    }
    return;


    setSending(true);
    try {
      let response = await Axios.post(
        API_URL + `/noticenter/notification/`,
        values
      );
      let data = response.data;
      notification["success"]({
        message: "Aviso",
        description: "Información enviada correctamente.",
      });
      route.push("/comunication/releases");
      console.log("res", response.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setSending(false);
    }
  };

  const getBussiness = async () => {
    try {
      let response = await Axios.get(API_URL + `/business/node/`);
      let data = response.data.results;
      console.log("data", data);
      let options = [];
      data.map((item) => {
        options.push({ id: item.id, name: item.name });
      });
      console.log();
      setBusinessList(options);
      //  notification['success']({
      //           message: 'Notification Title',
      //           description:
      //             'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      //         });
      //         route.push('/comunication/releases');
    } catch (error) {
      console.log("error", error);
    }
  };

  const setHtml = (html) =>{
    console.log(html);
    setMessage(html);
  }

  const onCancel = () => {
    route.push("/comunication/releases");
  };

  const genders = [
    {
      label: "Todos",
      value: 0,
    },
    {
      label: "Masculino",
      value: 1,
    },
    {
      label: "Femenino",
      value: 2,
    },
    {
      label: "Otro",
      value: 3,
    },
  ];

  const typeMessage = [
    {
      label: "Noticias",
      value: 2,
    },
    {
      label: "Aviso",
      value: 1,
    },
  ];

  /////GET DATA SELCTS
  const getValueSelects = async () => {
    /////PERSON TYPE
    await Axios.get(API_URL + `/person/person-type/`)
      .then((response) => {
        if (response.status === 200) {
          let typesPerson = response.data.results;
          typesPerson = typesPerson.map((a) => {
            return { label: a.name, value: a.id };
          });
          setPersonType(typesPerson);
        }
      })
      .catch((e) => {
        console.log("error_tipo_personas", e);
      });

    
  };

  const onChangecompany = async (value) => {
    console.log(value);
    /* Clear form in specific fields */
    form.setFieldsValue({
      target_department: null,
      target_job: null,
    });
    try {
      let response = await Axios.get(
        API_URL + `/business/node/${value}/department_for_node/`
      );
      let data = response.data;
      console.log("data", data);
      data = data.map((a) => {
        return { label: a.name, value: a.id, key: a.name + a.id };
      });
      setDepartments(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const onChangeDepartment = async (value) => {
    ////JOBS
    form.setFieldsValue({
      target_job: null,
    });
    try {
      let response = await Axios.get(
        API_URL + `/business/department/${value}/job_for_department/`
      );
      let data_jobs = response.data;
      console.log("data_jobs", data_jobs);
      data_jobs = data_jobs.map((a, index) => {
        return { label: a.name, value: a.id, key: a.name + index };
      });
      setJobs(data_jobs);
    } catch (error) {}
  };

  const ruleRequired = { required: true, message: "Este campo es requerido" };

  return (
    <MainLayout currentKey="4.1">
      <Breadcrumb key="Breadcrumb">
        <BreadcrumbHome />
        <Breadcrumb.Item href="./">Comunicados</Breadcrumb.Item>
        <Breadcrumb.Item>Nuevo</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container back-white" style={{ width: "100%" }}>
        <Row justify={"center"}>
          <Col span="23" style={{ padding: "20px 0 30px 0" }}>
            <Form
              key="notification_form"
              form={form}
              layout="horizontal"
              labelCol={{ xs: 24, sm: 24, md: 5 }}
              onFinish={saveNotification}
            >
              <Row>
                <Col span={24}>
                  <Title key="dats_gnrl" level={3}>
                    Datos Generales
                  </Title>
                </Col>
                <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                  <Form.Item
                    name="category"
                    label="Categoría"
                    labelAlign={"left"}
                    rules={[ruleRequired]}
                  >
                    <Select style={{ width: 250 }} options={typeMessage} />
                  </Form.Item>
                  <Form.Item
                    label="Título"
                    name="title"
                    labelAlign={"left"}
                    rules={[ruleRequired]}
                  >
                    <Input className={"formItemPayment"} />
                  </Form.Item>
                  <FormItemHTMLPlace messageAlert={messageAlert} setMessageAlert={setMessageAlert}  html="" setHTML={setHtml} />
                  
                </Col>

                <Col span={24}>
                  <Title level={3} key="segmentacion">
                    Segmentación
                  </Title>
                </Col>
                <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                  <Form.Item
                    name="send_to_all"
                    label="Enviar a todos"
                    labelAlign="left"
                  >
                    <Switch value={false} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                  <Row>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        name={"target_company"}
                        label="Empresa"
                        labelCol={{ span: 10 }}
                        rules={[ruleRequired]}
                      >
                        <SelectCompany onChange={onChangecompany} />

                      </Form.Item>
                      <Form.Item
                        name={"target_department"}
                        label="Departamento"
                        labelCol={{ span: 10 }}
                      >
                        <Select
                          options={departments}
                          onChange={onChangeDepartment}
                          placeholder="Departamento"
                          key="departament_select"
                        />
                      </Form.Item>
                      <Form.Item
                        name={"target_job"}
                        label="Puesto de trabajo"
                        labelCol={{ span: 10 }}
                      >
                        <Select options={jobs} key="jobs_select" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        name={"target_person_type"}
                        label="Tipo de persona"
                        labelCol={{ span: 10 }}
                      >
                        <Select options={personType} key="person_select" />
                      </Form.Item>
                      <Form.Item
                        name={"target_gender"}
                        label="Género"
                        labelCol={{ span: 10 }}
                      >
                        <Select options={genders} key="gender_select" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    key="cancel"
                    onClick={() => onCancel()}
                    disabled={sending}
                    style={{ padding: "0 50px", margin: "0 10px" }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    key="save"
                    htmlType="submit"
                    loading={sending}
                    type="primary"
                    style={{ padding: "0 50px", margin: "0 10px" }}
                  >
                    Enviar
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

export default withAuthSync(Newrelease);
