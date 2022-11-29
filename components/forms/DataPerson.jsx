import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Spin,
  Switch,
  Typography,
  Upload,
  Form,
  message,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import SelectDepartment from "../selects/SelectDepartment";
import { connect } from "react-redux";
import SelectJob from "../selects/SelectJob";

import { useEffect } from "react";
import moment from "moment";
import {
  civilStatus,
  genders,
  intranetAccess,
  messageError,
  messageUpdateSuccess,
  periodicity,
  SukhaAccess
} from "../../utils/constant";
import WebApiPeople from "../../api/WebApiPeople";
import {
  curpFormat,
  minLengthNumber, nameLastname,
  onlyNumeric,
  rfcFormat,
  ruleRequired
} from "../../utils/rules";
import { getGroupPerson } from "../../api/apiKhonnect";
import SelectGroup from "../../components/selects/SelectGroup";
import SelectPersonType from "../selects/SelectPersonType";
import SelectWorkTitle from "../selects/SelectWorkTitle";
import locale from "antd/lib/date-picker/locale/es_ES";

const DataPerson = ({ config, person = null, setPerson, ...props }) => {
  const { Title } = Typography;
  const [loadImge, setLoadImage] = useState(false);
  const [formPerson] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [dateIngPlatform, setDateIngPlatform] = useState("");
  const [dateAdmission, setDateAdmission] = useState("");
  const [departmentSelected, setDepartmentSelected] = useState(
    person.work_title ? person.work_title.department.id : null
  );
  const [jobSelected, setJobSelected] = useState(
    person.work_title ? person.work_title.job.id : null
  );
  const [loading, setLoading] = useState(true);
  const [personWT, setPersonWT] = useState(false);

console.log(person)
  useEffect(() => {
    setPersonWT(person.id);
    setFormPerson(person);
  }, []);



  const setFormPerson = (person) => {
    setPersonWT(false);

    formPerson.setFieldsValue({
      first_name: person.first_name,
      flast_name: person.flast_name,
      mlast_name: person.mlast_name,
      gender: person.gender,
      email: person.email,
      curp: person.curp,
      rfc: person.rfc,
      imss: person.imss,
      code: person.code,
      is_active: person.is_active,
      photo: person.photo,
      civil_status: person.civil_status,
      report_to: person.report_to,
      periodicity: person.periodicity,
      intranet_access: person.intranet_access,
      sukhatv_access: person.sukhatv_access,

    });
    if (person.work_title) {
      formPerson.setFieldsValue({
        person_department: person.work_title.department.id,
        job: person.work_title.job.id,
        work_title: person.work_title.name,
      });
    }
    if (person.person_type)
      formPerson.setFieldsValue({
        person_type: person.person_type,
      });

    if (person.date_of_admission)
      formPerson.setFieldsValue({
        date_of_admission: moment(person.date_of_admission),
      });

    if (person.birth_date)
      formPerson.setFieldsValue({
        birth_date: moment(person.birth_date),
      });

    if (person.register_date)
      formPerson.setFieldsValue({
        register_date: moment(person.register_date),
      });

    getGroupPerson(config, person.khonnect_id)
      .then((response) => {
        formPerson.setFieldsValue({
          groups: response[0],
        });
      })
      .catch((error) => {
        formPerson.setFieldsValue({
          groups: [],
        });
      });
    setLoading(false);
    setPhoto(person.photo);
    setDateAdmission(person.date_of_admission);
    setBirthDate(person.birth_date);
    setIsActive(person.is_active);
  };

  const onFinishPerson = (value) => {
    if (dateIngPlatform) value.register_date = dateIngPlatform;
    else delete value["register_date"];
    if (birthDate) value.birth_date = birthDate;
    else delete value["birth_date"];
    if (dateAdmission) value.date_of_admission = dateAdmission;
    else delete value["date_of_admission"];
    value.id = person.id;
    value.is_active = isActive;
    if (value.node) delete value["node"];
    if (value.department) delete value["department"];
    value.groups && value.groups
      ? (value.groups = [value.groups])
      : delete value["groups"];
    updatePerson(value);

  };

  const updatePerson = async (data) => {
    setLoading(true);
    await WebApiPeople.updatePerson(data, person.id)
      .then((response) => {
        setFormPerson(response.data);
        setPerson(response.data);
        message.success({
          content: "Actualizado correctamente.",
          className: "custom-class",
        });
        setLoading(false);
      })
      .catch((error) => {
        message.error("Error al actualizar, intente de nuevo.");
        setLoading(false);
      });
  };

  let numberPhoto = 0;
  const upImage = (info) => {
    numberPhoto = numberPhoto + 1;
    getBase64(info.file.originFileObj, (imageUrl) => setPhoto(imageUrl));
    let data = new FormData();
    data.append("id", person.id);
    data.append("photo", info.file.originFileObj);
    if (!loadImge){
      upImageProfile(data, info, numberPhoto);
    }
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const upImageProfile = async (data, img, numaux) => {
    if (numaux === 1) {
      try {
        setLoadImage(true);
        let response = await WebApiPeople.updatePhotoPerson(data);
        formPerson.setFieldsValue({
          photo: response.data.photo,
        });
        message.success({
          content: "Foto cargada correctamente.",
          className: "custom-class",
        });
        numberPhoto = 0;
        setLoadImage(false);
      } catch (error) {
        console.log(error);
        setLoadImage(false);
        setPhoto(null);
      }
    }
  };

  const uploadButton = (
    <div>
      {loadImge ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Cargar</div>
    </div>
  );

  const onChangeDateAdmission = (date, dateString) => {
    setDateAdmission(dateString);
  };

  const changeStatus = async (value) => {
    isActive ? setIsActive(false) : setIsActive(true);
    let data = {
      id: person.id,
      status: value,
    };
    await WebApiPeople.changeStatusPerson(data)
      .then((response) => {
        message.success(messageUpdateSuccess);
      })
      .catch((error) => {
        message.error(messageError);
        console.log(error);
      });
  };

  const onChangeIngPlatform = (date, dateString) => {
    setDateIngPlatform(dateString);
  };

  const onChangeBirthDate = (date, dateString) => {
    setBirthDate(dateString);
  };

  return (
    <Spin tip="Cargando..." spinning={loading}>
      <Form onFinish={onFinishPerson} layout={"vertical"} form={formPerson}>
        <Row justify="center">
          <Col lg={22}>
            <Row gutter={20}>
              {((props.user && props.user.nodes) ||
                (props.user && props.user.is_admin)) && (
                <Col lg={8} xs={12}>
                  <Form.Item label="Número de empleado" name="code">
                    <Input type="text" placeholder="Núm. empleado" />
                  </Form.Item>
                </Col>
              )}
              <Col lg={8} xs={12}>
                <SelectPersonType label="Tipo de persona" />
              </Col>
              <Col lg={6} md={0} xs={0} xl={0}>
                <Spin tip="Cargando..." spinning={loadImge}>
                  <div
                    style={
                      photo
                        ? {
                            width: "120px",
                            height: "120px",
                            display: "flex",
                            flexWrap: "wrap",
                            alignContent: "center",
                            textAlign: "center",
                          }
                        : {}
                    }
                  >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      showUploadList={false}
                      onChange={upImage}
                    >
                      {photo ? (
                        <div
                          className="frontImage"
                          style={
                            photo
                              ? {
                                  width: "120px",
                                  height: "120px",
                                  display: "flex",
                                  flexWrap: "wrap",
                                  borderRadius: "10px",
                                  textAlign: "center",
                                  alignContent: "center",
                                }
                              : {}
                          }
                        >
                          <img
                            className="img"
                            src={photo}
                            alt="avatar"
                            preview={false}
                            style={{
                              width: "120px",
                              height: "120px",
                              borderRadius: "11px",
                            }}
                          />
                        </div>
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </div>
                </Spin>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="first_name"
                  label="Nombre(s)"
                  rules={[{ message: "Ingresa un nombre" },nameLastname]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="flast_name"
                  label="Apellido Paterno"
                  rules={[{ message: "Ingresa un apellido paterno" },nameLastname]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24}>
                <Row justify="center">
                  <Col lg={0} md={12} xs={24} xl={12}>
                    <Spin tip="Cargando..." spinning={loadImge}>
                      <div
                        style={
                          photo
                            ? {
                                width: "120px",
                                height: "120px",
                                display: "flex",
                                flexWrap: "wrap",
                                alignContent: "center",
                                textAlign: "center",
                              }
                            : {}
                        }
                      >
                        <Upload
                          name="avatar"
                          listType="picture-card"
                          showUploadList={false}
                          onChange={upImage}
                        >
                          {photo ? (
                            <div
                              className="frontImage"
                              style={
                                photo
                                  ? {
                                      width: "120px",
                                      height: "120px",
                                      display: "flex",
                                      flexWrap: "wrap",
                                      borderRadius: "10px",
                                      textAlign: "center",
                                      alignContent: "center",
                                    }
                                  : {}
                              }
                            >
                              <img
                                className="img"
                                src={photo}
                                alt="avatar"
                                preview={false}
                                style={{
                                  width: "120px",
                                  height: "120px",
                                  borderRadius: "11px",
                                }}
                              />
                            </div>
                          ) : (
                            uploadButton
                          )}
                        </Upload>
                      </div>
                    </Spin>
                  </Col>
                  <Col lg={24} md={12} xs={24} xl={12}>
                    <Form.Item
                      name="date_of_admission"
                      label="Fecha de ingreso laboral"
                    >
                      <DatePicker
                        locale={ locale }
                        onChange={onChangeDateAdmission}
                        moment={"YYYY-MM-DD"}
                        readOnly
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Switch
                      checked={isActive}
                      onClick={changeStatus}
                      checkedChildren="Activo"
                      unCheckedChildren="Inactivo"
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="mlast_name"
                  label="Apellido Materno"
                  rules={[{ message: "Ingresa un apellido paterno" },nameLastname]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item label="Empresa">
                  <Input
                    readOnly
                    value={props.currentNode && props.currentNode.name}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <SelectDepartment
                  disabled={
                    (props.user && props.user.nodes) ||
                    (props.user && props.user.is_admin)
                      ? false
                      : true
                  }
                  name="person_department"
                  style={false}
                  onChange={(item) => {
                    setDepartmentSelected(item), setPersonWT(true);
                  }}
                />
              </Col>
              <Col lg={8} xs={24} md={12}>
                <SelectJob
                  disabled={
                    (props.user && props.user.nodes) ||
                    (props.user && props.user.is_admin)
                      ? false
                      : true
                  }
                  name="job"
                  style={false}
                  onChange={(item) => {
                    setJobSelected(item), setPersonWT(true);
                  }}
                  rules = { [ruleRequired] }
                />
              </Col>
              <Col lg={8} xs={24} md={12}>
                {personWT ? (
                  <SelectWorkTitle
                    viewLabel={true}
                    department={departmentSelected}
                    job={jobSelected}
                    person={personWT}
                    name={"work_title_id"}
                    rules = { [ruleRequired] }
                  />
                ) : (
                  <Form.Item name="work_title" label="Plaza laboral">
                    <Input readOnly />
                  </Form.Item>
                )}
              </Col>
              {props.config &&
                props.config.enabled_nomina(
                  ((props.user && props.user.nodes) ||
                    (props.user && props.user.is_admin)) && (
                    <Col lg={8} xs={24} md={12}>
                      <Form.Item label="Reporta a ">
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  )
                )}
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="register_date"
                  label="Fecha de ingreso a la plataforma"
                >
                  <DatePicker
                    locale={ locale }
                    style={{ width: "100%" }}
                    onChange={onChangeIngPlatform}
                    moment={"YYYY-MM-DD"}
                    placeholder="Fecha de ingreso a la plataforma"
                  />
                </Form.Item>
              </Col>
              {config && config.intranet_enabled && (
                <Col lg={8} xs={24} md={12}>
                  <Form.Item
                    name="intranet_access"
                    label="Acceso a la intranet"
                  >
                    <Select options={intranetAccess} />
                  </Form.Item>
                </Col>
              )}
              <Col lg={8} xs={24} md={12}>
                <SelectGroup viewLabel={true} required={false} />
              </Col>
              {config.applications.find(
                  (item) => item.app === "SUKHATV" && item.is_active) && (
                <Col lg={8} xs={24} md={12}>
                  <Form.Item
                    name="sukhatv_access"
                    label="Acceso a Sukha Tv"
                  >
                    <Select options={SukhaAccess} />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row gutter={20}>
              <hr />
              <Col span={23}>
                <Title level={5} style={{ marginBottom: 15 }}>
                  Información adicional
                </Title>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Dirección de e-mail"
                  rules={[{ message: "Ingresa un email" }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item name="birth_date" label="Fecha de nacimiento">
                  <DatePicker
                    locale={ locale }
                    style={{ width: "100%" }}
                    onChange={onChangeBirthDate}
                    moment={"YYYY-MM-DD"}
                    placeholder="Fecha de nacimiento"
                  />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item name="civil_status" label="Estado Civil">
                  <Select
                    options={civilStatus}
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item name="gender" label="Género">
                  <Select
                    options={genders}
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item name="curp" label="CURP" rules={[ruleRequired, curpFormat]}>
                  <Input maxLength={18} />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item name="rfc" label="RFC" rules={[ruleRequired, rfcFormat]}>
                  <Input maxLength={13} />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="imss"
                  label="IMSS"
                  rules={[ruleRequired, onlyNumeric, minLengthNumber]}
                >
                  <Input maxLength={11} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify={"end"}>
          <Col>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    cat_person_type: state.catalogStore.cat_person_type,
    cat_groups: state.catalogStore.cat_groups,
    people_company: state.catalogStore.people_company,
    user: state.userStore.user,
  };
};

export default connect(mapState)(DataPerson);
