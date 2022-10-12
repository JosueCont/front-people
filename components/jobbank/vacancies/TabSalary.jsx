import React from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Button
} from 'antd';

const TabSalary = ({ formTab }) => {

  return (
    // <Form form={formTab} layout='vertical'>
      <Row gutter={[24,0]}>
        <Col span={8}>
          <Form.Item label='Sueldo mensual bruto'>
            <Input placeholder='Sueldo mensual bruto'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Periodo de pago'>
            <Select
              placeholder='Periodo de pago'
              notFoundContent='No se encontraron resultados'
              options={[]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Prestaciones'>
            <Input placeholder='Prestaciones'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Beneficios'>
            <Input placeholder='Beneficios'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Bonos'>
            <Input placeholder='Bonos'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Herramientas de trabajo'>
            <Input placeholder='Herramientas de trabajo'/>
          </Form.Item>
        </Col>
      </Row>
    // </Form>
  )
}

export default TabSalary