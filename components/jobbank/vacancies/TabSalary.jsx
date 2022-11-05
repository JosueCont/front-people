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
import {
  optionsPaymentPeriod,
  optionsEconomicBenefits
} from '../../../utils/constant';

const TabSalary = () => {
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
            options={optionsPaymentPeriod}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='economic_benefits'
          label='Prestaciones'
        >
          <Select
            placeholder='Seleccionar una prestación'
            notFoundContent='No se encontraron resultados'
            options={optionsEconomicBenefits}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='economic_benefits_description'
          label='Prestaciones descripción'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='Especifica las prestaciones'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='benefits'
          label='Beneficios'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='Transporte, servicio de comer, etc.'/>
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
          <Input placeholder='Uniformes, equipos de computo, etc.'/>
        </Form.Item>
      </Col>
    </Row>
  )
}

export default TabSalary