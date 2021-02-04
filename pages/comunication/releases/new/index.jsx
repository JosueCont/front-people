import React, { useEffect, useState, useRef } from "react";
import MainLayout from "../../../../layout/MainLayout";
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
import axiosApi from "../../../../libs/axiosApi";
import cookie from "js-cookie";
import Axios from "axios";
import { API_URL } from "../../../../config/config";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

// import { FroalaEditorComponent } from "react-froala-wysiwyg";
import dynamic from "next/dynamic";
const FroalaEditorComponent = dynamic(import("react-froala-wysiwyg"), {
  ssr: false,
});

const Newrelease = () => {
  let userToken = cookie.get("userToken") ? cookie.get("userToken") : null;
  const [form] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const route = useRouter();

  const [message, setMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState(null);
  const [bussinessList, setBusinessList] = useState(null);

  const [personType, setPersonType] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);

  let json = JSON.parse(userToken);

  useEffect(() => {
    if (json) {
      setUserId(json.user_id);
      /* getBussiness(); */
      getValueSelects();
    }
  }, []);

  const saveNotification = async (values) => {
      
    values["khonnect_id"] = userId;
    values["created_by"] = userId;
    values["message"] = message;
    console.log(values)
    setSending(true);
    try {
      let response = await axiosApi.post(`/noticenter/notification/`, values);
      let data = response.data;
      notification["success"]({
        message: "Notification Title",
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
      let response = await axiosApi.get(`/business/node/`);
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

  const onCancel = () => {
    route.push("/comunication/releases");
  };

  const genders = [
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
    Axios.get(API_URL + `/person/person-type/`)
      .then((response) => {
          console.log('response',response)
        if (response.status === 200) {
          let typesPerson = response.data.results;
          typesPerson = typesPerson.map((a) => {
            return { label: a.name, value: a.id };
          });
          setPersonType(typesPerson);
        }
      })
      .catch((e) => {
        console.log(e);
      });


    /////Companies
    try {
      let response = await axiosApi.get(`/business/node/`);
      let data = response.data.results;
      console.log("data", data);
      let options = [];
      data.map((item) => {
        options.push({ value: item.id, label: item.name });
      });
      setBusinessList(options);
    } catch (error) {
      console.log("error", error);
    }

    /* Axios.get(API_URL + `/business/department/`)
      .then((response) => {
        if (response.status === 200) {
          let dep = response.data.results;
          dep = dep.map((a) => {
            return { label: a.name, value: a.id };
          });
          setDepartments(dep);
        }
      })
      .catch((e) => {
        console.log(e);
      }); */
  };

  const onChangecompany = async (value) => {
    console.log(value);
    /* Clear form in specific fields */
    form.setFieldsValue({
        target_department: null,
        target_job: null
    });
    try {
        let response = await axiosApi.get(`business/node/${value}/department_for_node/`);
        let data = response.data;
        console.log("data", data);
        data = data.map((a) => {
            return { label: a.name, value: a.id, key: a.name+a.id };
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
    console.log(`business/department/${value}/job_for_department/`);
    try {
        let response = await axiosApi.get(`business/department/${value}/job_for_department/`);
        let data_jobs = response.data;
        console.log("data_jobs", data_jobs);
        data_jobs = data_jobs.map((a,index) => {
            return { label: a.name, value: a.id, key: a.name+index };
          });
          setJobs(data_jobs);
    } catch (error) {
        
    }
  };

  return (
    <MainLayout currentKey="4.1">
      <Breadcrumb key="Breadcrumb">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Comunicados</Breadcrumb.Item>
        <Breadcrumb.Item>Nuevo</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container back-white" style={{ width: "100%" }}>
        <Row   justify={"center"}>
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
                <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                  <Form.Item
                    name="category"
                    label="Categoria"
                    labelAlign={"left"}
                  >
                    <Select style={{ width: 250 }} options={typeMessage} />
                  </Form.Item>
                  <Form.Item label="Titulo" name="title" labelAlign={"left"}>
                    <Input className={"formItemPayment"} />
                  </Form.Item>
                  <Form.Item name="message" label="Mensaje" labelAlign="left">
                    <FroalaEditorComponent
                      key="message"
                      tag="textarea"
                      model={message}
                      onModelChange={setMessage}
                    />
                  </Form.Item>
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

                <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                  <Row>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        name={"company"}
                        label="Empresa"
                        labelCol={{ span: 10 }}
                      >
                        <Select
                          options={bussinessList}
                          onChange={onChangecompany}
                          placeholder="Empresa"
                          key="company_select"
                        />
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
                        label="Genero"
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

export default Newrelease;
