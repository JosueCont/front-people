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
} from "antd";
import Form from "antd/lib/form/Form";
import {
  WarningOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  FileTextOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { getAccessIntranet, userCompanyName } from "../../libs/auth";
import SelectDepartment from "../selects/SelectDepartment";
import { connect } from "react-redux";
import SelectJob from "../selects/SelectJob";

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

const GeneralDataPerson = ({
  people,
  groups,
  civilStatus,
  genders,
  ...props
}) => {
  const { Title } = Typography;
  const [loading, setLoading] = useState(true);
  const [loadImge, setLoadImage] = useState(false);
  const [formPerson] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [birthDate, setBirthDate] = useState("");
  const [dateIngPlatform, setDateIngPlatform] = useState("");
  let accessIntranet = getAccessIntranet();

  const onFinishPerson = (value) => {
    if (dateIngPlatform) value.register_date = dateIngPlatform;
    else delete value["register_date"];
    if (birthDate) value.birth_date = birthDate;
    else delete value["birth_date"];
    if (dateAdmission) value.date_of_admission = dateAdmission;
    else delete value["date_of_admission"];
    value.id = router.query.id;
    value.is_active = isActive;
    if (value.node) delete value["node"];
    if (value.department) delete value["department"];
    if (value.groups && value.groups != "") value.groups = [value.groups];
    updatePerson(value);
  };

  let numberPhoto = 0;
  const upImage = (info) => {
    if (photo && photo.includes(info.file.name)) {
    } else {
      numberPhoto = numberPhoto + 1;
      getBase64(info.file.originFileObj, (imageUrl) => setPhoto(imageUrl));
      let data = new FormData();
      data.append("id", router.query.id);
      data.append("photo", info.file.originFileObj);
      upImageProfile(data, info);
    }
  };

  const upImageProfile = (data, img) => {
    if (numberPhoto === 1) {
      setLoadImage(true);
      Axios.post(API_URL + `/person/person/update_pthoto_person/`, data)
        .then((response) => {
          getPerson();
          message.success({
            content: "Foto cargada correctamente.",
            className: "custom-class",
          });
          numberPhoto = 0;
          setLoadImage(false);
        })
        .catch((error) => {
          console.log(error);
          setLoadImage(false);
          setPhoto(null);
        });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
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
    Axios.put(API_URL + `/person/person/${router.query.id}/`, p)
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
                <Input readOnly value={userCompanyName()} />
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
                  companyId={props.id}
                />
              </Form.Item>
            </Col>
            <Col lg={7} xs={22} offset={1}>
              <Form.Item name="job" label="Puesto de trabajo">
                {/* <Select
                  options={jobs}
                  placeholder="Puesto de trabajo"
                  notFoundContent={"No se encontraron resultado."}
                /> */}
                <SelectJob
                  departmentId={departmentId}
                  name="job"
                  label="Puesto"
                  style={{ maxWidth: 150 }}
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
            {accessIntranet !== "false" && (
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
    currentCompany: state.userStore.current_company,
  };
};

export default connect(mapState)(GeneralDataPerson);
