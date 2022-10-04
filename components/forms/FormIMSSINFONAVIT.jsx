import React, { useState, useEffect } from 'react'
import { Spin, Button, Row, Col, Typography, Table, Modal, Form, Input, Select, DatePicker } from "antd";
import locale from 'antd/lib/date-picker/locale/es_ES';
import { typeEmployee, typeSalary, reduceDays } from '../../utils/constant';
import SelectMedicineUnity from '../selects/SelectMedicineUnity';
import WebApiPayroll from '../../api/WebApiPayroll';


const FormIMSSINFONAVIT = ({ person_id, node }) => {
  
  const { Title } = Typography;
  const [ formImssInfonavit ] = Form.useForm()

  useEffect(() => {
    person_id && userCredit()
  },[person_id])

  const userCredit = async () => {
    WebApiPayroll.medicineUnitys(person_id)
    .then((response) => {
      console.log('Response', response)
    })
    .catch((error) => {
      console.log('Error', error)
    })
  }

  return (
    <>
      <Row>
        <Title style={{ fontSize: "20px" }}>IMSS / INFONAVIT</Title>
      </Row>
      <Form
        layout='vertical'
        form={formImssInfonavit}
      >
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="employee_type" label="Tipo de empleado">
              <Select 
                options={ typeEmployee }
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="salary_type" label="Tipo de salario">
              <Select 
                options={ typeSalary }
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="reduce_days" label="Semana o jornada reducida">
              <Select 
                options={ reduceDays }
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="movement_date" label="Fecha de movimiento">
              <DatePicker
                locale={ locale }
                format = "DD-MM-YYYY"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <SelectMedicineUnity />
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default FormIMSSINFONAVIT