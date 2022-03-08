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
import { useState } from "react";
import WebApiPeople from "../../api/WebApiPeople";
import Link from "next/link";
import LoginModal from "../modal/LoginModal";
import { genders } from "../../utils/constant";

import moment from "moment";
import { ruleRequired } from "../../utils/rules";
import SelectPersonType from "../selects/SelectPersonType";

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
  const [date, setDate] = useState("");
  const [disabled, setDisabled] = useState(false);
  const toDay = moment().format("YYYY-MM-DD").toString();

  const onFinish = (value) => {
    if (date !== "") {
      value.birth_date = date;
    }
    if (value.password != value.passwordTwo)
      message.error("Las contraseñas no coinciden.");
    else {
      delete value["passwordTwo"];
      value.register_date = toDay;
      value.node = node;
      setDisabled(true);

      createPerson(value);
    }
  };

  const createPerson = async (value) => {
    try {
      let response = await WebApiPeople.createPerson(value);
      if (setPerson) {
        setPerson(response.data.person);
        sessionStorage.setItem("tok", response.data.person.id);
      }
      message.success("Agregado correctamente");
      form.resetFields();
      props.close(false);
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
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

  return (
    <>
      <Layout className="center-content">
        <div
          className="site-layout-background"
          style={{ width: "70%", minHeight: 380, height: "100%" }}
        >
          <div className="center-content title-form-self-register">
            Formulario de registro
          </div>
          <div style={{ padding: "1%" }}>
            <Form
              initialValues={{
                intranet_access: false,
              }}
              onFinish={onFinish}
              form={form}
              layout={"vertical"}
            >
              <Row>
                <Col lg={7} xs={22} offset={1}>
                  <SelectPersonType />
                </Col>
                <Col lg={14} xs={22} offset={1}>
                  <Form.Item rules={[ruleRequired]} label="Empresa">
                    <Input disabled readOnly value={nameNode} />
                  </Form.Item>
                </Col>
              </Row>
              <hr style={{ border: "solid 1px #efe9e9", margin: 20 }} />
              <Row>
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item
                    rules={[ruleRequired]}
                    name="first_name"
                    label="Nombre(s)"
                  >
                    <Input type="text" placeholder="Nombre(s)" />
                  </Form.Item>
                </Col>
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item
                    rules={[ruleRequired]}
                    name="flast_name"
                    label="Apellido paterno"
                  >
                    <Input type="text" placeholder="Apellido paterno" />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                  <Form.Item name="mlast_name" label="Apellido materno">
                    <Input type="text" placeholder="Apellido materno" />
                  </Form.Item>
                </Col>
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item name="gender" label="Género">
                    <Select
                      style={{ textAlign: "left" }}
                      options={genders}
                      placeholder="Género"
                    />
                  </Form.Item>
                </Col>
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item label="Fecha de nacimiento">
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={onChange}
                      moment={"YYYY-MM-DD"}
                      placeholder="Fecha de nacimiento"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <hr style={{ border: "solid 1px #efe9e9", margin: 20 }} />
              <Row>
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item
                    rules={[ruleEmail, ruleRequired]}
                    name="email"
                    label="E-mail"
                  >
                    <Input
                      type="email"
                      placeholder="E-mail"
                      onBlur={(value) => {
                        form.setFieldsValue({
                          email: value.target.value.toLowerCase(),
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item
                    rules={[ruleRequired]}
                    name="password"
                    label="Contraseña"
                  >
                    <Input.Password type="text" placeholder="Contraseña" />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                  <Form.Item
                    label="Repita la contraseña"
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
                            return Promise.reject(
                              "Las contraseñas no coinciden"
                            );
                          }
                        },
                      }),
                    ]}
                    name="passwordTwo"
                  >
                    <Input.Password type="text" placeholder="Contraseña" />
                  </Form.Item>
                </Col>
                <Col
                  style={{ paddingTop: "20px" }}
                  lg={19}
                  xs={22}
                  offset={1}
                  className="center-content font-color-khor"
                >
                  ¿Ya tienes una cuenta?
                  <span
                    style={{ marginLeft: "4px" }}
                    onClick={() => setModal(true)}
                    className="text-link"
                  >
                    <Link href="">haz clic aquí</Link>
                  </span>
                </Col>
                <Col
                  style={{ paddingTop: "20px" }}
                  lg={2}
                  xs={22}
                  offset={1}
                  className="center-content"
                >
                  <Button disabled={disabled} type="primary" htmlType="submit">
                    Guardar
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
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
