import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Typography,
  Button,
  Form,
  Row,
  Col,
  Upload,
  Input,
  Image,
  DatePicker,
  Modal,
  Select,
  InputNumber,
} from "antd";
import moment from "moment";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
import { ruleRequired } from "../../utils/rules";
import WebApiPeople from "../../api/WebApiPeople";
import WebApiFiscal from "../../api/WebApiFiscal";
import locale from "antd/lib/date-picker/locale/es_ES";
import { getDifferenceDays } from "../../utils/functions";

const Incapacityform = (props) => {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [urlPhoto, setUrlPhoto] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [disabilitys, setDisabilitys] = useState([]);
  const [classification, setClassification] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [subCategorys, setSubCategorys] = useState([]);
  const [incapacityType, setIncapacityType] = useState(null);
  const [classific, setClassific] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const clasification_imss = [
    { value: 0, label: "No aplica" },
    { value: 1, label: "Accidente de trabajo" },
    { value: 2, label: "Accidente en trayecto" },
    { value: 3, label: "Enfermedad de trabajo" },
    { value: 4, label: "Pre" },
    { value: 5, label: "Enlace" },
    { value: 6, label: "Post" },
    { value: 7, label: "Unica" },
  ];
  const category = [
    { value: 0, label: "No aplica" },
    { value: 1, label: "Inicial" },
    { value: 2, label: "Unica" },
  ];

  useLayoutEffect(() => {
    setPermissions(props.permissions);
    setTimeout(() => {
      permissions;
    }, 5000);
  }, [props.permissions]);

  const changePerson = async (value) => {
    if (value) {
      WebApiPeople.getPerson(value)
        .then(function (response) {
          let index = response.data;
          form.setFieldsValue({
            job: index.work_title.job ? index.work_title.job.name : null,
          });
          setUrlPhoto(index.photo ? index.photo : null);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      form.setFieldsValue({
        job: null,
      });
      setUrlPhoto(null);
    }
  };

  const onchangeFile = (file) => {
    setFileList(file.fileList);
    props.setFile(file.file);
  };

  const changeIncapacity = (value) => {
    let selected = disabilitys.find((element) => element.value == value);
    if (selected) {
      setIncapacityType(selected.code);
      let values = [];
      switch (selected.code) {
        case "01":
          values = clasification_imss.filter(
            (element) => element.value >= 1 && element.value <= 3
          );
          setClassification(values);
          form.setFieldsValue({
            imss_classification: "",
            category: "",
            subcategory: "",
          });
          break;
        case "02":
          values = clasification_imss.filter((element) => element.value == 0);
          setClassification(values);
          values[0].value;
          let _categorys = category.filter((x) => x.value !== 2);
          setClassific(values[0].value);
          form.setFieldsValue({
            imss_classification: values[0].value,
            category: "",
            subcategory: "",
          });
          setCategorys(_categorys);
          break;
        case "03":
          values = clasification_imss.filter(
            (element) => element.value >= 4 && element.value <= 7
          );
          setClassification(values);
          form.setFieldsValue({
            imss_classification: "",
            category: "",
            subcategory: "",
          });
          break;
        case "04":
          values = clasification_imss.filter((element) => element.value == 0);
          setClassification(values);
          setClassific(values[0].value);
          let cats = category.filter((x) => x.value == 0);
          setCategorys(cats);
          let subcats = category.filter((x) => x.value == 2);
          setSubCategorys(subcats);
          form.setFieldsValue({
            imss_classification: values[0].value,
            category: cats[0].value,
            subcategory: subcats[0].value,
          });

        default:
          break;
      }
    }
  };

  const changeClassification = (value) => {
    if (value) {
      setClassific(value);
      let values = [];
      //Riezgo de trabajo
      if (incapacityType == "01") {
        if (value == 1) {
          values = category.filter((x) => x.value === 0);
          setCategorys(values);
          setSubCategorys(values);
          form.setFieldsValue({
            category: category[0].value,
            subcategory: category[0].value,
          });
        }
        if (value == 2 || value == 3) {
          values = category.filter((x) => x.value === 1);
          setCategorys(values);
          let sub_categorys = category.filter((x) => x.value !== 0);
          setSubCategorys(sub_categorys);
          form.setFieldsValue({
            category: values[0].value,
            subcategory: "",
          });
        }
      }
      //Enfermedad general
      if (incapacityType == "02") {
        if (value == 0) {
          values = category.filter((x) => x.value !== 1);
          setCategorys(values);
        }
      }
      //Maternidad
      if (incapacityType == "03") {
        if (value == 4 || value == 5 || value == 6 || value == 7) {
          values = category.filter((x) => x.value == 0);
          setCategorys(values);
          form.setFieldsValue({ category: category[0].value });

          let sub_categorys = category.filter((x) => x.value == 2);
          setSubCategorys(sub_categorys);
          form.setFieldsValue({ subcategory: sub_categorys[0].value });
        }
      }
      //Licencia cuidados medicos
      if (incapacityType == "04") {
        values = category.filter((x) => x.value == 0);
        setCategorys(values);
        let sub_categorys = category.filter((x) => x.value == 1);
        setSubCategorys(sub_categorys);
        form.setFieldsValue({
          category: category[0].value,
          subcategory: sub_categorys[0].value,
        });
      }
    }
  };

  const changeCategorys = (value) => {
    let values = [];

    if (incapacityType == "02" && classific == 0 && value == 0) {
      values = category.filter((x) => x.value == 2);
      setSubCategorys(values);
      form.setFieldsValue({ subcategory: values[0].value });
    }
    if (incapacityType == "02" && classific == 0 && value == 1) {
      values = category.filter((x) => x.value !== 0);
      setSubCategorys(values);
      form.setFieldsValue({ subcategory: values[1].value });
    }
  };

  const changeDepartureDate = (date, dateString) => {
    setStartDate(dateString);
    props.onChangeDepartureDate(date, dateString);
  };

  const changeReturnDate = (date, dateString) => {
    setEndDate(dateString);
    props.onChangeReturnDate(date, dateString);
  };

  const showMoalapprove = () => {
    Modal.confirm({
      title: "¿Está seguro de aprobar la siguiente solicitud de incapacidad?",
      icon: <ExclamationCircleOutlined />,
      okText: "Aceptar y notificar",
      cancelText: "Cancelar",
      onOk() {
        props.onApprove();
      },
    });
  };

  const getDisabilitys = async () => {
    WebApiFiscal.getDisabilityType()
      .then(function (response) {
        // Los registros se repiten y se eliminan por medio del código
        let list = response.data?.results?.reduce((acc, current) =>{
          const some_ = item => item.code == current.code;
          if(acc?.some(some_)) return acc;
          return [...acc, current] 
      },[])
        let datas = list.map((a) => {
          return { label: a.description, value: a.id, code: a.code };
        });
        setDisabilitys(datas);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getDisabilitys();
    if (props.details) {
      setStartDate(props.details.departure_date);
      setEndDate(props.details.return_date);
      setClassific(props.details.imss_classification);
      changeIncapacity(props.details.incapacity_type);
      form.setFieldsValue({
        invoice: props.details.invoice,
        person: props.details.person ? props.details.person.id : null,
        incapacity_type: props.details.incapacity_type,
        imss_classification: props.details.imss_classification,
        category: props.details.category,
        subcategory: props.details.subcategory,
        requested_days: props.details.requested_days,
        departure_date: props.details.departure_date
          ? moment(props.details.departure_date, "YYYY-MM-DD")
          : null,
        return_date: props.details.return_date
          ? moment(props.details.return_date, "YYYY-MM-DD")
          : null,
        payroll_apply_date: props.details.payroll_apply_date
          ? moment(props.details.payroll_apply_date, "YYYY-MM-DD")
          : null,
        document: props.details.document ? props.details.document : null,
      });
      changePerson(props.details.person.id);

      setUrlPhoto(
        props.details.person && props.details.person.photo
          ? props.details.person.photo
          : null
      );
      /* File */
      if (props.details.document) {
        let fileDefault = [
          {
            uid: "-1",
            name: "Documento Actual",
            status: "done.png",
            url: props.details.document,
          },
        ];
        setFileList(fileDefault);
      }
    }
  }, [props.details]);

  useEffect(() => {
    if (incapacityType && (props.edit || props.view)) {
      changeClassification(props.details.imss_classification);
    }
    if (incapacityType && classific && (props.edit || props.view)) {
      changeCategorys(props.details.category);
      form.setFieldsValue({
        subcategory: props.details.subcategory,
      });
    }
  }, [incapacityType, classific]);

  const sumDays = (days) => {
    if (days && startDate) {
      let date = new Date(startDate);
      date.setDate(date.getDate() + (days - 1));
      let end_date = date.toISOString().substring(0, 10);
      changeReturnDate(end_date, end_date.toString());
      form.setFieldsValue({
        return_date: moment(end_date, "YYYY-MM-DD"),
      });
    } else {
      form.setFieldsValue({
        return_date: null,
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className={"formPermission"}
      onFinish={props.onFinish}
    >
      <Col span={24} style={{ padding: "20px" }}>
        <Row>
          <Col span={20} offset={4}>
            <Title key="dats_gnrl" level={4}>
              Solicitud
            </Title>
          </Col>
          <Col lg={4} md={4} sm={24} xs={24} style={{ textAlign: "center" }}>
            {urlPhoto ? (
              <Image style={{ width: "80%" }} src={urlPhoto} />
            ) : (
              <Image
                style={{ width: "80%" }}
                src={"error"}
                fallback="data:image/png;base64,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"
              />
            )}
          </Col>
          <Col lg={20} md={20} sm={24} xs={24}>
            <Row span={24}>
              <Col lg={12} sm={24}>
                <Form.Item
                  label="Folio"
                  name="invoice"
                  style={{ width: "100%" }}
                >
                  <Input
                    rules={[ruleRequired]}
                    disabled={props.readOnly || props.sending || props.edit}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} sm={24}>
                <Form.Item name="person" rules={[ruleRequired]}>
                  <SelectCollaborator
                    label="Empleado"
                    name="person"
                    onChange={changePerson}
                    isDisabled={props.readOnly || props.sending}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} sm={24}>
                <Form.Item label="Puesto" name="job" readOnly>
                  <Input readOnly style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col lg={12} sm={24}>
                <Form.Item
                  name="incapacity_type"
                  label="Tipo de incapacidad"
                  rules={[ruleRequired]}
                >
                  <Select
                    disabled={props.readOnly || props.sending}
                    style={{ width: "100%" }}
                    onChange={changeIncapacity}
                    options={disabilitys}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} sm={24}>
                <Form.Item
                  name="imss_classification"
                  label="Clasificación (IMSS)"
                  rules={[ruleRequired]}
                >
                  <Select
                    disabled={props.readOnly || props.sending}
                    style={{ width: "100%" }}
                    options={classification}
                    onChange={changeClassification}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} sm={24}>
                <Form.Item
                  name="category"
                  label="Categoría"
                  rules={[ruleRequired]}
                >
                  <Select
                    disabled={props.readOnly || props.sending}
                    style={{ width: "100%" }}
                    options={categorys}
                    onChange={changeCategorys}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} sm={24}>
                <Form.Item
                  name="subcategory"
                  label="Subcategoría"
                  rules={[ruleRequired]}
                >
                  <Select
                    style={{ width: "100%" }}
                    disabled={props.readOnly || props.sending}
                    options={subCategorys}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} sm={24}>
                <Form.Item
                  name="departure_date"
                  label="Fecha de inicio"
                  rules={[ruleRequired]}
                >
                  <DatePicker
                    disabled={props.readOnly || props.sending}
                    key="departure_date"
                    style={{ width: "100%" }}
                    onChange={changeDepartureDate}
                    locale = { locale }
                  />
                </Form.Item>
              </Col>
              <Col lg={12} sm={24}>
                <Form.Item
                  name="return_date"
                  label="Fecha final"
                  rules={[ruleRequired]}
                >
                  <DatePicker
                    disabled={true}
                    key="return_date"
                    style={{ width: "100%" }}
                    onChange={changeReturnDate}
                    locale = { locale }
                  />
                </Form.Item>
              </Col>
              <Col lg={12} sm={24}>
                <Form.Item
                  label="Dias solicitados"
                  name="requested_days"
                  style={{ width: "100%" }}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    onChange={sumDays}
                    rules={[ruleRequired]}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} sm={24}>
                <Form.Item
                  name="payroll_apply_date"
                  label="Fecha de aplicación en Nómina"
                  rules={[ruleRequired]}
                >
                  <DatePicker
                    disabled={props.readOnly || props.sending}
                    key="payroll_apply_date"
                    style={{ width: "100%" }}
                    onChange={props.onChangePayrollApplyDate}
                    locale = { locale }
                  />
                </Form.Item>
              </Col>
              <Col lg={12} sm={24}>
                <Form.Item
                  label="Documentación"
                  name="document"
                  rules={[ruleRequired]}
                >
                  <Upload
                    disabled={props.readOnly || props.sending}
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onchangeFile}
                    maxCount={1}
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>

              <Col span={24} style={{ textAlign: "right" }}>
                <Button
                  onClick={props.onCancel}
                  key="cancel"
                  style={{ padding: "0 50px", marginBottom: "10px" }}
                >
                  Regresar
                </Button>
                {permissions.reject_incapacity && props.toApprove && (
                  <Button
                    danger
                    onClick={props.onReject}
                    key="reject"
                    type="primary"
                    style={{
                      padding: "0 50px",
                      marginLeft: 15,
                      marginBottom: "10px",
                    }}
                  >
                    Rechazar
                  </Button>
                )}
                {permissions.approve_incapacity && props.toApprove && (
                  <Button
                    onClick={showMoalapprove}
                    type="primary"
                    key="aprove"
                    className={"btn-success"}
                    loading={props.sending}
                    style={{
                      padding: "0 50px",
                      marginLeft: 15,
                      marginBottom: "10px",
                    }}
                  >
                    Aprobar permiso
                  </Button>
                )}
                {!props.toApprove ? (
                  <Button
                    key="save"
                    htmlType="submit"
                    type="primary"
                    style={{
                      padding: "0 50px",
                      marginLeft: 15,
                      marginBottom: "10px",
                    }}
                    loading={props.sending}
                  >
                    {props.edit ? "Actualizar" : "Guardar"}
                  </Button>
                ) : null}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Form>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.incapacity,
  };
};

export default connect(mapState)(withAuthSync(Incapacityform));
