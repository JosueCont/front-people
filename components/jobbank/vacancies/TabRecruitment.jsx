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

const TabRecruitment = ({ formTab }) => {
  return (
    // <Form form={formTab} layout='vertical'>
      <Row gutter={[24,0]}>
        <Col span={8}>
          <Form.Item label='Número de entrevistas'>
            <Input placeholder='Número de entrevistas'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='¿Quién(es) entrevista(n)?'>
            <Input placeholder='Nombre y posición'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Durante la entrevista'>
            <Input placeholder='¿Qué particularidad es importante observar?'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Motivos potenciales al rechaza'>
            <Input placeholder='Motivos potenciales al rechazo'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Observacione y comentarios adicionales'>
            <Input placeholder='Observaciones y comentarios adicionales'/>
          </Form.Item>
        </Col>
      </Row>
    // </Form>
  )
}

export default TabRecruitment