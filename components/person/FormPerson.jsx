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
import SelectAccessSukha from "../selects/SelectAccessSukha";
import SelectAccessKhorflix from "../selects/SelectAccessKhorflix";
import { ruleRequired, nameLastname } from "../../utils/rules";
import locale from "antd/lib/date-picker/locale/es_ES";
import moment from "moment";
import { getFullName } from "../../utils/functions";

const FormPerson = ({
  config = null,
  hideProfileSecurity = true,
  setPerson = null,
  currentNode,
  close,
  listPersons = [],
  list_admin_roles_options,
  load_admin_roles_options,
  ...props
}) => {
  const [form] = Form.useForm();
  const [date, setDate] = useState("");
  const [departmentSelected, setDepartmentSelected] = useState(null);
  const [jobSelected, setJobSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payrrollActive, setPayrrollActive] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  const [substituteSupervisorList, setSubstituteSupervisorList] = useState([]);

  const onFinish = (value) => {
    if (date !== "") {
      value.birth_date = moment(date, "YYY-MM-DD");
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
      value.is_admin = isAdmin;
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

  const disabledDate = (current) => {
    return current && moment(current).startOf("day") > moment().startOf("day");
  };

  const onChangeSupervisor = (value) =>{
    setSelectedSupervisorId(value)
    form.setFieldsValue({
      substitute_immediate_supervisor: ''
    })
    let _substitutes = listPersons.filter(e => e.id !== value)
    console.log(value, _substitutes)
    setSubstituteSupervisorList(_substitutes )
  }

  const onClearSupervisor = () =>{
    setSelectedSupervisorId('')
    form.setFieldsValue({
      immediate_supervisor: '',
      substitute_immediate_supervisor: '',
    })
  }

  const onClearSubstituteSupervisor = () =>{
    setSelectedSupervisorId('')
    form.setFieldsValue({
      substitute_immediate_supervisor: '',
    })
  }

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
            immediate_supervisor: null,
          }}
          layout={"vertical"}
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
                    name="person_department"
                    style={false}
                    onChange={(item) => setDepartmentSelected(item)}
                  />
                </Col>
                <Col lg={8} xs={24}>
                  <SelectJob
                    viewLabel={true}
                    name="job"
                    style={false}
                    onChange={(item) => setJobSelected(item)}
                  />
                </Col>
                {(departmentSelected || jobSelected) && (
                  <Col lg={8} xs={24}>
                    <SelectWorkTitle
                      name={"work_title_id"}
                      viewLabel={true}
                      style={false}
                      forPerson={true}
                      department={departmentSelected}
                      job={jobSelected}
                    />
                  </Col>
                )}

                <Col lg={8} xs={24}>
                  <Form.Item
                    rules={[ruleRequired, nameLastname]}
                    label="Nombre"
                    name="first_name"
                  >
                    <Input type="text" />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    rules={[ruleRequired, nameLastname]}
                    label="Apellido paterno"
                    name="flast_name"
                  >
                    <Input type="text" />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    rules={[nameLastname]}
                    label="Apellido materno"
                    name="mlast_name"
                  >
                    <Input type="text" />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item name="gender" label="Género">
                    <Select options={genders} />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item label="Fecha de nacimiento">
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={onChange}
                      format={"DD-MM-YYYY"}
                      // moment={"YYYY-MM-DD"}
                      disabledDate={disabledDate}
                      locale={locale}
                      placeholder={""}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item name="code" label="Núm. empleado">
                    <Input type="text" />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    rules={[ruleEmail, payrrollActive && ruleRequired]}
                    name="email"
                    label="Email"
                  >
                    <Input
                      type="email"
                      onBlur={(value) =>
                        form.setFieldsValue({
                          email: value.target.value.toLowerCase(),
                        })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item name="immediate_supervisor" label="Jefe inmediato">
                    <Select showSearch optionFilterProp="children"
                            allowClear={true}
                            onChange={onChangeSupervisor}
                            onClear={onClearSupervisor}
                    >
                      {listPersons.length > 0 &&
                        listPersons.map((item) => (
                          <Select.Option value={item.id} key={item.id}>
                            {getFullName(item)}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item name="substitute_immediate_supervisor" label="Suplente de jefe inmediato">
                    <Select showSearch optionFilterProp="children"
                            allowClear={true}
                            disabled={!selectedSupervisorId}
                            onClear={onClearSubstituteSupervisor}
                    >
                      {substituteSupervisorList.length > 0 &&
                          substituteSupervisorList.map((item) => (
                              <Select.Option value={item.id} key={item.id}>
                                {getFullName(item)}
                              </Select.Option>
                          ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col lg={24} xs={24} style={{ padding: "10px" }}>
                  <Space>
                    {config &&
                      config.applications &&
                      config.applications.find(
                        (item) => item.app === "PAYROLL" && item.is_active
                      ) && (
                        <Space>
                          <span>Crear usuario</span>
                          <Switch
                            checked={payrrollActive}
                            onChange={(value) => setPayrrollActive(value)}
                          />
                        </Space>
                      )}
                    {/* <Space>
                        <span>¿Es administrador?</span>
                        <Switch
                          checked={isAdmin}
                          onChange={(e) => setIsAdmin(e)}
                        />
                      </Space> */}
                  </Space>
                </Col>

                {payrrollActive && (
                  <>
                    <Col lg={8} xs={24}>
                      <Form.Item
                        rules={[ruleRequired]}
                        label="Contraseña"
                        name="password"
                      >
                        <Input.Password type="text" />
                      </Form.Item>
                    </Col>
                    <Col lg={8} xs={24}>
                      <Form.Item
                        label="Confirmar contraseña"
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
                        <Input.Password type="text" />
                      </Form.Item>
                    </Col>
                    {/* {isAdmin && (
                      <Col lg={8} xs={24}>
                        <Form.Item
                          name='administrator_profile'
                          label='Rol'
                          rules={[ruleRequired]}
                        >
                          <Select
                            allowClear
                            showSearch
                            disabled={load_admin_roles_options}
                            loading={load_admin_roles_options}
                            placeholder='Seleccionar una opción'
                            notFoundContent='No se encontraron resultados'
                            optionFilterProp='children'
                          >
                            {list_admin_roles_options.length > 0 && list_admin_roles_options.map(item => (
                              <Select.Option value={item.id} key={item.id} disabled={!item.is_active}>
                                {item.name} {!item.is_active ? '/ No disponible' : ''}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    )} */}
                    <Col lg={8} xs={24}>
                      <SelectGroup viewLabel={true} />
                    </Col>
                    {config.intranet_enabled && (
                      <Col lg={8} xs={24}>
                        <Form.Item
                          label="Acceso a Khor Connect"
                          key="itemAccessIntranet"
                          name="intranet_access"
                          rules={[ruleRequired]}
                        >
                          <SelectAccessIntranet />
                        </Form.Item>
                      </Col>
                    )}
                    {config.applications.find(
                      (item) => item.app === "SUKHATV" && item.is_active
                    ) && (
                      <Col lg={8} xs={24}>
                        <Form.Item
                          label="Acceso a Sukha"
                          key="itemAccessSukha"
                          name="sukhatv_access"
                          rules={[ruleRequired]}
                        >
                          <SelectAccessSukha />
                        </Form.Item>
                      </Col>
                    )}
                    {config.applications.find(
                      (item) => item.app === "SUKHATV" && item.is_active
                    ) && (
                      <Col lg={8} xs={24}>
                        <Form.Item
                          label="¿Es administrador SukhaTV?"
                          key="itemAccessSukhaAdmin"
                          name="is_sukhatv_admin"
                          rules={[ruleRequired]}
                        >
                          <SelectAccessSukha />
                        </Form.Item>
                      </Col>
                    )}
                    {config.applications.find(
                      (item) => item.app === "KHORFLIX" && item.is_active
                    ) && (
                      <Col lg={8} xs={24}>
                        <Form.Item
                          label="Acceso a Khorflix"
                          key="itemAccessKhorflix"
                          name="khorflix_access"
                          rules={[ruleRequired]}
                        >
                          <SelectAccessKhorflix />
                        </Form.Item>
                      </Col>
                    )}
                    {config.applications.find(
                      (item) => item.app === "KHORFLIX" && item.is_active
                    ) && (
                      <Col lg={8} xs={24}>
                        <Form.Item
                          label="¿Es administrador Khorflix?"
                          key="itemAccessKhorflixAdmin"
                          name="is_khorflix_admin"
                          rules={[ruleRequired]}
                        >
                          <SelectAccessKhorflix />
                        </Form.Item>
                      </Col>
                    )}
                  </>
                )}

                <Col lg={24} xs={24}>
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
  return {
    list_admin_roles_options: state.catalogStore.list_admin_roles_options,
    load_admin_roles_options: state.catalogStore.load_admin_roles_options,
  };
};

export default connect(mapState, { getPeopleCompany, getWorkTitle })(
  FormPerson
);
