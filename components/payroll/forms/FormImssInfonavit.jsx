import React, { useState, useEffect } from "react";
import {
  Spin,
  Button,
  Row,
  Col,
  Typography,
  Table,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Divider,
  Tooltip,
  Alert,
  Space,
} from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import {
  typeEmployee,
  typeSalary,
  reduceDays,
  FACTOR_SDI,
  InfonavitDiscountType,
  messageError,
} from "../../../utils/constant";
import SelectFamilyMedicalUnit from "../../selects/SelectFamilyMedicalUnit";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import WebApiPayroll from "../../../api/WebApiPayroll";
import moment from "moment";
import {
  fourDecimal,
  minLengthNumber,
  onlyNumeric,
  ruleRequired,
} from "../../../utils/rules";
import Link from "next/link";

const FormImssInfonavit = ({ person, person_id = null,refreshtab=false, node, ...props }) => {
  const { Title } = Typography;
  const [formImssInfonavit] = Form.useForm();
  const [formInfonavitManual] = Form.useForm();
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingIMSS, setLodingIMSS] = useState(false);
  const [infonavitCredit, setInfonavitCredit] = useState([]);
  const [updateCredit, setUpdateCredit] = useState(null);
  const [updateInfonavit, setUpdateInfonavit] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nss, setNSS] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [isNewRegister, setIsNewRegister] = useState(false);
  const [existCredit, setExistCredit] = useState(null);
  const [movementTypes, setMovementTypes] = useState([]);
  const [disabledStartDate, setDisabledStartDate] = useState(false);
  const [disabledNumber, setDisabledNumber] = useState(false);
  const [disabledCreditType, setDisabledCreditType] = useState(true);
  const [disabledStatus, setDisabledStatus] = useState(false);
  const [disabledMovementType, setDisabledMovementType] = useState(false);
  const [disabledDiscountType, setDisabledDiscountType] = useState(false);
  const [disabledDiscountValue, setDisabledDiscountValue] = useState(false);
  const [isSuspension, setIsSuspension] = useState(false);

  // const daily_salary = Form.useWatch("sd", formImssInfonavit);
  let errorExceptionOne = "La persona cuenta con crédito infonavit";
  let errorExceptionTwo = "La persona no cuenta con crédito";

  const InfonavitMovementype = [
    { value: 1, label: "Inicio Descuento" },
    { value: 2, label: "Suspensión Descuento" },
    { value: 3, label: "Modificación Tipo Descuento" },
    { value: 4, label: "Modificación Valor Descuento" },
    { value: 5, label: "Modificación de Número de Crédito" },
  ];

  const CreditType = [
    { value: 1, label: "Crédito Tradicional" },
    { value: 2, label: "Crédito Apoyo INFONAVIT" },
    { value: 3, label: "Credito Cofinanciado 08" },
  ];

  useEffect(() => {
    setMovementTypes(InfonavitMovementype);
    person_id && localUserCredit() && getInfo();
  }, [person_id]);

  useEffect(() => {
    if (updateCredit) {
      if (updateCredit.id) {
        setIsEdit(true);
        formImssInfonavit.setFieldsValue({
          employee_type: updateCredit.employee_type,
          salary_type: updateCredit.salary_type,
          reduce_days: updateCredit.reduce_days,
          movement_date: moment(updateCredit.movement_date),
          family_medical_unit: updateCredit.family_medical_unit.id,
          nss: updateCredit.nss,
          sdi: updateCredit.sdi,
        });
        setNSS(updateCredit.nss);
      } else {
        formImssInfonavit.setFieldsValue({
          nss: person.imss,
          sdi: updateCredit.sdi,
        });
        setNSS(person.imss);
      }
    }
  }, [updateCredit]);

  useEffect(() => {
    if (updateInfonavit) {
      formInfonavitManual.setFieldsValue({
        folio: updateInfonavit.folio,
        start_date: updateInfonavit.start_date
          ? moment(updateInfonavit.start_date)
          : null,
        start_date_movement: updateInfonavit.start_date_movement
          ? moment(updateInfonavit.start_date_movement)
          : null,
        number: updateInfonavit.number,
        type: updateInfonavit.type,
        status: updateInfonavit.status,
        discount_type: updateInfonavit.discount_type
          ? updateInfonavit.discount_type
          : null,
        discount_value:
          updateInfonavit.discount_value > 0
            ? updateInfonavit.discount_value
            : null,
        discount_suspension_date: updateInfonavit.discount_suspension_date
          ? moment(updateInfonavit.discount_suspension_date)
          : null,
        movement: updateInfonavit.movement != 1 ? updateInfonavit.movement : "",
      });
      if (updateInfonavit.movement == 1) {
        setIsNewRegister(true);
        setMovementTypes(InfonavitMovementype);

        // Campos bloqueados
        setDisabledStartDate(false);
        setDisabledNumber(false);
        // setDisabledCreditType(false);
        setDisabledStatus(false);
        setDisabledMovementType(true);
        setDisabledDiscountType(false);
        setDisabledDiscountValue(false);
      } else {
        let choises_type = InfonavitMovementype.filter(
          (item) => item.value > 1
        );
        setMovementTypes(choises_type);
        setDisabledStartDate(true);
        setDisabledNumber(true);
        // setDisabledCreditType(true);
        setDisabledStatus(false);
        setDisabledMovementType(true);
        setDisabledDiscountType(true);
        setDisabledDiscountValue(true);
      }
      setModalVisible(true);
    }
  }, [updateInfonavit]);

  useEffect(()=>{
    if(refreshtab){
      localUserCredit()
      props.onFinishRefresh()
    }
  },[refreshtab])

  useEffect(() => {
    if (isNewRegister) {
      formInfonavitManual.setFieldsValue({
        movement: 1,
        type: 1,
      });
    }
  }, [isNewRegister]);

  const formImmssInfonavitAct = async (values) => {
    setLoadingTable(true);

    values.person = person_id;
    values.movement_date = values.movement_date
      ? moment(values.movement_date).format("YYYY-MM-DD")
      : "";
    values.modify_by = "System";
    // values.patronal_registration = person?.branch_node? person.branch_node.patronal_registration.id    :  ""
    // funcion WEB API

    try {
      if (isEdit) {
        const res = await WebApiPayroll.editIMSSInfonavit(
          updateCredit.id,
          values
        );
        message.success("Editado exitosamente");
      } else {
        const res = await WebApiPayroll.saveIMSSInfonavit(values);

        message.success(
          "Guardado exitosamente, revise la sección de Movimientos IMSS"
        );
        localUserCredit();
      }
      setLoadingTable(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
        setLoadingTable(false);
      } else message.error(messageError);
    }
  };

  const userCredit = async () => {
    setLoadingTable(true);
    let data = new FormData();
    let patronal_registration = person?.patronal_registration;

    data.append("node", node);
    data.append("person", person_id);
    data.append("patronal_registration", patronal_registration);

    WebApiPayroll.getInfonavitCredit(data)
      .then((response) => {
        setLoadingTable(false);
        response &&
          response.data &&
          response.data.message &&
          response.data.message !== "" &&
          message.success(response.data.message);
        getInfo();
      })
      .catch((error) => {
        setLoadingTable(false);
        let errorMsg = error.response.data.message || "";
        if (errorMsg === errorExceptionOne || errorMsg === errorExceptionTwo) {
          message.error(errorMsg);
        } else {
          message.error(`La consulta de información no pudo ser exitosa, intente nuevamente, 
          recuerde que este proceso está  vinculado a la disponibilidad del servicio de infonavit.`);
        }
      })
      .finally(() => {
        getInfo();
      });
  };

  const getInfo = async () => {
    setLoadingTable(true);
    try {
      let response = await WebApiPayroll.getUserCredits(person_id);
      let credit_config = response.data.find((elem) => elem.is_active);
      setExistCredit(credit_config);
      setIsNewRegister(false);
      setInfonavitCredit(response.data);
    } catch (error) {
      setIsNewRegister(true);
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const localUserCredit = async () => {
    setLodingIMSS(true);
    try {
      let response = await WebApiPayroll.getPersonalCredits(person_id);
      setUpdateCredit(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLodingIMSS(false);
    }
  };

  const newInfonavit = async (values) => {
    values.person_id = person_id;

    values.start_date = moment(values.start_date).format("YYYY-MM-DD");

    if (values.movement != 2) {
      values.start_date_movement = moment(values.start_date_movement).format(
        "YYYY-MM-DD"
      );
    } else {
      values.start_date_movement = moment(
        values.discount_suspension_date
      ).format("YYYY-MM-DD");
    }
    values.discount_suspension_date = values.discount_suspension_date
      ? moment(values.discount_suspension_date).format("YYYY-MM-DD")
      : null;

    setLoadingModal(true);

    try {
      let response = updateInfonavit
        ? await WebApiPayroll.editInfonavit(updateInfonavit.id, values)
        : await WebApiPayroll.addInfonavit(values);
      (response &&
        updateInfonavit &&
        message.success("Editado Exitosamente")) ||
        message.success("Agregado Exitosamente");
    } catch (error) {
      if (error?.response?.data?.message)
        message.error(error.response.data.message);
      else message.error(messageError);
    } finally {
      setLoadingModal(false);
      onModalCancel();
      getInfo();
      setIsSuspension(false);
    }
  };

  const colCredit = [
    {
      title: "Fecha de inicio",
      dataIndex: "start_date",
      key: "start_date",
      // width: 100,
    },
    {
      title: "Folio",
      dataIndex: "folio",
      key: "folio",
      // width: 100,
    },
    {
      title: "Número",
      dataIndex: "number",
      key: "number",
      // width: 100,
    },
    {
      title: "Tipo de descuento",
      dataIndex: "discount_type",
      // width: 100,
      render: (item) => {
        return (
          <div>
            {item == 1
              ? "Porcentaje"
              : item == 2
              ? "Cuota fija mensual en Pesos"
              : item == 3
              ? "Cuota fija mensual en VSM"
              : ""}
          </div>
        );
      },
    },
    {
      title: "Valor de descuento",
      dataIndex: "discount_value",
      key: "discount_value",
    },
    {
      title: "Movimiento",
      dataIndex: "movement",
      // key: "movement",
      render: (item) => {
        return (
          <div>
            {item == 1
              ? "Inicio Descuento"
              : item == 2
              ? "Suspensión Descuento"
              : item == 3
              ? "Modificación Tipo Descuento"
              : item == 3
              ? "Modificación Valor Descuento"
              : "Modificación de Número de Crédito"}
          </div>
        );
      },
    },
    // {
    //   title: "Estatus",
    //   dataIndex: "status",
    //   key: "status",
    //   // width: 100,
    // },
    {
      title: "Opciones",
      render: (item, record) => {
        return (
          <div>
            <Row gutter={16}>
              <Col
                className="gutter-row"
                offset={1}
                style={{ padding: "0px 20px" }}
              >
                {record.is_active && (
                  <Tooltip title="Editar">
                    <EditOutlined
                      style={{ fontSize: "20px" }}
                      onClick={() => setUpdateInfonavit(item)}
                    />
                  </Tooltip>
                )}
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  const openModalInfonavit = () => {
    if (existCredit) {
      formInfonavitManual.setFieldsValue({
        start_date: moment(existCredit.start_date),
        number: existCredit.number,
        type: existCredit.type,
        status: existCredit.status,
        discount_type: existCredit.discount_type,
        discount_value: existCredit.discount_value,
      });
      let choises_type = InfonavitMovementype.filter((item) => item.value > 1);
      setMovementTypes(choises_type);

      //Campos bloqueados
      setDisabledStartDate(true);
      setDisabledNumber(true);
      // setDisabledCreditType(true);
      setDisabledStatus(true);
      setDisabledMovementType(false);
      setDisabledDiscountType(true);
      setDisabledDiscountValue(true);
    } else {
      setMovementTypes(InfonavitMovementype);
      formInfonavitManual.setFieldsValue({
        type: 1,
        status: "Vigente",
        movement: 1,
      });
    }
    setIsSuspension(false);
    setModalVisible(true);
  };

  const onModalCancel = () => {
    setUpdateInfonavit(null);
    setModalVisible(false);
    formInfonavitManual.resetFields();
    setIsNewRegister(false);
    setIsSuspension(false);
  };

  const changeMovement = (value) => {
    if (value) {
      switch (value) {
        case 2:
          // suspensión
          setIsSuspension(true);
          setDisabledNumber(true);
          setDisabledDiscountType(true);
          setDisabledDiscountValue(true);
          break;
        case 3:
          // Modificación de tipo descuento
          setDisabledDiscountType(false);
          setDisabledDiscountValue(false);
          setDisabledNumber(true);
          setIsSuspension(false);
          break;
        case 4:
          // Modificación de valor descuento
          setDisabledNumber(true);
          setDisabledDiscountType(true);
          setDisabledDiscountValue(false);
          setIsSuspension(false);
          break;
        case 5:
          // Modificación de Número de crédito
          setDisabledNumber(false);
          setDisabledDiscountValue(true);
          setDisabledDiscountType(true);
          setIsSuspension(false);
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      <Spin tip="Cargando..." spinning={loadingIMSS}>
          <Divider orientation="left"> <img src={'/images/logo_imss.png'} width={20}/> IMSS</Divider>
        <br/>

        <Form
          layout="vertical"
          form={formImssInfonavit}
          onFinish={formImmssInfonavitAct}
          className="form-details-person"
        >
          <Row>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="employee_type"
                label="Tipo de empleado"
                rules={[ruleRequired]}
                initialValue={1}
              >
                <Select
                  options={typeEmployee}
                  notFoundContent={"No se encontraron resultado."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="salary_type"
                label="Tipo de salario"
                rules={[ruleRequired]}
                initialValue={2}
              >
                <Select
                  options={typeSalary}
                  notFoundContent={"No se encontraron resultado."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="reduce_days"
                label="Semana o jornada reducida"
                rules={[ruleRequired]}
                initialValue={0}
              >
                <Select
                  options={reduceDays}
                  notFoundContent={"No se encontraron resultado."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="movement_date"
                label="Fecha de movimiento"
                rules={[ruleRequired]}
              >
                <DatePicker
                  locale={locale}
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <SelectFamilyMedicalUnit />
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="nss"
                label="IMSS"
                rules={[onlyNumeric, minLengthNumber]}
              >
                <Input maxLength={11} disabled={true} />
              </Form.Item>
            </Col>

            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="sdi"
                label="Salario diario integrado"
                maxLength={13}
                rules={[fourDecimal, ruleRequired]}
              >
                <Input
                  disabled={
                    updateCredit && updateCredit.is_registered ? true : false
                  }
                  maxLength={10}
                />
              </Form.Item>

              <Link href={`/payroll/imssMovements/?regPatronal=${person?.patronal_registration}`}>
                <a style={{color:'blue'}}>
                  <div>Ver movimientos IMSS</div>
                </a>
              </Link>
            </Col>
            {/* <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="integrated_daily_salary"
                label="Salario diario integrado"
                maxLength={13}
                rules={[fourDecimal]}
              >
                <Input disabled />
              </Form.Item>
            </Col> */}
          </Row>
          <Row justify={"end"}>
            <Form.Item>
              <Button
                loading={loadingIMSS}
                style={{ marginRight: 20 }}
                type="primary"
                htmlType="submit"
              >
                Guardar
              </Button>
            </Form.Item>
          </Row>
        </Form>

        <Divider />

        <Divider orientation="left"> <img src={"/images/logoinfonavit.png"} width={20} /> INFONAVIT</Divider>

        <br/>
        <Row justify="space-between">
          <div>
            <Space>
              <Button
                type="primary"
                loading={loadingTable}
                onClick={openModalInfonavit}
              >
                Nuevo
              </Button>
              {nss && (
                <Tooltip title="Obtener datos infonavit">
                  <Button onClick={() => userCredit()} loading={loadingTable}>
                    <SyncOutlined style={{ fontSize: "20px" }} />
                  </Button>
                </Tooltip>
              )}
            </Space>
          </div>
        </Row>

        <Spin tip="Cargando..." spinning={loadingTable}>
          <Table
            columns={colCredit}
            scroll={{
              x: true,
            }}
            rowKey="id"
            dataSource={infonavitCredit}
            locale={{
              emptyText: loadingTable
                ? "Cargando..."
                : "No se encontraron resultados.",
            }}
          />
        </Spin>
      </Spin>
      <Modal
        title="INFONAVIT manual"
        visible={modalVisible}
        onCancel={() => onModalCancel()}
        footer={[]}
      >
        <Form
          layout="vertical"
          form={formInfonavitManual}
          onFinish={newInfonavit}
          className="form-details-person"
        >
          <Row>
            <Col span={11}>
              <Form.Item label="Folio" name="folio">
                <Input maxLength={20} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label="Fecha de inicio"
                name="start_date"
                rules={[ruleRequired]}
              >
                <DatePicker
                  locale={locale}
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                  disabled={disabledStartDate}
                />
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item label="Tipo de crédito" name="type">
                <Select
                  allowClear
                  disabled={disabledCreditType}
                  options={CreditType}
                  initialValue={1}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label="Número"
                name="number"
                rules={[ruleRequired, onlyNumeric]}
              >
                <Input maxLength={10} disabled={disabledNumber} />
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item label="Estatus" name="status">
                <Select
                  allowClear
                  disabled={disabledStatus}
                  initialValue={"Vigente"}
                >
                  <Select.Option value={"Vigente"} key={"Vigente"}>
                    Vigente
                  </Select.Option>
                  <Select.Option value={"Sin crédito"} key={"Sin crédito"}>
                    Sin crédito
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label="Tipo de movimiento"
                name="movement"
                rules={[ruleRequired]}
              >
                <Select
                  allowClear
                  disabled={disabledMovementType}
                  options={movementTypes}
                  onChange={changeMovement}
                ></Select>
              </Form.Item>
            </Col>

            <Col span={11} offset={2}>
              {isSuspension && (
                <Form.Item
                  label="Fecha de suspensión de descuento"
                  name="discount_suspension_date"
                  rules={[ruleRequired]}
                >
                  <DatePicker
                    locale={locale}
                    format="DD-MM-YYYY"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              )}
              {!isSuspension && (
                <Form.Item
                  label="Fecha de inicio de movimiento"
                  name="start_date_movement"
                  rules={[ruleRequired]}
                >
                  <DatePicker
                    locale={locale}
                    format="DD-MM-YYYY"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label="Tipo de descuento"
                name="discount_type"
                rules={[ruleRequired]}
              >
                <Select
                  allowClear
                  options={InfonavitDiscountType}
                  disabled={disabledDiscountType}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item
                label="Valor de descuento"
                name="discount_value"
                maxLength={8}
                rules={[fourDecimal, ruleRequired]}
              >
                <Input
                  type="number"
                  disabled={disabledDiscountValue}
                  maxLength={10}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 30 }}>
            <Col>
              <Button
                key="back"
                onClick={() => {
                  onModalCancel();
                }}
                style={{ padding: "0 10px", marginLeft: 15 }}
              >
                Cancelar
              </Button>
            </Col>
            <Col>
              <Form.Item>
                <Button
                  key="submit_modal"
                  type="primary"
                  htmlType="submit"
                  style={{ padding: "0 10px", marginLeft: 15 }}
                  loading={loadingModal}
                >
                  {(updateInfonavit && "Editar") || "Registrar"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default FormImssInfonavit;
