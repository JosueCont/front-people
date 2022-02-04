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

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import moment from "moment";
import { civilStatus, genders, periodicity } from "../../utils/constant";
import WebApi from "../../api/webApi";
import Axios from "axios";
import { API_URL } from "../../config/config";
import {
  curpFormat,
  minLengthNumber,
  onlyNumeric,
  rfcFormat,
} from "../../utils/rules";
import { getGroupPerson } from "../../api/apiKhonnect";
import SelectGroup from "../../components/selects/SelectGroup";
import SelectPersonType from "../selects/SelectPersonType";

const DataPerson = ({ config, person = null, ...props }) => {
  const { Title } = Typography;
  const [loadImge, setLoadImage] = useState(false);
  const [formPerson] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [birthDate, setBirthDate] = useState("");
  const [dateIngPlatform, setDateIngPlatform] = useState("");
  const [dateAdmission, setDateAdmission] = useState("");
  const [hideProfileSecurity, setHideProfileSecrity] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFormPerson(person);
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
  }, []);

  const setFormPerson = (person) => {
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
    });
    if (person.person_department) {
      formPerson.setFieldsValue({
        person_department: person.department.id,
        job: person.job.id,
      });
      setDepartmentId(person.person_department);
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

    // getValueSelects();
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
    if (value.groups && value.groups != "") value.groups = [value.groups];
    updatePerson(value);
  };

  const updatePerson = async (data) => {
    setLoading(true);
    try {
      let response = await WebApi.updatePerson(data, person.id);
      setFormPerson(response.data);
      message.success({
        content: "Actualizado correctamente.",
        className: "custom-class",
      });
      setLoading(false);
    } catch (error) {
      message.error("Error al actualizar, intente de nuevo.");
      setLoading(false);
    }
  };

  let numberPhoto = 0;
  const upImage = (info) => {
    if (photo && photo.includes(info.file.name)) {
    } else {
      numberPhoto = numberPhoto + 1;
      getBase64(info.file.originFileObj, (imageUrl) => setPhoto(imageUrl));
      let data = new FormData();
      data.append("id", person.id);
      data.append("photo", info.file.originFileObj);
      upImageProfile(data, info);
    }
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const upImageProfile = async (data, img) => {
    if (numberPhoto === 1) {
      try {
        setLoadImage(true);
        let response = await WebApi.updatePhotoPerson(data);
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

  const changeStatus = (value) => {
    isActive ? setIsActive(false) : setIsActive(true);
    let p = formPerson.getFieldsValue();
    isActive ? (p.is_active = false) : (p.is_active = true);
    delete p["date_of_admission"], p["node"], p["report_to"], p["department"];
    Axios.put(API_URL + `/person/person/${person.id}/`, p)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const onChangeDepartment = (val) => {
    formPerson.setFieldsValue({ job: null });
    setDepartmentId(val);
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
            <Row justify="space-between" gutter={20}>
                <Col lg={8} xs={24}>
                    <SelectPersonType label="Tipo de persona" />
                </Col>
                <Col lg={6} md={0} xs={0} xl={0} >
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
                  rules={[{ message: "Ingresa un nombre" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="flast_name"
                  label="Apellido Paterno"
                  rules={[{ message: "Ingresa un apellido paterno" }]}
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
                      label="Fecha de ingreso"
                    >
                      <DatePicker
                        onChange={onChangeDateAdmission}
                        moment={"YYYY-MM-DD"}
                        readOnly
                        style={{width:'100%'}}
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
                  rules={[{ message: "Ingresa un apellido paterno" }]}
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
                />
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="register_date"
                  label="Fecha de ingreso a la plataforma"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={onChangeIngPlatform}
                    moment={"YYYY-MM-DD"}
                    placeholder="Fecha de ingreso a la plataforma"
                  />
                </Form.Item>
              </Col>
              {((props.user && props.user.nodes) ||
                (props.user && props.user.is_admin)) && (
                <Col lg={8} xs={24} md={12}>
                  <Form.Item label="Número de empleado" name="code">
                    <Input type="text" placeholder="Núm. empleado" />
                  </Form.Item>
                </Col>
              )}

              {config && config.intranet_enabled && (
                <Col lg={8} xs={24} md={12}>
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
              {((props.user && props.user.nodes) ||
                (props.user && props.user.is_admin)) && (
                <Col lg={8} xs={24} md={12}>
                  <Form.Item name="report_to" label="Reporta a ">
                    <Select
                      options={props.people_company}
                      notFoundContent={"No se encontraron resultados."}
                    />
                  </Form.Item>
                </Col>
              )}

              {hideProfileSecurity && (
                <Col lg={8} xs={24} md={12}>
                  <SelectGroup viewLabel={true} />
                  {/* <Form.Item name="groups" label="Perfil de seguridad">
                    <Select
                      options={props.cat_groups}
                      showArrow
                      style={{ width: "100%" }}
                      placeholder="Perfiles de seguridad"
                      notFoundContent={"No se encontraron resultados."}
                    />
                  </Form.Item> */}
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
                <Form.Item name="curp" label="CURP" rules={[curpFormat]}>
                  <Input maxLength={18} />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item name="rfc" label="RFC" rules={[rfcFormat]}>
                  <Input maxLength={13} />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="imss"
                  label="IMSS"
                  rules={[onlyNumeric, minLengthNumber]}
                >
                  <Input maxLength={11} />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item name="periodicity" label="Periodicidad">
                  <Select
                    options={periodicity}
                    placeholder="Selecciona una opción"
                    notFoundContent={"No se encontraron resultados."}
                  />
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
