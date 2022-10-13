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

const TabEducation = ({ formTab }) => {

  return (
    // <Form form={formTab} layout='vertical'>
      <Row gutter={[24,0]}>
        <Col span={8}>
          <Form.Item name='category' label='Categoría de la vacante'>
            <Select
              placeholder='Categoría de la vacante'
              notFoundContent='No se encontraron resultados'
              options={[]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Subcategoría'>
            <Select
              placeholder='Subcategoría'
              notFoundContent='No se encontraron resultados'
              options={[]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Último grado de estudios'>
            <Select
              placeholder='Último grado de estudios'
              notFoundContent='No se encontraron resultados'
              options={[]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Estatus'>
            <Select
              placeholder='Estatus'
              notFoundContent='No se encontraron resultados'
              options={[]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Carrera'>
            <Input placeholder='Carrera'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Conocimientos requeridos'>
            <Input placeholder='Conocimientos requeridos'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Experiencia requerida'>
            <Input placeholder='Experiencia requerida'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Competencias requeridas'>
            <Select
              placeholder='Competencias requeridas'
              notFoundContent='No se encontraron resultados'
              options={[]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Habilidades técnicas'>
            <Input placeholder='Habilidades técnicas'/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='Idiomas'>
            <Select
              placeholder='Idiomas'
              notFoundContent='No se encontraron resultados'
              options={[]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='¿Para qué actividades lo utiliza?'>
            <Input placeholder='¿Para qué actividades lo utiliza?'/>
          </Form.Item>
        </Col>
      </Row>
    // </Form>
  )
}

export default TabEducation