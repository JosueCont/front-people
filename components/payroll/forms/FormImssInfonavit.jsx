import React, { useState, useEffect } from "react";
import {
  Spin,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Divider,
  Alert,
  Space,
} from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import {
  typeEmployee,
  typeSalary,
  reduceDays,
  messageError,
} from "../../../utils/constant";
import SelectFamilyMedicalUnit from "../../selects/SelectFamilyMedicalUnit";
import { DeleteOutlined } from "@ant-design/icons";
import WebApiPayroll from "../../../api/WebApiPayroll";
import moment from "moment";
import {
  fourDecimal,
  minLengthNumber,
  onlyNumeric,
  ruleRequired,
} from "../../../utils/rules";
import Link from "next/link";
import { connect } from "react-redux";

const InfonavitMovementype = [
  { value: 1, label: "Inicio Descuento" },
  { value: 2, label: "Suspensión Descuento" },
  { value: 3, label: "Modificación Tipo Descuento" },
  { value: 4, label: "Modificación Valor Descuento" },
  { value: 5, label: "Modificación de Número de Crédito" },
];

const FormImssInfonavit = ({ person, person_id = null, userInfo=null, refreshtab=false, node, ...props }) => {
  const { Title, Text} = Typography;
  const [formImssInfonavit] = Form.useForm();
  const [formInfonavitManual] = Form.useForm();
  const [loadingIMSS, setLodingIMSS] = useState(false);
  const [updateCredit, setUpdateCredit] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isNewRegister, setIsNewRegister] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false)

  // const daily_salary = Form.useWatch("sd", formImssInfonavit);





  useEffect(() => {
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
          movement_date: updateCredit.movement_date ?  moment(updateCredit.movement_date) : moment(person.date_of_admission),
          family_medical_unit: updateCredit.family_medical_unit.id,
          nss: updateCredit.nss,
          sdi: updateCredit.sdi,
        });
      } else {
        formImssInfonavit.setFieldsValue({
          nss: person.imss,
          sdi: updateCredit.sdi,
          movement_date: moment(person.date_of_admission)
        });
      }
    }else{
      formImssInfonavit.setFieldsValue({
        movement_date: moment(person.date_of_admission),
      })
    }
  }, [updateCredit]);

  // useEffect(() => {
  //   if (updateInfonavit) {
  //     formInfonavitManual.setFieldsValue({
  //       folio: updateInfonavit.folio,
  //       start_date: updateInfonavit.start_date
  //         ? moment(updateInfonavit.start_date)
  //         : null,
  //       start_date_movement: updateInfonavit.start_date_movement
  //         ? moment(updateInfonavit.start_date_movement)
  //         : null,
  //       number: updateInfonavit.number,
  //       type: updateInfonavit.type,
  //       status: updateInfonavit.status,
  //       discount_type: updateInfonavit.discount_type
  //         ? updateInfonavit.discount_type
  //         : null,
  //       discount_value:
  //         updateInfonavit.discount_value > 0
  //           ? updateInfonavit.discount_value
  //           : null,
  //       discount_suspension_date: updateInfonavit.discount_suspension_date
  //         ? moment(updateInfonavit.discount_suspension_date)
  //         : null,
  //       movement: updateInfonavit.movement != 1 ? updateInfonavit.movement : "",
  //     });
  //     if (updateInfonavit.movement == 1) {
  //       setIsNewRegister(true);
  //       setMovementTypes(InfonavitMovementype);

  //       // Campos bloqueados
  //       setDisabledStartDate(false);
  //       setDisabledNumber(false);
  //       // setDisabledCreditType(false);
  //       setDisabledStatus(false);
  //       setDisabledMovementType(true);
  //       setDisabledDiscountType(false);
  //       setDisabledDiscountValue(false);
  //     } else {
  //       let choises_type = InfonavitMovementype.filter(
  //         (item) => item.value > 1
  //       );
  //       setMovementTypes(choises_type);
  //       setDisabledStartDate(true);
  //       setDisabledNumber(true);
  //       // setDisabledCreditType(true);
  //       setDisabledStatus(false);
  //       setDisabledMovementType(true);
  //       setDisabledDiscountType(true);
  //       setDisabledDiscountValue(true);
  //     }
  //     setModalVisible(true);
  //   }
  // }, [updateInfonavit]);

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
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else message.error(messageError);
    }
  };



  const getInfo = async () => {
    try {
      let response = await WebApiPayroll.getUserCredits(person_id);
      let credit_config = response.data.find((elem) => elem.is_active);
      setIsNewRegister(false);
    } catch (error) {
      setIsNewRegister(true);
      console.log(error);
    } finally {
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



  return (
    <>
      <Spin tip="Cargando..." spinning={loadingIMSS}>
          <Divider orientation="left"> <img src={'/images/logo_imss.png'} width={20} style={{ marginBottom:0 }} /> IMSS</Divider>
        {
          !person.patronal_registration || !person.imss  ? 
          <Alert
            message="Información necesaria"
            description={<Text>Para continuar con el IMSS/Infonavit de la persona es necesario capturar su <Text strong >fecha de inicio laboral</Text> y registrar su <Text  strong >numero de seguiridad social</Text></Text>}
            type="info"
            showIcon
          /> :
            !updateCredit?.id &&  !updateCredit?.sdi ? 
            <Alert
            message="Información necesaria"
            description={<Text>Para continuar con el IMSS/Infonavit de la persona es necesario agregar el <Text strong >salario diario integrado</Text> a la nomina de la persona.</Text>}
            type="info"
            showIcon
          /> :
          <>
            <Form
              layout="vertical"
              form={formImssInfonavit}
              onFinish={formImmssInfonavitAct}
              className="form-details-person"
            >
              <Row>
              {
                updateCredit?.id &&
                <Col span={21} >
                  <Row justify="end" gutter={20}>
                    <Col style={{ paddingBottom:40}}>
                      <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            style={{ backgroundColor:'#9f0707 !important' }}
                            onClick={() =>
                                setShowModalDelete(true)
                            }
                        >
                          Eliminar información
                        </Button>
                      </Col>
                  </Row>
                </Col>
              }
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
                      // disabled={
                      //   updateCredit && updateCredit.is_registered ? true : false
                      // }
                      disabled={true}
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

          </>
        }
      </Spin>
    
    </>
  );
};

const mapState = (state) => {
  return {
    userInfo: state.userStore.user
  };
};


export default connect(mapState)(FormImssInfonavit);
