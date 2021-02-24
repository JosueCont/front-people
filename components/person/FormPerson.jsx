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
} from "antd";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { useState, useEffect } from "react";

const FormPerson = (props) => {
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);
  const [personType, setPersonType] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [date, setDate] = useState("");
  const [departments, setDepartments] = useState("");
  const [selectCompany, setselectCompany] = useState([]);

  useEffect(() => {
    const company_id = "5f417a53c37f6275fb614104";
    getValueSelects(company_id);
  }, []);

  const onFinish = (value) => {
    if (date !== "") {
      value.birth_date = date;
    }
    if (value.node) delete value["node"];
    if (value.department) delete value["department"];
    if (value.password != value.passwordTwo)
      message.error("Las contraseñas no coinciden.");
    else {
      delete value["passwordTwo"];
      createPerson(value);
    }
  };

  const getValueSelects = async (id) => {
    const headers = {
      "client-id": "5f417a53c37f6275fb614104",
      "Content-Type": "application/json",
    };

    /////PERMSS GROUPS
    Axios.get("https://khonnect.hiumanlab.com/group/list/", {
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

    Axios.get(API_URL + `/business/node/`)
      .then((response) => {
        let data = response.data.results;
        let options = [];
        data.map((item) => {
          options.push({
            value: item.id,
            label: item.name,
            key: item.name + item.id,
          });
        });
        setselectCompany(options);
      })
      .catch((error) => {
        console.log(error);
        setselectCompany([]);
      });
  };

  const createPerson = (value) => {
    Axios.post(API_URL + `/person/person/`, value)
      .then((response) => {
        message.success("Agregado correctamente");
        form.resetFields();
        props.close(false);
      })
      .catch((error) => {
        console.log("Error-->>>", error.response);
        if (error.response.data && error.response.data.message === "exist")
          message.error("El correo se encuentra registrado.");
        else message.error("Error al agregar, intente de nuevo");
      });
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

  const ruleEmail = {
    type: "email",
    message: "Ingrese un correo electronico valido",
  };

  function onChange(date, dateString) {
    setDate(dateString);
  }

  const closeDialog = () => {
    props.close(false);
    form.resetFields();
  };
  const ruleRequired = { required: true, message: "Este campo es requerido" };

  const changeNode = (value) => {
    form.setFieldsValue({
      job: null,
      department: null,
    });
    setDepartments([]);
    Axios.get(API_URL + `/business/department/?node=${value}`)
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
          let job = response.data.results;
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
          <Form onFinish={onFinish} form={form}>
            <Row>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="person_type">
                  <Select options={personType} placeholder="Tipo de persona" />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="node">
                  <Select
                    placeholder="Empresa"
                    options={selectCompany}
                    onChange={changeNode}
                  />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="department">
                  <Select
                    options={departments}
                    onChange={onChangeDepartment}
                    placeholder="Departamento"
                  />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="job">
                  <Select options={jobs} placeholder="Puesto de trabajo" />
                </Form.Item>
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
                <Form.Item rules={[ruleEmail, ruleRequired]} name="email">
                  <Input type="email" placeholder="E-mail" />
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
              <Col lg={23} xs={22} offset={1}>
                <Form.Item name="groups">
                  <Select
                    mode="multiple"
                    options={groups}
                    showArrow
                    style={{ width: "100%" }}
                    placeholder="Perfiles de seguridad"
                  ></Select>
                </Form.Item>
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
export default FormPerson;
