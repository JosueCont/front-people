import React from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  InputNumber
} from 'antd';
import { validateNum } from '../../../utils/functions';
import {
  ruleRequired,
  ruleWhiteSpace
} from '../../../utils/rules';

const TabSalary = () => {

  const optionsPeriod = [
    {value: 1, key: 1, label: 'Diario'},
    {value: 2, key: 2, label: 'Semanal'},
    {value: 3, key: 3, label: 'Quincenal'},
    {value: 4, key: 4, label: 'Mensual'},
  ]

  return (
    <Row gutter={[24,0]}>
      <Col span={8}>
        <Form.Item
          name='gross_salary'
          label='Sueldo mensual bruto'
          rules={[ruleWhiteSpace]}
        >
          <Input
            placeholder='Sueldo mensual bruto'
            onKeyPress={validateNum}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='payment_period'
          label='Periodo de pago'
        >
          <Select
            placeholder='Periodo de pago'
            notFoundContent='No se encontraron resultados'
            options={optionsPeriod}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='economic_benefits'
          label='Prestaciones'
        >
          <InputNumber
            type='number'
            controls={false}
            placeholder='Prestaciones'
            onKeyPress={validateNum}
            style={{
              width: '100%',
              border: '1px solid black'
            }}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='economic_benefits_description'
          label='Prestaciones descripción'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='Prestaciones descripción'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='benefits'
          label='Beneficios'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='Beneficios'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='rewards'
          label='Bonos'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='Bonos'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='work_tools'
          label='Herramientas de trabajo'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='Herramientas de trabajo'/>
        </Form.Item>
      </Col>
    </Row>
  )
}

export default TabSalary