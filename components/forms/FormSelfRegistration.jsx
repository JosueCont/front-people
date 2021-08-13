import {
  Form,
  Input,
  Layout,
  DatePicker,
  Button,
  Select,
  message,
  Row,
  Col,
} from "antd";
import Axios from "axios";
import { API_URL, APP_ID, LOGIN_URL } from "../../config/config";
import { useState, useEffect } from "react";
import { getAccessIntranet, userCompanyId } from "../../libs/auth";
import WebApi from "../../api/webApi";
import Link from "next/link";
import LoginModal from "../modal/LoginModal";
import { genders, ruleEmail, ruleRequired } from "../../utils/constant";
import SelectDepartment from "../selects/SelectDepartment";
import SelectJob from "../selects/SelectJob";

const FormSelfRegistration = ({
  hideProfileSecurity = true,
  intranetAccess = true,
  node = null,
  nameNode = "",
  setPerson,
  setKhonnectId = null,
  login = false,
  modal = false,
  setModal = null,
  ...props
}) => {
  const [form] = Form.useForm();
  const [personType, setPersonType] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [date, setDate] = useState("");
  const [dateIngPlatform, setDateIngPlatform] = useState("");

  useEffect(() => {
    if (node) {
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
    if (value.department) delete value["department"];
    if (value.password != value.passwordTwo)
      message.error("Las contraseñas no coinciden.");
    else {
      delete value["passwordTwo"];
      if (value.groups) value.groups = [value.groups];
      else delete value["groups"];
      value.node = node;
      createPerson(value);
    }
  };

  const getValueSelects = async (id) => {
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

  function onChange(date, dateString) {
    setDate(dateString);
  }

  const onChangeDepartment = (value) => {
    form.setFieldsValue({
      job: null,
    });
    setDepartmentId(value);
  };

  return (
    <>
      <Layout>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
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
                <Form.Item name="person_type">
                  <Select options={personType} placeholder="Tipo de persona" />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item rules={[ruleRequired]}>
                  <Input disabled readOnly value={nameNode} />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <SelectDepartment
                  onChange={onChangeDepartment}
                  name="person_department"
                  companyId={node}
                  style={false}
                  titleLabel={false}
                />
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <SelectJob
                  departmentId={departmentId}
                  name="job"
                  style={false}
                  titleLabel={false}
                />
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
                  <Input
                    type="email"
                    placeholder="E-mail"
                    onBlur={(value) => {
                      console.log("DATA-> ", value.target.value),
                        form.setFieldsValue({
                          email: value.target.value.toLowerCase(),
                        });
                    }}
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
              <Col lg={20} xs={22} offset={1} className="center-content">
                <span onClick={() => setModal(true)} className="text-link">
                  <Link href="">Ya me he registrado</Link>
                </span>
              </Col>
              <Col lg={2} xs={22} offset={1} className="center-content">
                <Button type="primary" htmlType="submit">
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        {modal && (
          <LoginModal
            title={"Iniciar sesión"}
            visible={modal}
            setModal={setModal}
            setKhonnectId={setKhonnectId}
          />
        )}
      </Layout>
    </>
  );
};

export default FormSelfRegistration;
