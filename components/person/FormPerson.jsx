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
import WebApiPeople from "../../api/WebApiPeople";
import { genders } from "../../utils/constant";
import { ruleEmail } from "../../utils/rules";
import moment from "moment";
import { getPeopleCompany } from "../../redux/UserDuck";
import SelectGroup from "../selects/SelectGroup";
import SelectJob from "../selects/SelectJob";
import SelectDepartment from "../selects/SelectDepartment";
import SelectPersonType from "../selects/SelectPersonType";
import SelectWorkTitle from "../selects/SelectWorkTitle";
import SelectWorkTitleStatus from "../selects/SelectWorkTitleStatus";
import SelectAccessIntranet from "../selects/SelectAccessIntranet";
import { ruleRequired } from "../../utils/rules";

const FormPerson = ({
  config = null,
  hideProfileSecurity = true,
  intranetAccess = true,
  node = null,
  nameNode = "",
  setPerson = null,
  currentNode,
  ...props
}) => {
  const [form] = Form.useForm();
  const [date, setDate] = useState("");
  const [dateIngPlatform, setDateIngPlatform] = useState("");
  const [departmentSelected, setDepartmentSelected] = useState(null);
  const [jobSelected, setJobSelected] = useState(null);

  const [departments, setDepartments] = useState("");
  let nodeId = userCompanyId();
  let accessIntranet = getAccessIntranet();

  useEffect(() => {
    if (node) {
      changeNode();
    }
  }, [node]);

  const onFinish = (value) => {
    if (date !== "") {
      value.birth_date = date;
    }
    if (dateIngPlatform !== "") {
      value.register_date = dateIngPlatform;
    } else {
      value.register_date = moment().format("YYYY-MM-DD");
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

  const createPerson = async (value) => {
    try {
      value.node = currentNode.id;
      let response = await WebApiPeople.createPerson(value);
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

  const getWorkTitle = () => {
    const values = form.getFieldsValue();

    if (values.person_department && values.job) {
      setDepartmentSelected(values.person_department);
      setJobSelected(values.job);
    } else {
      setDepartmentSelected(null);
      setJobSelected(null);
    }
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
                <Col lg={8} xs={24}>
                  <SelectPersonType />
                </Col>
                <Col lg={8} xs={24}>
                  <SelectDepartment
                    viewLabel={false}
                    name="person_department"
                    style={false}
                    onChange={getWorkTitle}
                  />
                </Col>
                <Col lg={8} xs={24}>
                  <SelectJob
                    viewLabel={false}
                    name="job"
                    style={false}
                    onChange={getWorkTitle}
                  />
                </Col>
                <Col lg={8} xs={24}>
                  <SelectWorkTitle
                    viewLabel={false}
                    style={false}
                    forPerson={true}
                    department={departmentSelected}
                    job={jobSelected}
                  />
                </Col>
                <Col lg={8} xs={24}>
                  <SelectWorkTitleStatus viewLabel={false} style={false} />
                </Col>

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
                {accessIntranet !== "false" && intranetAccess && (
                  <Col lg={8} xs={24}>
                    <Form.Item
                      name="intranet_access"
                      /* label="Acceso a la intranet" */
                    >
                      {/* <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                      /> */}
                      <SelectAccessIntranet />
                    </Form.Item>
                  </Col>
                )}
                <Col lg={8} xs={24}>
                  <Form.Item name="register_date">
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
                <Col lg={8} xs={24}>
                  <SelectGroup />
                </Col>
                <Col lg={22} xs={24}>
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

export default connect(mapState, { getPeopleCompany })(FormPerson);
