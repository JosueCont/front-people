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
import { getAccessIntranet } from "../../libs/auth";
import SelectDepartment from "../selects/SelectDepartment";
import { connect } from "react-redux";
import SelectJob from "../selects/SelectJob";

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import moment from "moment";
import { civilStatus, genders, periodicity } from "../../utils/functions";
import WebApi from "../../api/webApi";
import Axios from "axios";
import { API_URL } from "../../config/config";
import {
  curpFormat,
  minLengthNumber,
  onlyNumeric,
  rfcFormat,
} from "../../utils/constant";

const DataPerson = ({
  config,
  person = null,
  accessIntranet = false,
  ...props
}) => {
  const { Title } = Typography;
  const [loadImge, setLoadImage] = useState(false);
  const [formPerson] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [birthDate, setBirthDate] = useState("");
  const [dateIngPlatform, setDateIngPlatform] = useState("");
  const [dateAdmission, setDateAdmission] = useState("");
  const [groups, setGroups] = useState([]);
  const [hideProfileSecurity, setHideProfileSecrity] = useState(true);
  const [people, setPeople] = useState(null);
  const [personType, setPersonType] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getValueSelects();
  }, []);

  const getValueSelects = async () => {
    setLoading(true);
    const headers = {
      "client-id": config.client_khonnect_id,
      "Content-Type": "application/json",
    };

    let company = `?company=${person.node}`;

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

    Axios.post(
      config.url_server_khonnect + `/user/get-info/`,
      {
        user_id: person.khonnect_id,
      },
      {
        headers: {
          "client-id": config.client_khonnect_id,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.data.data.groups[0]) {
          let array_group = response.data.data.groups;
          let group = array_group.map((a) => {
            return a._id.$oid;
          });
          formPerson.setFieldsValue({
            groups: group[0],
          });
          let profile = array_group.find((a) => a._id.$oid == group[0]);
          if (profile.name == "Guest") setHideProfileSecrity(false);
        }
        // setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });

    ////GET PERSONS
    Axios.get(API_URL + `/person/person/`)
      .then((response) => {
        let persons = response.data.results;
        persons = persons.map((a) => {
          a.name = a.first_name + " " + a.flast_name;
          if (a.mlast_name) a.name = a.name + " " + a.mlast_name;
          return { label: a.name, value: a.id };
        });
        setPeople(persons);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    // if (people) {
    setFormPerson(person);
    setLoading(false);
    // }
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
        <Row>
          <Col lg={24} xs={24}>
            <Row>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="person_type" label="Tipo de persona">
                  <Select
                    options={props.cat_person_type}
                    placeholder="Tipo de persona"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item
                  name="first_name"
                  label="Nombre(s)"
                  rules={[{ message: "Ingresa un nombre" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item
                  name="flast_name"
                  label="Apellido Paterno"
                  rules={[{ message: "Ingresa un apellido paterno" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Row justify="center">
                  <Col lg={12} md={8} xs={24}>
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
                  <Col lg={12} md={16} xs={24}>
                    <Form.Item
                      name="date_of_admission"
                      label="Fecha de ingreso"
                    >
                      <DatePicker
                        onChange={onChangeDateAdmission}
                        moment={"YYYY-MM-DD"}
                        readOnly
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
              <Col lg={7} xs={22} offset={1}>
                <Form.Item
                  name="mlast_name"
                  label="Apellido Materno"
                  rules={[{ message: "Ingresa un apellido paterno" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item label="Empresa">
                  <Input readOnly value={props.currentNode.name} />
                </Form.Item>
              </Col>
              {person.nodes && (
                <Col lg={7} xs={22} offset={1}>
                  <SelectDepartment
                    onChange={onChangeDepartment}
                    name="person_department"
                    // companyId={person.node}
                    style={false}
                  />
                </Col>
              )}
              {person.nodes && (
                <Col lg={7} xs={22} offset={1}>
                  <SelectJob
                    // departmentId={departmentId}
                    name="job"
                    style={false}
                  />
                </Col>
              )}
              <Col lg={7} xs={22} offset={1}>
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
              {person.nodes && (
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item label="Número de empleado" name="code">
                    <Input type="text" placeholder="Núm. empleado" />
                  </Form.Item>
                </Col>
              )}

              {accessIntranet && (
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
              {person.nodes && (
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item name="report_to" label="Reporta a ">
                    <Select
                      options={props.people_company}
                      notFoundContent={"No se encontraron resultados."}
                    />
                  </Form.Item>
                </Col>
              )}

              {hideProfileSecurity && (
                <Col lg={15} xs={22} offset={1}>
                  <Form.Item name="groups" label="Perfil de seguridad">
                    <Select
                      options={props.cat_groups}
                      showArrow
                      style={{ width: "100%" }}
                      placeholder="Perfiles de seguridad"
                      notFoundContent={"No se encontraron resultados."}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row>
              <hr />
              <Col offset={1} span={23}>
                <Title level={5} style={{ marginBottom: 15 }}>
                  Información adicional
                </Title>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item
                  name="email"
                  label="Dirección de e-mail"
                  rules={[{ message: "Ingresa un email" }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="birth_date" label="Fecha de nacimiento">
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={onChangeBirthDate}
                    moment={"YYYY-MM-DD"}
                    placeholder="Fecha de nacimiento"
                  />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="civil_status" label="Estado Civil">
                  <Select
                    options={civilStatus}
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="gender" label="Género">
                  <Select
                    options={genders}
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="curp" label="CURP" rules={[curpFormat]}>
                  <Input maxLength={18} />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item name="rfc" label="RFC" rules={[rfcFormat]}>
                  <Input maxLength={13} />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
                <Form.Item
                  name="imss"
                  label="IMSS"
                  rules={[onlyNumeric, minLengthNumber]}
                >
                  <Input maxLength={11} />
                </Form.Item>
              </Col>
              <Col lg={7} xs={22} offset={1}>
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
  };
};

export default connect(mapState)(DataPerson);
