import {
  Form,
  Input,
  Layout,
  Modal,
  DatePicker,
  Button,
  Space,
  Select,
  message,
  Row,
  Col,
  Switch,
} from "antd";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { useState, useEffect } from "react";
import {
  getAccessIntranet,
  userCompanyId,
  userCompanyName,
} from "../../libs/auth";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import WebApi from "../../api/webApi";
import { ruleEmail } from "../../utils/constant";
import moment from "moment";
import { getPeopleCompany } from "../../redux/UserDuck";
import SelectGroup from "../selects/SelectGroup";
import SelectJob from "../selects/SelectJob";
import SelectDepartment from "../selects/SelectDepartment";
import SelectPersonType from "../selects/SelectPersonType";

const FormPerson = ({
  config = null,
  hideProfileSecurity = true,
  intranetAccess = true,
  node = null,
  nameNode = "",
  setPerson = null,
  ...props
}) => {
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);
  const [personType, setPersonType] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [date, setDate] = useState("");
  const [dateIngPlatform, setDateIngPlatform] = useState("");

  const [departments, setDepartments] = useState("");
  let nodeId = userCompanyId();
  let accessIntranet = getAccessIntranet();

  useEffect(() => {
    if (node) {
      changeNode();
      getValueSelects();
    }
  }, [node]);

  const onFinish = (value) => {
    if (date !== "") {
      value.birth_date = date;
    }
    if (dateIngPlatform !== "") {
      value.register_date = dateIngPlatform;
    }
    if (value.node) delete value["node"];
    if (value.department) delete value["department"];
    if (value.password != value.passwordTwo)
      message.error("Las contraseñas no coinciden.");
    else {
      delete value["passwordTwo"];
      value.groups = [value.groups];
      if (nodeId) value.node = nodeId;
      else value.node = node;
      createPerson(value);
    }
  };

  const getValueSelects = async (id) => {
    const headers = {
      "client-id": config.client_khonnect_id,
      "Content-Type": "application/json",
    };

    let company = `?company=${node}`;

    /////PERMSS GROUPS
    Axios.get(config.url_server_khonnect + "/group/list/" + company, {
      headers: headers,
    })
      .then((response) => {
        if (response.status === 200) {
          let group = response.data.data;
          group = group.map((a) => {
            return { label: a.name, value: a.id };
          });
          setGroups(group);
        }
      })
      .catch((e) => {
        console.log(e);
      });

    /////PERSON TYPE
    Axios.get(API_URL + `/person/person-type/`)
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

  const createPerson = async (value) => {
    try {
      let response = await WebApi.createPerson(value);
      if (setPerson) {
        setPerson(response.data.person);
        sessionStorage.setItem("tok", response.data.person.id);
      }
      props.getPeopleCompany(node);
      message.success("Agregado correctamente");
      form.resetFields();
      props.close(false);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "exist"
      )
        message.error("El correo se encuentra registrado.");
      else message.error("Error al agregar, intente de nuevo");
    }
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

  function onChange(date, dateString) {
    setDate(dateString);
  }

  const onChangeIngPlatform = (date, dateString) => {
    setDateIngPlatform(dateString);
  };

  const closeDialog = () => {
    props.close(false);
    form.resetFields();
  };
  const ruleRequired = { required: true, message: "Este campo es requerido" };

  const changeNode = () => {
    form.setFieldsValue({
      job: null,
      department: null,
    });
    setDepartments([]);
    Axios.get(API_URL + `/business/department/?node=${node}`)
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
      });
  };

  const onChangeDepartment = (value) => {
    ////JOBS
    form.setFieldsValue({
      job: null,
    });
    Axios.get(API_URL + `/person/job/?department=${value}`)
      .then((response) => {
        if (response.status === 200) {
          let job = response.data;
          job = job.map((a) => {
            return { label: a.name, value: a.id };
          });
          setJobs(job);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Layout>
        <Modal
          maskClosable={false}
          title="Alta de personas"
          centered
          visible={props.visible}
          onCancel={() => closeDialog()}
          footer={null}
          width={"60%"}
        >
          <Form
            initialValues={{
              intranet_access: false,
            }}
            onFinish={onFinish}
            form={form}
          >
            <Row>
              <Col lg={7} xs={22} offset={1}>
                <SelectPersonType />
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item rules={[ruleRequired]}>
                  <Input readOnly value={nameNode} />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <SelectDepartment
                  titleLabel={false}
                  onChange={onChangeDepartment}
                  name="person_department"
                  style={false}
                />
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <SelectJob titleLabel={false} name="job" style={false} />
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item rules={[ruleRequired]} name="first_name">
                  <Input type="text" placeholder="Nombre" />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item rules={[ruleRequired]} name="flast_name">
                  <Input type="text" placeholder="Apellido paterno" />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="mlast_name">
                  <Input type="text" placeholder="Apellido materno" />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="gender">
                  <Select options={genders} placeholder="Género" />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item>
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={onChange}
                    moment={"YYYY-MM-DD"}
                    placeholder="Fecha de nacimiento"
                  />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="code">
                  <Input type="text" placeholder="Núm. empleado" />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item rules={[ruleEmail, ruleRequired]} name="email">
                  <Input
                    type="email"
                    placeholder="E-mail"
                    onBlur={(value) =>
                      form.setFieldsValue({
                        email: value.target.value.toLowerCase(),
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item rules={[ruleRequired]} name="password">
                  <Input.Password type="text" placeholder="Contraseña" />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item
                  rules={[
                    ruleRequired,
                    ({ getFieldValue }) => ({
                      validator() {
                        if (
                          getFieldValue("password") ==
                          getFieldValue("passwordTwo")
                        ) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject("Las contraseñas no coinciden");
                        }
                      },
                    }),
                  ]}
                  name="passwordTwo"
                >
                  <Input.Password type="text" placeholder="Contraseña" />
                </Form.Item>
              </Col>
              {accessIntranet !== "false" && intranetAccess && (
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item
                    name="intranet_access"
                    label="Acceso a la intranet"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col lg={7} xs={22} offset={1}>
                <Form.Item>
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={onChangeIngPlatform}
                    defaultValue={moment()}
                    moment={"YYYY-MM-DD"}
                    placeholder="Fecha de ingreso a la plataforma"
                  />
                </Form.Item>
              </Col>
              {/* {hideProfileSecurity && ( */}
              <Col lg={7} xs={22} offset={1}>
                <SelectGroup />
              </Col>
              <Col lg={22} xs={22} offset={1}>
                <Form.Item labelAlign="right">
                  <Space style={{ float: "right" }}>
                    <Button onClick={() => closeDialog()}>Cancelar</Button>
                    <Button type="primary" htmlType="submit">
                      Guardar
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Layout>
    </>
  );
};

const mapState = (state) => {
  return {};
};

export default connect(mapState, { getPeopleCompany })(FormPerson);
