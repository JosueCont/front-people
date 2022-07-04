import {
  Form,
  Input,
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
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import WebApiPeople from "../../api/WebApiPeople";
import { genders } from "../../utils/constant";
import { ruleEmail } from "../../utils/rules";
import { getPeopleCompany } from "../../redux/UserDuck";
import { getWorkTitle } from "../../redux/catalogCompany";
import SelectGroup from "../selects/SelectGroup";
import SelectJob from "../selects/SelectJob";
import SelectDepartment from "../selects/SelectDepartment";
import SelectPersonType from "../selects/SelectPersonType";
import SelectWorkTitle from "../selects/SelectWorkTitle";
import SelectAccessIntranet from "../selects/SelectAccessIntranet";
import { ruleRequired } from "../../utils/rules";

const FormPerson = ({
  config = null,
  hideProfileSecurity = true,
  setPerson = null,
  currentNode,
  close,
  ...props
}) => {
  const [form] = Form.useForm();
  const [date, setDate] = useState("");
  const [departmentSelected, setDepartmentSelected] = useState(null);
  const [jobSelected, setJobSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payrrollActive, setPayrrollActive] = useState(true);
  
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
      if (value.groups) value.groups = [value.groups];
      else delete value["groups"];
      if (currentNode) value.node = currentNode.id;
      else value.node = node;
      createPerson(value);
    }
  };

  const createPerson = async (value) => {
    setLoading(true);
    value.node = currentNode.id;
    await WebApiPeople.createPerson(value)
      .then((response) => {
        props.getPeopleCompany(currentNode.id);
        props.getWorkTitle(currentNode.id);
        message.success("Agregado correctamente");
        form.resetFields();
        setLoading(false);
        close(false);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        )
          message.error(error.response.data.message);
        else if (error) message.error("Error al agregar, intente de nuevo");
        setLoading(false);
      });
  };

  function onChange(date, dateString) {
    setDate(dateString);
  }

  const closeDialog = () => {
    close(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        maskClosable={false}
        title={currentNode ? "Alta de personas en " + currentNode.name : ""}
        centered
        visible={props.visible}
        onCancel={() => closeDialog()}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          initialValues={{
            intranet_access: false,
          }}
          onFinish={onFinish}
          form={form}
        >
          <Row justify="center">
            <Col span={23}>
              <Row gutter={20}>
                {config &&
                  config.applications &&
                  config.applications.find(
                    (item) => item.app === "PAYROLL" && !item.is_active
                  ) && (
                    <Col lg={8} xs={24}>
                      <SelectPersonType />
                    </Col>
                  )}
                <Col lg={8} xs={24}>
                  <SelectDepartment
                    viewLabel={false}
                    name="person_department"
                    style={false}
                    onChange={(item) => setDepartmentSelected(item)}
                  />
                </Col>
                <Col lg={8} xs={24}>
                  <SelectJob
                    viewLabel={false}
                    name="job"
                    style={false}
                    onChange={(item) => setJobSelected(item)}
                  />
                </Col>
                {(departmentSelected || jobSelected) && (
                  <Col lg={8} xs={24}>
                    <SelectWorkTitle
                      name={"work_title_id"}
                      viewLabel={false}
                      style={false}
                      forPerson={true}
                      department={departmentSelected}
                      job={jobSelected}
                      rules={[ruleRequired]}
                    />
                  </Col>
                )}

                <Col lg={8} xs={24}>
                  <Form.Item rules={[ruleRequired]} name="first_name">
                    <Input type="text" placeholder="Nombre" />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item rules={[ruleRequired]} name="flast_name">
                    <Input type="text" placeholder="Apellido paterno" />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item name="mlast_name">
                    <Input type="text" placeholder="Apellido materno" />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item name="gender">
                    <Select options={genders} placeholder="Género" />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item>
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={onChange}
                      moment={"YYYY-MM-DD"}
                      placeholder="Fecha de nacimiento"
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item name="code">
                    <Input type="text" placeholder="Núm. empleado" />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    rules={[ruleEmail, payrrollActive && ruleRequired]}
                    name="email"
                  >
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

                <Col lg={20} xs={24} style={{ padding: "10px" }}>
                  {config &&
                    config.applications &&
                    config.applications.find(
                      (item) => item.app === "PAYROLL" && item.is_active
                    ) && (
                      <>
                        {"Crear usuario "}
                        <Switch
                          checked={payrrollActive}
                          onChange={(value) => setPayrrollActive(value)}
                        />
                      </>
                    )}
                </Col>

                {payrrollActive && (
                  <>
                    <Col lg={8} xs={24}>
                      <Form.Item rules={[ruleRequired]} name="password">
                        <Input.Password type="text" placeholder="Contraseña" />
                      </Form.Item>
                    </Col>
                    <Col lg={8} xs={24}>
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
                    {config.intranet_enabled && (
                      <Col lg={8} xs={24}>
                        <Form.Item
                          key="itemAccessIntranet"
                          name="intranet_access"
                          rules={[ruleRequired]}
                        >
                          <SelectAccessIntranet />
                        </Form.Item>
                      </Col>
                    )}
                    <Col lg={8} xs={24}>
                      <SelectGroup />
                    </Col>
                  </>
                )}

                <Col lg={22} xs={24}>
                  <Form.Item labelAlign="right">
                    <Space style={{ float: "right" }}>
                      <Button onClick={() => closeDialog()} loading={loading}>
                        Cancelar
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        Guardar
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

const mapState = (state) => {
  return {};
};

export default connect(mapState, { getPeopleCompany, getWorkTitle })(
  FormPerson
);
