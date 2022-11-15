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
  optionsStatusAcademic,
  optionsLangVacant
} from '../../../utils/constant';

const TabEducation = ({ formVacancies }) => {

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
  const categorySelected = Form.useWatch('main_category', formVacancies);

  const onChangeCategory = (value) =>{
    formVacancies.setFieldsValue({
      sub_category: null
    })
  }

  const optionsByCategory = () =>{
    if(!categorySelected) return [];
    const options = item => item.category === categorySelected;
    return list_sub_categories.filter(options);
  }

  return (
    <Row gutter={[24,0]}>
      <Col xs={24} md={12} xl={8} xxl={6}>
        <Form.Item
          name='main_category'
          label='Categoría de la vacante'
        >
          <Select
            allowClear
            showSearch
            placeholder='Seleccionar una categoría'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='children'
            disabled={load_main_categories}
            loading={load_main_categories}
            onChange={onChangeCategory}
          >
            {list_main_categories?.length > 0 && list_main_categories.map(item => (
              <Select.Option value={item.id} key={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} xl={8} xxl={6}>
        <Form.Item
          name='sub_category'
          label='Subcategoría'
        >
          <Select
            allowClear
            showSearch
            placeholder='Seleccionar una subcategoría'
            notFoundContent='No se encontraron resultados'
            disabled={optionsByCategory().length <= 0}
            loading={load_sub_categories}
            optionFilterProp='children'
          >
            {optionsByCategory().map(item=> (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} xl={8} xxl={6}>
        <Form.Item
          name='study_level'
          label='Último grado de estudios'
        >
          <Select
            allowClear
            showSearch
            placeholder='Seleccionar un grado'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='label'
            options={optionsLevelAcademic}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12} xl={8} xxl={6}>
        <Form.Item name='academics_degree' label='Carrera'>
          <Select
            allowClear
            showSearch
            disabled={load_academics}
            loading={load_academics}
            optionFilterProp='children'
            placeholder='Seleccionar una carrera'
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
      <Col xs={24} md={12} xl={8} xxl={6}>
        <Form.Item
          name='status_level_study'
          label='Estatus de la carrera'
        >
          <Select
            allowClear
            showSearch
            placeholder='Seleccionar un estatus'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='label'
            options={optionsStatusAcademic}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12} xl={8} xxl={6}>
        <Form.Item
          name='competences'
          label='Competencias requeridas'
        >
          <Select
            mode='multiple'
            maxTagCount={1}
            disabled={load_competences}
            loading={load_competences}
            placeholder='Seleccionar las competencias'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='children'
          >
            {list_competences.length > 0 && list_competences.map(item => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} xl={8} xxl={6}>
        <Form.Item
          name='languajes'
          label='Idiomas'
        >
          <Select
            mode='multiple'
            maxTagCount={2}
            placeholder='Seleccionar los idiomas'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='label'
            options={optionsLangVacant}
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Row gutter={[24,0]}>
          <Col xs={24} md={12} xl={8} xxl={6}>
            <Form.Item
              name='language_activities'
              label='¿Para qué actividades lo utiliza?'
              rules={[ruleWhiteSpace]}
            >
              <Input.TextArea
                maxLength={400}
                placeholder='Especificar según los idiomas seleccionados'
                autoSize={{
                  minRows: 5,
                  maxRows: 5,
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8} xxl={6}>
            <Form.Item
              name='knowledge'
              label='Conocimientos requeridos'
              rules={[ruleWhiteSpace]}
            >
              <Input.TextArea
                maxLength={400}
                placeholder='Ej. Amplios conocimientos en canal Food Services'
                autoSize={{
                  minRows: 5,
                  maxRows: 5,
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8} xxl={6}>
            <Form.Item
              name='experiences'
              label='Experiencia requerida'
              rules={[ruleWhiteSpace]}
            >
              <Input.TextArea
                placeholder='Separar cada experiencia con una coma'
                autoSize={{
                  minRows: 5,
                  maxRows: 5,
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} xl={8} xxl={6}>
            <Form.Item
              name='technical_skills'
              label='Habilidades técnicas'
              rules={[ruleWhiteSpace]}
            >
              <Input.TextArea
                placeholder='Separar cada habilidad técnica con una coma'
                autoSize={{
                  minRows: 5,
                  maxRows: 5,
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default TabEducation