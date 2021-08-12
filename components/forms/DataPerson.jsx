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

const DataPerson = ({
  people,
  groups,
  person,
  setLoading,
  hideProfileSecurity,
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
  const [personFullName, setPersonFullName] = useState("");

  useEffect(() => {
    setFormPerson(person);
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
      department: person.department.id,
      job: person.job.id,
    });
    if (person.person_type)
      formPerson.setFieldsValue({
        person_type: person.person_type.id,
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

    setDateAdmission(person.date_of_admission);
    setBirthDate(person.birth_date);
    setIsActive(person.is_active);
    if (person.photo) setPhoto(person.photo);
    let personName = person.first_name + " " + person.flast_name;
    if (person.mlast_name) personName = personName + " " + person.mlast_name;
    setPersonFullName(personName);
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
    form.setFieldsValue({
      job: null,
    });
    setDepartmentId(val);
  };

  const onChangeIngPlatform = (date, dateString) => {
    setDateIngPlatform(dateString);
  };

  const onChangeBirthDate = (date, dateString) => {
    setBirthDate(dateString);
  };

  return (
    <Form onFinish={onFinishPerson} layout={"vertical"} form={formPerson}>
      <Row>
        <Col lg={24} xs={24}>
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
                  <Spin spinning={loadImge}>
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
                  <Form.Item name="date_of_admission" label="Fecha de ingreso">
                    <DatePicker
                      onChange={onChangeDateAdmission}
                      moment={"YYYY-MM-DD"}
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
            <Col lg={7} xs={22} offset={1}>
              <Form.Item name="person_department" label="Departamento">
                {/* <SelectD
                  options={departments}
                  onChange={onChangeDepartment}
                  placeholder="Departamento"
                  notFoundContent={"No se encontraron resultado."}
                /> */}
                <SelectDepartment
                  onChange={onChangeDepartment}
                  name="department"
                  companyId={person.node}
                  item={false}
                />
              </Form.Item>
            </Col>
            <Col lg={7} xs={22} offset={1}>
              <Form.Item name="job" label="Puesto de trabajo">
                {/* <Select
                  options={getJobForSelect(person.department.id)}
                  placeholder="Puesto de trabajo"
                  notFoundContent={"No se encontraron resultado."}
                /> */}
                <SelectJob
                  departmentId={person.department.id}
                  name="job"
                  label="Puesto"
                  item={false}
                  // style={{ maxWidth: 150 }}
                />
              </Form.Item>
            </Col>
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
            <Col lg={7} xs={22} offset={1}>
              <Form.Item label="Número de empleado" name="code">
                <Input type="text" placeholder="Núm. empleado" />
              </Form.Item>
            </Col>
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
            <Col lg={7} xs={22} offset={1}>
              <Form.Item name="report_to" label="Reporta a ">
                <Select
                  options={people}
                  notFoundContent={"No se encontraron resultado."}
                />
              </Form.Item>
            </Col>
            {hideProfileSecurity && (
              <Col lg={15} xs={22} offset={1}>
                <Form.Item name="groups" label="Perfil de seguridad">
                  <Select
                    options={groups}
                    showArrow
                    style={{ width: "100%" }}
                    placeholder="Perfiles de seguridad"
                    notFoundContent={"No se encontraron resultado."}
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
                  notFoundContent={"No se encontraron resultado."}
                />
              </Form.Item>
            </Col>
            <Col lg={7} xs={22} offset={1}>
              <Form.Item name="gender" label="Género">
                <Select
                  options={genders}
                  notFoundContent={"No se encontraron resultado."}
                />
              </Form.Item>
            </Col>
            <Col lg={7} xs={22} offset={1}>
              <Form.Item name="curp" label="CURP">
                <Input maxLength={18} />
              </Form.Item>
            </Col>
            <Col lg={7} xs={22} offset={1}>
              <Form.Item name="rfc" label="RFC">
                <Input maxLength={13} />
              </Form.Item>
            </Col>
            <Col lg={7} xs={22} offset={1}>
              <Form.Item name="imss" label="IMSS">
                <Input maxLength={11} />
              </Form.Item>
            </Col>
            <Col lg={7} xs={22} offset={1}>
              <Form.Item name="periodicity" label="Periodicidad">
                <Select
                  options={periodicity}
                  placeholder="Selecciona una opción"
                  notFoundContent={"No se encontraron resultado."}
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
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(DataPerson);
