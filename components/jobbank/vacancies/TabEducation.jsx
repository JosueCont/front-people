import React, { useEffect, useState } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select
} from 'antd';
import { useSelector } from 'react-redux';
import {
  ruleRequired,
  ruleWhiteSpace
} from '../../../utils/rules';
import {
  optionsLevelAcademic,
  optionsStatusVacant,
  optionsLangVacant
} from '../../../utils/constant';

const TabEducation = () => {

  const {
    load_competences,
    list_competences,
    load_academics,
    list_academics,
    load_main_categories,
    list_main_categories,
    load_sub_categories,
    list_sub_categories
  } = useSelector(state => state.jobBankStore);

  return (
    <Row gutter={[24,0]}>
      <Col span={8}>
        <Form.Item
          name='main_category'
          label='Categoría de la vacante'
        >
          <Select
            placeholder='Categoría de la vacante'
            notFoundContent='No se encontraron resultados'
            disabled={load_main_categories}
            loading={load_main_categories}
          >
            {list_main_categories?.length > 0 && list_main_categories.map(item => (
              <Select.Option value={item.id} key={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='sub_category'
          label='Subcategoría'
        >
          <Select
            placeholder='Subcategoría'
            notFoundContent='No se encontraron resultados'
            disabled={load_sub_categories}
            loading={load_sub_categories}
          >
            {list_sub_categories.length > 0 && list_sub_categories.map(item=> (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='study_level'
          label='Último grado de estudios'
        >
          <Select
            placeholder='Último grado de estudios'
            notFoundContent='No se encontraron resultados'
            options={optionsLevelAcademic}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='status_level_study'
          label='Estatus'
        >
          <Select
            placeholder='Estatus'
            notFoundContent='No se encontraron resultados'
            options={optionsStatusVacant}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name='academics_degree' label='Carrera'>
          <Select
            disabled={load_academics}
            loading={load_academics}
            placeholder='Carrera'
            notFoundContent='No se encontraron resultados'
          >
            {list_academics.length > 0 && list_academics.map(item => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='knowledge'
          label='Conocimientos requeridos'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='Conocimientos requeridos'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='competences'
          label='Competencias requeridas'
        >
          <Select
            mode='multiple'
            maxTagCount={2}
            disabled={load_competences}
            loading={load_competences}
            placeholder='Competencias requeridas'
            notFoundContent='No se encontraron resultados'
          >
            {list_competences.length > 0 && list_competences.map(item => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='languajes'
          label='Idiomas'
        >
          <Select
            mode='multiple'
            maxTagCount={2}
            placeholder='Idiomas'
            notFoundContent='No se encontraron resultados'
            options={optionsLangVacant}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='language_activities'
          label='¿Para qué actividades lo utiliza?'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='¿Para qué actividades lo utiliza?'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='experiences'
          label='Experiencia requerida'
          extra='Separar cada experiencia con una coma'
          rules={[ruleWhiteSpace]}
        >
          <Input.TextArea
            placeholder='Experiencia requerida'
            autoSize={{
              minRows: 5,
              maxRows: 5,
            }}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='technical_skills'
          label='Habilidades técnicas'
          extra='Separar cada habilidad técnica con una coma'
          rules={[ruleWhiteSpace]}
        >
          <Input.TextArea
            placeholder='Habilidades técnicas'
            autoSize={{
              minRows: 5,
              maxRows: 5,
            }}
          />
        </Form.Item>
      </Col>
    </Row>
  )
}

export default TabEducation