import React, { useState, useEffect, useMemo } from "react";
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
} from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import {
  typeEmployee,
  typeSalary,
  reduceDays,
  messageError,
} from "../../../utils/constant";
import SelectFamilyMedicalUnit from "../../selects/SelectFamilyMedicalUnit";
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
import { Global, css } from "@emotion/core";

const InfonavitMovementype = [
  { value: 1, label: "Inicio Descuento" },
  { value: 2, label: "Suspensión Descuento" },
  { value: 3, label: "Modificación Tipo Descuento" },
  { value: 4, label: "Modificación Valor Descuento" },
  { value: 5, label: "Modificación de Número de Crédito" },
];

const FormImssInfonavit = ({ person, person_id = null, userInfo=null, refreshtab=false, node, ...props }) => {
  const {patronal_registration, imss} = person; 
  const { Title, Text} = Typography;
  const [formImssInfonavit] = Form.useForm();
  const [loadingIMSS, setLodingIMSS] = useState(false);
  const [updateCredit, setUpdateCredit] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isNewRegister, setIsNewRegister] = useState(false);

  // const daily_salary = Form.useWatch("sd", formImssInfonavit);


  useEffect(() => {
    person_id && localUserCredit() && getInfo();
  }, [person_id]);

  useEffect(()=>{
    localUserCredit(); 
  },[])

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


  useEffect(()=>{
    if(refreshtab){
      localUserCredit()
      props.onFinishRefresh()
    }
  },[refreshtab])


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

  const renderComponent = useMemo(()=>{
    if(!patronal_registration || !imss) return(
      <Alert
        message="Información necesaria"
        description={<Text>Para continuar con el IMSS/Infonavit de la persona es necesario capturar su <Text strong >fecha de inicio laboral</Text> y registrar su <Text  strong >numero de seguiridad social</Text></Text>}
        type="info"
        showIcon
      />)
    if( !updateCredit?.id &&  !updateCredit?.sdi) return (
      <Alert
        message="Información necesaria"
        description={<Text>Para continuar con el IMSS/Infonavit de la persona es necesario agregar el <Text strong >salario diario integrado</Text> a la nomina de la persona.</Text>}
        type="info"
        showIcon
      />
    )
    else{
      return(
        <>
            <Form
              layout="vertical"
              form={formImssInfonavit}
              onFinish={formImmssInfonavitAct}
              className="form-details-person"
            >
              <Row gutter={20}>
                <Col className="alignFieldVertically" lg={8} xs={22} md={12} >
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
                <Col className="alignFieldVertically" lg={8} xs={22} md={12} >
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
                <Col className="alignFieldVertically" lg={8} xs={22} md={12} >
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
                <Col className="alignFieldVertically" lg={8} xs={22} md={12} >
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
                <Col className="alignFieldVertically" lg={8} xs={22} md={12} >
                  <SelectFamilyMedicalUnit />
                </Col>
                <Col className="alignFieldVertically" lg={8} xs={22} md={12} >
                  <Form.Item
                    name="nss"
                    label="IMSS"
                    rules={[onlyNumeric, minLengthNumber]}
                  >
                    <Input maxLength={11} disabled={true} />
                  </Form.Item>
                </Col>

                 


                <Col className="alignFieldVertically" lg={8} xs={22} md={12} >

                  <Link href={`/payroll/imssMovements/?regPatronal=${patronal_registration}`}>
                    <a style={{color:'blue'}}>
                      <div>Ver movimientos IMSS</div>
                    </a>
                  </Link>
                </Col>
              </Row>
              <Row justify={"end"}>
               <Form.Item
                    name="sdi"
                    maxLength={13}
                    rules={[fourDecimal, ruleRequired]}
                  >
                    <Input
                      // disabled={
                      //   updateCredit && updateCredit.is_registered ? true : false
                      // }
                      hidden
                      disabled={true}
                      maxLength={10}
                    />
                  </Form.Item>
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
          )
    }
    

  },[patronal_registration , imss, updateCredit, updateCredit?.id, updateCredit?.sdi, loadingIMSS])



  return (
    <>
    <Global
    styles={css`
    .alignFieldVertically:{
      display:flex; 
      align-items:flex-end; 
    }
    `}
    />
      <Spin tip="Cargando..." spinning={loadingIMSS}>
          <Divider orientation="left"> <img src={'/images/logo_imss.png'} width={20} style={{ marginBottom:0, backgroundColor:'transparent', borderTopColor:'transparent' }} /> IMSS</Divider>
        {renderComponent}
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
