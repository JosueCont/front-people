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
} from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import {typeEmployee, typeSalary, reduceDays, FACTOR_SDI} from "../../../utils/constant";
import SelectFamilyMedicalUnit from "../../selects/SelectFamilyMedicalUnit";
import { EditOutlined,} from "@ant-design/icons";
import SelectMedicineUnity from "../../selects/SelectMedicineUnity";
import WebApiPayroll from "../../../api/WebApiPayroll";
import moment from "moment";
import {fourDecimal, minLengthNumber, onlyNumeric, ruleRequired} from "../../../utils/rules";

const FormImssInfonavit = ({ person, person_id, node }) => {
  
  const { Title } = Typography;
  const [formImssInfonavit] = Form.useForm();
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingIMSS, setLodingIMSS] = useState(false);
  const [infonavitCredit, setInfonavitCredit] = useState([]);
  const [ updateCredit, setUpdateCredit ] = useState(null)
  const [ isEdit, setIsEdit ] = useState(false)
  const daily_salary = Form.useWatch('sbc', formImssInfonavit);
  //const [integratedDailySalary, setIntegratedDailySalary] = useState(0);

  useEffect(() => {
    person_id && localUserCredit();
  }, [person_id]);

  useEffect(() =>{
    if (updateCredit) {
      setIsEdit(true)
      formImssInfonavit.setFieldsValue({
        employee_type: updateCredit.employee_type,
        salary_type: updateCredit.salary_type,
        reduce_days: updateCredit.reduce_days,
        movement_date: moment(updateCredit.movement_date),
        family_medical_unit: updateCredit.family_medical_unit.id,
        nss: updateCredit.nss,
        sbc: updateCredit.sbc

      })
    } else {
        formImssInfonavit.setFieldsValue({
          nss: person.imss
        })
    }
    // if(person.imss){
    //   formImssInfonavit.setFieldsValue({
    //     nss: person.imss
    //   })
    // }
  },[updateCredit])

  console.log('Person', person)

  useEffect(()=>{
    console.log(daily_salary)
    if(daily_salary){
      formImssInfonavit.setFieldsValue({
          integrated_daily_salary:(daily_salary*FACTOR_SDI).toFixed(2)
        })
    }else{
      formImssInfonavit.setFieldsValue({
        integrated_daily_salary:0
      })
    }
  },[daily_salary])

  const formImmssInfonavitAct = (values) => {
    setLoadingTable(true)

    values.person = person_id
    values.movement_date = values.movement_date ? moment(values.movement_date).format('YYYY-MM-DD') : ""
    // values.is_active = true
    // values.is_registered = true
    values.modify_by = "System"
    values.patronal_registration = person?.branch_node? person.branch_node.patronal_registration.id    : ""
    console.log("Data", values);
    // funcion WEB API

    if(isEdit){

      console.log('Entro al Editar')

      WebApiPayroll.editIMSSInfonavit(updateCredit.id, values)
      .then((response) => {
        console.log('Response', response)
        message.success('Editado exitosamente')
        setLoadingTable(false)
        setIsEdit(false)  
      })
      .catch((error) => {
        console.log('Error -->', error)
        message.error('Error al editar')
        setLoadingTable(false)
      })

    } else {

      console.log('Entro al registrar')

      WebApiPayroll.saveIMSSInfonavit(values)
      .then((response) => {
        console.log('Response', response)
        message.success('Guardado exitosamente')
        setLoadingTable(false)
      })
      .catch((error) => {
        console.log('Error -->', error.message)
        message.error('Error al guardar')
        setLoadingTable(false)
      })
    }

    // setLodingIMSS(false)
  };

  const userCredit = async () => {
    
    setLoadingTable(true);
    let data = new FormData()
    let patronal_registration = person?.branch_node?.patronal_registration?.id
    
    data.append("node", node)
    data.append("person", person_id)
    data.append("patronal_registration", patronal_registration)

    WebApiPayroll.getInfonavitCredit(data)
      .then((response) => {
        setLoadingTable(false);
        response.data && setInfonavitCredit([response.data.infonavit_credit]);
      })
      .catch((error) => {
        setLoadingTable(false);
        console.log("Error", error);
      });
  };

  const localUserCredit = async () => {
    setLoadingTable(true)
    try {
      let response = await WebApiPayroll.getPersonalCredits(person_id)
      setUpdateCredit(response.data)
      setInfonavitCredit([response.data])
    } catch (error) {
      console.log('Error', error)
    } finally {
      setLoadingTable(false)
    }
  }

  const updateImssInfonavit = (item) => {
    setIsEdit(true)
    setUpdateCredit(item)
  }

  updateCredit && console.log('Credit', updateCredit)

  const colCredit = [
    {
      title: "Número",
      dataIndex: "number",
      key: "number",
      width: 100,
    },
    {
      title: "Tipo de crédito",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "Fecha de inicio",
      dataIndex: "start_date",
      key: "start_date",
      width: 100,
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
      width: 100,
    },
    {
      title: "Monto",
      dataIndex: "amount_payment",
      key: "amount_payment",
      width: 100,
    },
    {
      title: "Monto actual",
      dataIndex: "current_payment",
      key: "current_payment",
      width: 100,
    },
    {
      title: "Numero de pago",
      dataIndex: "number_payment",
      key: "number_payment",
      width: 100,
    },
    {
      title: "Ultima fecha de pago",
      dataIndex: "date_last_payment",
      key: "date_last_payment",
      width: 100,
    },
    {
      title: "Monto total",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 100,
    },
    // {
    //   title: "Opciones",
    //   render: (item) => {
    //     return (
    //       <div>
    //         <Row gutter={16}>
    //           <Col className="gutter-row" offset={1}>
    //             <EditOutlined
    //               style={{ fontSize: "20px" }}
    //               onClick={() => updateImssInfonavit(item)}
    //             />
    //           </Col>
    //           {/* <Col className="gutter-row" offset={1}>
    //             <DeleteOutlined
    //               style={{ fontSize: "20px" }}
    //               onClick={() => {
    //                 showModalDelete(item.id);
    //               }}
    //             />
    //           </Col> */}
    //         </Row>
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <Spin tip="Cargando..."  spinning={loadingTable}>
      <Row>
        <Title style={{ fontSize: "20px" }}>IMSS</Title>
      </Row>
      <Form
        layout="vertical"
        form={formImssInfonavit}
        onFinish={formImmssInfonavitAct}
      >
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="employee_type"
              label="Tipo de empleado"
              rules={[ruleRequired]}
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
                rules={[ruleRequired, onlyNumeric, minLengthNumber]}
            >
              <Input maxLength={11} />
            </Form.Item>
          </Col>

          <Col lg={6} xs={22} offset={1}>
            <Form.Item
                name="sbc"
                label="Salario diario"
                maxLength={13}
                rules={[fourDecimal, ruleRequired]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
                name="integrated_daily_salary"
                label="Salario diario integrado"
                maxLength={13}
                rules={[fourDecimal]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"end"}>
          {
            updateCredit && updateCredit.id? null : (
              <Form.Item>
              <Button 
                loading={loadingIMSS} 
                style = {{ marginRight: 20 }}
                type="primary" 
                htmlType="submit"
                disabled = { updateCredit && updateCredit.id? true : false }
              >
                Guardar
              </Button>
              </Form.Item>
            )
          }


          {/* <Form.Item>
            <Button 
              loading={loadingIMSS} 
              type="primary" 
              onClick={ () => userCredit() }
              // disabled = { updateCredit && updateCredit.is_registered? true : false }
            >
              sincronizar
            </Button>
          </Form.Item> */}
        </Row>
      </Form>

      {/* <Spin tip="Cargando..." spinning={loadingTable}>
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
      </Spin> */}
    </Spin>
  );
};

export default FormImssInfonavit;
