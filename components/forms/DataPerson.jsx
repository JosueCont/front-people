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
  Space,
} from "antd";
import { PlusOutlined, LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import SelectDepartment from "../selects/SelectDepartment";
import { connect } from "react-redux";
import SelectJob from "../selects/SelectJob";
import SelectPatronalRegistration from "../selects/SelectPatronalRegistration";
import { useEffect } from "react";
import moment from "moment";
import {
  civilStatus,
  genders,
  intranetAccess,
  messageError,
  messageUpdateSuccess,
  periodicity,
  SukhaAccess,
  KhorflixAccess,
  CareerlabAccess
} from "../../utils/constant";
import WebApiPeople from "../../api/WebApiPeople";
import {
  curpFormat,
  minLengthNumber,
  nameLastname,
  onlyNumeric,
  rfcFormat,
  ruleRequired,
} from "../../utils/rules";
import { getGroupPerson } from "../../api/apiKhonnect";
import SelectGroup from "../../components/selects/SelectGroup";
import SelectPersonType from "../selects/SelectPersonType";
import SelectWorkTitle from "../selects/SelectWorkTitle";
import locale from "antd/lib/date-picker/locale/es_ES";
import { getFullName } from "../../utils/functions";

const DataPerson = ({
  currentNode,
  config,
  person = null,
  setPerson,
  list_admin_roles_options,
  load_admin_roles_options,
  assimilated_pay = null,
  ...props
}) => {
  const { Title } = Typography;
  let filters = { node: "" };
  const [loadImge, setLoadImage] = useState(false);
  const [formPerson] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isActiveAdmin, setIsActiveAdmin] = useState(false);
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
  const [listPersons, setListPersons] = useState([]);
  // const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  // const [substituteSupervisorList, setSubstituteSupervisorList] = useState([]);
  //
  const isAdmin = Form.useWatch('is_admin', formPerson);
  const id_supervisor = Form.useWatch('immediate_supervisor', formPerson);
  const id_substitute = Form.useWatch('substitute_immediate_supervisor', formPerson);

  useEffect(() => {
    setPersonWT(person.id);
    setFormPerson(person);
  }, [person]);

  // useEffect(() => {
  //   if(listPersons.length > 0 && selectedSupervisorId){
  //     let _substitutes = listPersons.filter(e => e.id !== selectedSupervisorId)
  //     setSubstituteSupervisorList(_substitutes )
  //   }
  // }, [listPersons, selectedSupervisorId]);

  useEffect(() => {
    if (currentNode) {
      filters.node = currentNode.id
      filterPersonName(filters)
    }
  }, [currentNode]);

  const filterPersonName = async (node_id) => {
    try {
      let response = await WebApiPeople.filterPerson(node_id);
      setListPersons([]);
      let persons = response.data.map((a) => {
        a.key = a.khonnect_id;
        return a;
      });
      setListPersons(persons);
    } catch (error) {
      setPerson([]);
      console.log(error);
    }
  };

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
      is_sukhatv_admin: person.is_sukhatv_admin,
      khorflix_access: person.khorflix_access,
      is_khorflix_admin: person.is_khorflix_admin,
      careerlab_access: person.careerlab_access,
      is_careerlab_admin: person.is_careerlab_admin,
      patronal_registration: null,
      immediate_supervisor: person?.immediate_supervisor?.id ? person?.immediate_supervisor?.id : null,
      substitute_immediate_supervisor: person?.substitute_immediate_supervisor?.id ? person?.substitute_immediate_supervisor?.id : null,
      is_admin: person.is_admin,
      administrator_profile: person?.administrator_profile?.id ?? null
    });
    if (person.patronal_registration) {
      formPerson.setFieldsValue({
        patronal_registration: person.patronal_registration,
      });
    }
    if (person.work_title) {
      formPerson.setFieldsValue({
        person_department: person.work_title.department.id,
        job: person.work_title.job.id,
        work_title_id: person.work_title.id,
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

    if (person.timestamp)
      formPerson.setFieldsValue({
        register_date: moment(person.timestamp),
      });

    if (person.is_admin)
      // setIsActiveAdmin(person.is_admin)
      formPerson.setFieldsValue({
        is_admin: person.is_admin,
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
    // setSelectedSupervisorId(person?.immediate_supervisor?.id ? person?.immediate_supervisor?.id : '')
  };

  const validateImmediateSupervisor = (id) => ({
    validator(rule, value) {
      if (value != id) {
        return Promise.resolve();
      }
      return Promise.reject("No se puede elegir al mismo usuario como jefe inmediato");
    },
  });

  const onFinishPerson = (value) => {
    if (value.patronal_registration === undefined) {
      value.patronal_registration = null;
    }
    if (dateIngPlatform) value.register_date = moment(dateIngPlatform).format('YYYY-MM-DD');
    else delete value["register_date"];
    if (birthDate) value.birth_date = moment(birthDate).format('YYYY-MM-DD');
    else value.birth_date = null;
    if (dateAdmission) value.date_of_admission = moment(dateAdmission).format('YYYY-MM-DD');
    else delete value["date_of_admission"];
    value.id = person.id;
    value.is_active = isActive;
    if (value.node) delete value["node"];
    //La validación se realiza desde back
    // if (!value.is_admin) value.administrator_profile = null;
    if (value.department) delete value["department"];
    value.groups && value.groups
      ? (value.groups = [value.groups])
      : delete value["groups"];
    value.immediate_supervisor != undefined ? value.immediate_supervisor : null;
    // console.log(value)
    // return
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
        if (error?.response?.data?.message === "Este email ya se encuentra registrado") {
          formPerson.setFields([
            { name: 'email', errors: [error.response.data.message] },
          ])
        }
        setLoading(false);
      });
  };

  // let numberPhoto = 0;
  const upImage = (info, isAdd = true) => {
    // numberPhoto = numberPhoto + 1;
    let data = new FormData();
    let photo = info ? info?.file?.originFileObj : "";
    data.append("id", person.id);

    if (info){
      //Si se envía este campo se actualiza la foto, en caso contrario se elimina.
      data.append("photo", photo);
      getBase64(info?.file?.originFileObj, (imageUrl) => setPhoto(imageUrl))
    }

    if (!loadImge) upImageProfile(data, isAdd);
  }

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const upImageProfile = async (data, isAdd) => {
    try {
      setLoadImage(true);
      let response = await WebApiPeople.updatePhotoPerson(data);
      formPerson.setFieldsValue({
        photo: response?.data?.photo,
      });
      message.success({
        content: isAdd ? "Foto agregada" : "Foto eliminada",
        className: "custom-class",
      });
      setPhoto(response?.data?.photo)
      // numberPhoto = 0;
      setLoadImage(false);
    } catch (error) {
      let msg = isAdd ? 'Foto no agregada' : 'Foto no eliminada';
      message.success(msg)
      console.log(error);
      setLoadImage(false);
      // setPhoto(null);
    }
  };

  const uploadButton = (
    <div>
      {loadImge ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Cargar</div>
    </div>
  );

  const onChangeDateAdmission = (date, dateString) => {
    setDateAdmission(moment(date).format('YYYY-MM-DD'));
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

  const setFormatEmail = (val) => {
    formPerson.setFieldsValue({
      email: val.target.value.toLowerCase()
    })
  }

  // const changeStatusAdmin = async (value) => {
  //   setIsActiveAdmin(value)
  // };

  const onChangeIngPlatform = (date, dateString) => {
    setDateIngPlatform(dateString);
  };

  const onChangeBirthDate = (date, dateString) => {
    if (date) {
      setBirthDate(moment(date).format('YYYY-MM-DD'));
    } else {
      setBirthDate(null)
    }

  };

  const onChangeSupervisor = (value) => {
    // setSelectedSupervisorId(value)
    formPerson.setFieldsValue({
      substitute_immediate_supervisor: ''
    })
    // let _substitutes = listPersons.filter(e => e.id !== value)
    // setSubstituteSupervisorList(_substitutes )
  }

  const onClearSupervisor = () => {
    // setSelectedSupervisorId('')
    formPerson.setFieldsValue({
      // immediate_supervisor: '',
      substitute_immediate_supervisor: null,
    })
  }

  const onClearSubstituteSupervisor = () => {
    // setSelectedSupervisorId('')
    formPerson.setFieldsValue({
      substitute_immediate_supervisor: '',
    })
  }

  // Lista para asignar jefe inmediato
  // Se excluye al suplente de jefe inmediato en caso de tener uno asignado
  const listImmediateSupervisor = useMemo(() => {
    if (!id_substitute) return listPersons;
    return listPersons.filter(item => item.id !== id_substitute);
  }, [listPersons, id_substitute])

  // Lista para asignar suplente de jefe inmediato
  // Se excluye al jefe inmediato en caso de tener uno asignado
  const listSubstituteSupevisor = useMemo(() => {
    if (!id_supervisor) return listPersons;
    return listPersons.filter(item => item.id !== id_supervisor);
  }, [listPersons, id_supervisor])

  const photoProfile = (
    <div className="ant-profile-img">
      <Spin
        indicator={<LoadingOutlined style={{color: 'black'}}/>}
        spinning={loadImge}
      >
        <Upload
          name="avatar"
          listType="picture-card"
          className="frontImage"
          showUploadList={false}
          accept={'.jpg,.png'}
          onChange={e => upImage(e, true)}
          maxCount={1}
        >
          {photo ? (
            <img
              src={photo}
              alt="avatar"
              style={{
                height: 'auto',
                width: '100%'
              }}
            />
          ) : uploadButton}
        </Upload>
      </Spin>
      {photo && (
        <div className="ant-profile-actions">
          {/* <button type="button" className="ant-btn-simple small">
          <PlusOutlined />
        </button> */}
          <button
            disabled={loadImge}
            type="button"
            className="ant-btn-simple small"
            onClick={() => upImage(null, false)}
          >
            <DeleteOutlined />
          </button>
        </div>
      )}
    </div>
    // <Spin tip="Cargando..." spinning={loadImge}>
    //   <div
    //     style={
    //       photo
    //         ? {
    //           width: "120px",
    //           height: "120px",
    //           display: "flex",
    //           flexWrap: "wrap",
    //           alignContent: "center",
    //           textAlign: "center",
    //         }
    //         : {}
    //     }
    //   >
    //     <Upload
    //       name="avatar"
    //       listType="picture-card"
    //       showUploadList={false}
    //       accept={'.jpg,.png'}
    //       onChange={upImage}
    //     >
    //       {photo ? (
    //         <div
    //           className="frontImage"
    //           style={
    //             photo
    //               ? {
    //                 width: "120px",
    //                 height: "120px",
    //                 display: "flex",
    //                 flexWrap: "wrap",
    //                 borderRadius: "10px",
    //                 textAlign: "center",
    //                 alignContent: "center",
    //               }
    //               : {}
    //           }
    //         >
    //           <img
    //             className="img"
    //             src={photo}
    //             alt="avatar"
    //             preview={false}
    //             style={{
    //               width: "120px",
    //               height: "120px",
    //               borderRadius: "11px",
    //             }}
    //           />
    //         </div>
    //       ) : (
    //         uploadButton
    //       )}
    //     </Upload>
    //   </div>
    // </Spin>
  )

  return (
    <Spin tip="Cargando..." spinning={loading}>
      <Form
        onFinish={onFinishPerson}
        layout={"vertical"}
        form={formPerson}
        className="form-details-person"
      >
        <Row justify="center">
          <Col lg={22}>
            <Row gutter={20}>
              <Col lg={0} md={12} xs={24} xl={12}>
                {photoProfile}
              </Col>
            </Row>
            <Row gutter={20}>
              <Col lg={8} xs={24}>
                <Switch
                  checked={isActive}
                  onClick={changeStatus}
                  checkedChildren="Activo"
                  unCheckedChildren="Inactivo"
                />
              </Col>
            </Row>
            <Row gutter={20}>
              {((props.user && props.user.nodes) ||
                (props.user && props.user.is_admin)) && (
                  <Col lg={8} xs={12}>
                    <Form.Item label="Número de empleado" name="code">
                      <Input type="text" placeholder="Núm. empleado" />
                    </Form.Item>
                  </Col>
                )}
              {/*{*/}
              {/*  props.cat_person_type.length > 0 &&*/}
                <Col lg={8} xs={12}>
                  <SelectPersonType label="Tipo de persona" />
                </Col>
              {/*}*/}
              <Col lg={8} xs={24}>
                <Form.Item
                  name="date_of_admission"
                  label="Fecha de ingreso laboral"
                >
                  <DatePicker
                    locale={locale}
                    onChange={onChangeDateAdmission}
                    format={"DD-MM-YYYY"}
                    readOnly
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col lg={6} md={0} xs={0} xl={0}>
                {photoProfile}
              </Col>
            </Row>
            <Row gutter={20}>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="first_name"
                  label="Nombre(s)"
                  rules={[{ message: "Ingresa un nombre" }, nameLastname]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="flast_name"
                  label="Apellido Paterno"
                  rules={[
                    { message: "Ingresa un apellido paterno" },
                    nameLastname,
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="mlast_name"
                  label="Apellido Materno"
                  rules={[
                    { message: "Ingresa un apellido paterno" },
                    nameLastname,
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* <Col lg={8} xs={24} md={12}>
                <Form.Item label="Empresa">
                  <Input
                    readOnly
                    value={props.currentNode && props.currentNode.name}
                  />
                </Form.Item>
              </Col> */}
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
                // rules = { [ruleRequired] }
                />
              </Col>
              <Col lg={8} xs={24} md={12}>
                <SelectWorkTitle
                  viewLabel={true}
                  department={departmentSelected}
                  job={jobSelected}
                  person={personWT}
                  personId={person.id}
                  name={"work_title_id"}
                  // rules={[ruleRequired]}
                  dependencies={['person_department', 'job']}
                  placeholder='Seleccionar una opción'
                />
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
                    locale={locale}
                    style={{ width: "100%" }}
                    onChange={onChangeIngPlatform}
                    format={"DD-MM-YYYY"}
                    placeholder="Fecha de ingreso a la plataforma"
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="immediate_supervisor"
                  label="Jefe inmediato / Autorizador concierge"
                // rules={[validateImmediateSupervisor(person.id)]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    allowClear={true}
                    // onChange={onChangeSupervisor}
                    onClear={onClearSupervisor}
                    placeholder="Seleccionar una opción"
                    notFoundContent="No se encontraron resultados"
                  >
                    {listImmediateSupervisor.length > 0 &&
                      listImmediateSupervisor.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {getFullName(item)}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={8} xs={24}>
                <Form.Item name="substitute_immediate_supervisor" label="Suplente de jefe inmediato / Autorizador concierge">
                  <Select showSearch optionFilterProp="children"
                    allowClear={true}
                    disabled={!id_supervisor}
                    // onClear={onClearSubstituteSupervisor}
                    placeholder='Seleccionar una opción'
                    notFoundContent='No se encontraron resultados'

                  >
                    {listSubstituteSupevisor.length > 0 &&
                      listSubstituteSupevisor.map((item) => (
                        <Select.Option value={item.id} key={item.id}>
                          {getFullName(item)}
                        </Select.Option>
                      ))}
                  </Select>
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
              {config.applications?.find(
                (item) => item.app === "SUKHATV" && item.is_active
              ) && (
                  <Col lg={8} xs={24} md={12}>
                    <Form.Item name="sukhatv_access" label="Acceso a Sukha Tv">
                      <Select options={SukhaAccess} />
                    </Form.Item>
                  </Col>
                )}
              {config.applications?.find(
                (item) => item.app === "SUKHATV" && item.is_active
              ) && (
                  <Col lg={8} xs={24} md={12}>
                    <Form.Item
                      name="is_sukhatv_admin"
                      label="¿Es administrador SukhaTV?"
                    >
                      <Select options={SukhaAccess} />
                    </Form.Item>
                  </Col>
                )}
              {config.applications?.find(
                (item) => item.app === "KHORFLIX" && item.is_active
              ) && (
                  <Col lg={8} xs={24} md={12}>
                    <Form.Item name="khorflix_access" label="Acceso a Khorflix">
                      <Select options={KhorflixAccess} />
                    </Form.Item>
                  </Col>
                )}
              {config.applications?.find(
                (item) => item.app === "KHORFLIX" && item.is_active
              ) && (
                  <Col lg={8} xs={24} md={12}>
                    <Form.Item
                      name="is_khorflix_admin"
                      label="¿Es administrador Khorflix?"
                    >
                      <Select options={KhorflixAccess} />
                    </Form.Item>
                  </Col>
                )}
              {config.applications?.find(
                (item) => item.app === "CAREERLAB" && item.is_active
              ) && (
                  <Col lg={8} xs={24} md={12}>
                    <Form.Item
                      name="is_careerlab_admin"
                      label="¿Es administrador Careerlab?"
                    >
                      <Select options={CareerlabAccess} />
                    </Form.Item>
                  </Col>
                )}
              {config.applications?.find(
                (item) => item.app === "KHORFLIX" && item.is_active
              ) && (
                  <Col lg={8} xs={24} md={12}>
                    <Form.Item name="careerlab_access" label="Acceso a Careerlab">
                      <Select options={CareerlabAccess} />
                    </Form.Item>
                  </Col>
                )}
              {person?.khonnect_id && <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="is_admin"
                  label="¿Es administrador?"
                >
                  <Select
                    placeholder='Seleccionar una opción'
                    options={[
                      { value: true, key: true, label: 'Sí' },
                      { value: false, key: false, label: 'No' }
                    ]}
                  />
                </Form.Item>
              </Col>}
              {/* {isAdmin && (
                <Col lg={8} xs={24} md={12}>
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
                  rules={[{ type: "email", message: "Ingresa una dirección de e-mail válida" }]}
                >
                  <Input onChange={setFormatEmail} />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item name="birth_date" label="Fecha de nacimiento">
                  <DatePicker
                    locale={locale}
                    style={{ width: "100%" }}
                    onChange={onChangeBirthDate}
                    format={"DD-MM-YYYY"}
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
                <Form.Item
                  name="curp"
                  label="CURP"
                  rules={[config.applications.find(
                    (item) => item.app === "PAYROLL" && item.is_active
                  ) ? ruleRequired : {}, curpFormat]}
                >
                  <Input maxLength={18} />
                </Form.Item>
              </Col>
              <Col lg={8} xs={24} md={12}>
                <Form.Item
                  name="rfc"
                  label="RFC"
                  rules={[config.applications.find(
                    (item) => item.app === "PAYROLL" && item.is_active
                  ) ? ruleRequired : {}, rfcFormat]}
                >
                  <Input maxLength={13} />
                </Form.Item>
              </Col>
              {assimilated_pay == false &&
                <>
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
                    <SelectPatronalRegistration
                      name={"patronal_registration"}
                      value_form={"patronal_registration"}
                      textLabel={"Registro Patronal"}
                      currentNode={currentNode}
                    />
                  </Col>
                </>}

              {/* {person?.khonnect_id && <Col lg={8} xs={24} md={12}>
              <Form.Item
                  name="is_admin"
                  label="Es admin"
                >
                  <Switch
                    checked={isActiveAdmin}
                    onClick={changeStatusAdmin}
                    checkedChildren="Si"
                    unCheckedChildren="No"
                  />
                </Form.Item>
                </Col>} */}
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
    list_admin_roles_options: state.catalogStore.list_admin_roles_options,
    load_admin_roles_options: state.catalogStore.load_admin_roles_options
  };
};

export default connect(mapState)(DataPerson);
