import React, { useEffect, useState, useRef } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Typography,
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  notification,
  Upload,
  Switch,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import FormItemHTMLPlace from "../../../components/draft";
/* import { userCompanyId } from "../../libs/auth"; */

import { withAuthSync, userCompanyId } from "../../../libs/auth";
import SelectJob from "../../../components/selects/SelectJob";
import SelectDepartment from "../../../components/selects/SelectDepartment";
import { ruleRequired } from "../../../utils/rules";
import { typeMessage } from "../../../utils/constant";

const Newrelease = () => {
  let nodeId = userCompanyId();
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
  const [fileList, setFileList] = useState([]);
  const [segmentationRequired, setSegmentationRequired] = useState(true);

  /* For input file */
  const [disabled, setDisabled] = useState(true);
  const inputFileRef = useRef(null);
  const [file, setFile] = useState();
  const [fileName, setfileName] = useState("");

  const [personType, setPersonType] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);

  let json = JSON.parse(userToken);

  const selectedFile = (file) => {
    if (file.target.files.length > 0) {
      setDisabled(false);
      setFile(file.target.files[0]);
      setfileName(file.target.files[0].name);
    } else {
      setDisabled(true);
      setFile(null);
      setfileName(null);
    }
  };

  const deleteFileSelect = () => {
    setFile(null);
    setDisabled(true);
    setfileName(null);
  };

  useEffect(() => {
    if (json) {
      setUserId(json.user_id);
      getDepartments();
      getValueSelects();
    }
  }, []);

  const uploadDocument = (data) => {
    Axios.post(API_URL + "/person/document/", data)
      .then((response) => {
        message.success({
          content: "Cargado correctamente.",
          className: "custom-class",
        });
        closeDialog();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const saveNotification = async (values) => {
    setMessageAlert(false);

    if (!message || (message && message.length <= 8)) {
      setMessageAlert(true);
      return;
    }

    let datos = new FormData();
    datos.append("category", values.category);
    datos.append("title", values.title);
    datos.append("message", message);
    datos.append("khonnect_id", userId);
    datos.append("target_company", nodeId);

    if (values.send_to_all) {
      datos.append("send_to_all", values.send_to_all);
    }
    if (values.target_department) {
      datos.append("target_department", values.target_department);
    }
    if (values.target_job) {
      datos.append("target_job", values.target_job);
    }
    if (values.target_person_type) {
      datos.append("target_person_type", values.target_person_type);
    }

    if (values.target_gender !== 0) {
      datos.append("gender", values.target_gender);
    }

    if (file) {
      fileList.map((f) => {
        datos.append("files", f.originFileObj);
      });
    }
    setSending(true);
    try {
      let response = await Axios.post(
        API_URL + `/noticenter/notification/`,
        datos,
        { headers: { "content-type": "multipart/form-data" } }
      );
      let data = response.data;
      notification["success"]({
        message: "Aviso",
        description: "Información enviada correctamente.",
      });
      route.push("/comunication/releases");
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const checkSegmentacion = ({ getFieldValue }) => ({
    validator(rule) {
      if (
        !getFieldValue("send_to_all") &&
        !getFieldValue("target_department") &&
        !getFieldValue("target_job") &&
        !getFieldValue("target_person_type") &&
        !getFieldValue("target_gender")
      ) {
        return Promise.reject("Selecciona una segmentación");
      }
      return Promise.resolve();
    },
  });

  const onchangeFile = (file) => {
    setFileList(file.fileList);
    setFile(
      file.fileList.map((a) => {
        return a.originFileObj;
      })
    );
  };

  const getBussiness = async () => {
    try {
      let response = await Axios.get(API_URL + `/business/node/`);
      let data = response.data.results;
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
      console.log(error);
    }
  };

  const setHtml = (html) => {
    setMessage(html);
  };

  const onCancel = () => {
    route.push("/comunication/releases");
  };

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
        console.log(e);
      });
  };

  const getDepartments = async () => {
    /* Clear form in specific fields */
    form.setFieldsValue({
      target_department: null,
      target_job: null,
    });
    try {
      let response = await Axios.get(
        API_URL + `/business/node/${nodeId}/department_for_node/`
      );
      let data = response.data;
      data = data.map((a) => {
        return { label: a.name, value: a.id, key: a.name + a.id };
      });
      setDepartments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeDepartment = async (value) => {
    ////JOBS
    form.setFieldsValue({
      target_job: null,
    });
    try {
      let response = await Axios.get(
        API_URL + `/person/job/?department=${value}`
      );
      let data_jobs = response.data;
      data_jobs = data_jobs.map((a, index) => {
        return { label: a.name, value: a.id, key: a.name + index };
      });
      setJobs(data_jobs);
    } catch (error) {}
  };

  const changeSendToAll = (e) => {
    console.log(e);
    setSegmentationRequired(!e);
  };

  return (
    <MainLayout currentKey="4.1">
      <Breadcrumb key="Breadcrumb">
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item href="./">Comunicados</Breadcrumb.Item>
        <Breadcrumb.Item>Nuevo</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px" }}
      >
        <Form
          key="notification_form"
          form={form}
          layout="vertical"
          onFinish={saveNotification}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Title key="dats_gnrl" level={3}>
                Datos Generales
              </Title>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="category"
                label="Categoría"
                labelAlign={"left"}
                rules={[ruleRequired]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={typeMessage}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="Título"
                name="title"
                labelAlign={"left"}
                rules={[ruleRequired]}
              >
                <Input className={"formItemPayment"} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <FormItemHTMLPlace
                messageAlert={messageAlert}
                setMessageAlert={setMessageAlert}
                html=""
                setHTML={setHtml}
              />

              {/*  */}
              <Form.Item>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onchangeFile}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
                <input
                  ref={inputFileRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => selectedFile(e)}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Title level={3} key="segmentacion">
                Segmentación
              </Title>
            </Col>
            <Col span={24}>
              <Form.Item
                name="send_to_all"
                label="Enviar a todos"
                labelAlign="left"
              >
                <Switch value={false} onChange={changeSendToAll} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <SelectDepartment name={"target_department"} viewLabel={false} />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <SelectJob name={"target_job"} viewLabel={false} />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name={"target_person_type"}
                label="Tipo de persona"
                labelCol={{ span: 24 }}
                rules={[checkSegmentacion]}
              >
                <Select
                  options={personType}
                  key="person_select"
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name={"target_gender"}
                label="Género"
                labelCol={{ span: 10 }}
                rules={[checkSegmentacion]}
              >
                <Select
                  options={genders}
                  key="gender_select"
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
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
                disabled={sending}
              >
                Enviar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(Newrelease);
