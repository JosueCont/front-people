import React, { useState, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Button,
  Checkbox,
  Switch,
  InputNumber
} from 'antd';
import {
  ruleRequired,
  ruleWhiteSpace,
  ruleMinAge,
  ruleMaxAge,
  onlyNumeric
} from '../../../utils/rules';
import { validateNum } from '../../../utils/functions';
import {
  optionsSubproduct,
  optionsTypeJob,
  optionsTypeContract,
  optionsGenders,
  optionsStatusVacant
} from '../../../utils/constant';
import { useSelector } from 'react-redux';

const TabFeatures = ({
  disabledClient,
  formVacancies
}) => {

  const {
    load_clients_options,
    list_clients_options
  } = useSelector(state => state.jobBankStore);
  const rotativeTurn = Form.useWatch('rotative_turn', formVacancies);

  const styleDisabled = {
    width: 32,
    borderRight: 0,
    borderLeft: 0,
    pointerEvents: 'none',
    textAlign: 'center',
    background: '#ffff'
  }

  const minAge = () => ({
    validator(_, value){
      let age = parseInt(value);
      if(age < 18) return Promise.reject('Edad mínima mayor o igual a 18');
      return Promise.resolve();
    }
  })

  const maxAge = () => ({
    validator(_, value){
      if(!value) return Promise.reject('Ingrese un valor numérico');
      let age = parseInt(value);
      if(age > 100) return Promise.reject('Edad máxima menor o igual a 100');
      return Promise.resolve();
    }
  })

  const onChangeTurn = ({ target: { checked } }) =>{
    formVacancies.setFieldsValue({
      turns_to_rotate: null
    })
  }
  
  return (
    <Row gutter={[24,0]}>
      <Col span={8}>
        <Form.Item
          name='customer_id'
          label='Cliente'
          rules={[ruleRequired]}
        >
          <Select
            allowClear
            showSearch
            disabled={disabledClient}
            loading={load_clients_options}
            placeholder='Seleccionar un cliente'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='children'
          >
            {list_clients_options.length > 0 && list_clients_options.map(item => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='assignment_date'
          label='Fecha de asignación'
        >
          <DatePicker
            style={{width: '100%'}}
            placeholder='Seleccionar fecha'
            format='YYYY-MM-DD'
            inputReadOnly
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='product'
          label='Producto'
          rules={[ruleWhiteSpace]}
        >
          <Input maxLength={100} placeholder='Ej. Search'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='sub_product'
          label='Subproducto'
        >
          <Select
            allowClear
            showSearch
            placeholder='Seleccionar un subproducto'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='label'
            options={optionsSubproduct}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='num_project'
          label='Número de proyecto'
        >
          <InputNumber
            type='number'
            controls={false}
            maxLength={10}
            placeholder='Número de proyecto'
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
          name='job_position'
          label='Nombre de la vacante'
          rules={[
            ruleRequired,
            ruleWhiteSpace
          ]}
        >
          <Input maxLength={100} placeholder='Nombre de la vacante'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='status'
          label='Estatus de la vacante'
        >
          <Select
            allowClear
            placeholder='Seleccionar un estatus'
            options={optionsStatusVacant}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='qty'
          label='Número de posiciones a reclutar'
          rules={[onlyNumeric]}
        >
          <InputNumber
            type='number'
            controls={false}
            maxLength={10}
            placeholder='Número de posiciones a reclutar'
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
          name='description'
          label='Descripción de la vacante'
          rules={[ruleWhiteSpace]}
        >
          <Input maxLength={200} placeholder='Descripción de la vacante'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='report_to'
          label='¿A quién reportar?'
          rules={[ruleWhiteSpace]}
        >
          <Input maxLength={100} placeholder='Ej. Jefa de área, Gerente de operaciones, etc.'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='working_hours'
          label='Horario laboral'
          rules={[ruleWhiteSpace]}
        >
          <Input maxLength={100} placeholder='Ej. L-V 9:30 AM - 6:00 PM y Sábados de 9:00 AM - 1:00 PM'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='type_job'
          label='Tipo de trabajo'
        >
          <Select
            allowClear
            showSearch
            placeholder='Seleccionar un tipo'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='label'
            options={optionsTypeJob}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='type_of_contract'
          label='Tipo de contrato'
        >
          <Select
            allowClear
            showSearch
            placeholder='Seleccionar un tipo'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='label'
            options={optionsTypeContract}
          />
        </Form.Item>
      </Col>
      {/* <Col span={8}>
        <Form.Item label='Lugar de trabajo'>
          <Select
            placeholder='Lugar de trabajo'
            notFoundContent='No se encontraron resultados'
            options={[]}
          />
        </Form.Item>
      </Col> */}
      <Col span={8} className='range_age_content'>
        <Form.Item
          name='age_range'
          label='Rango de edad'
        >
          <Input.Group compact>
            <Form.Item
              name='age_min'
              noStyle
              rules={[ruleMinAge(18)]}
            >
              <InputNumber
                type='number'
                maxLength={2}
                controls={false}
                className='min_age'
                onKeyPress={validateNum}
                placeholder='Edad mínima'
              />
            </Form.Item>
            <Input
              style={styleDisabled}
              placeholder='-'
              disabled
            />
            <Form.Item
              name='age_max'
              noStyle
              rules={[
                ruleMaxAge(100)
              ]}
            >
              <InputNumber
                type='number'
                maxLength={2}
                controls={false}
                className='max_age'
                onKeyPress={validateNum}
                placeholder='Edad máxima'
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='gender'
          label='Género'
        >
          <Select
            allowClear
            showSearch
            placeholder='Seleccionar un género'
            notFoundContent='No se encontraron resultados'
            optionFilterProp='label'
            options={optionsGenders}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='have_subordinates'
          label='¿Cuántas personas tendrá a su cargo?'
          rules={[ruleWhiteSpace]}
        >
          <Input maxLength={100} placeholder='Ej. 1 - Puesto del subordinado'/>
        </Form.Item>
      </Col>
      <Col span={8} className='turn_rotative_content'>
        <div className='turn_rotative'>
          <label>¿Rola turnos?</label>
          <Form.Item
            name='rotative_turn'
            valuePropName='checked'
            style={{marginBottom: 0}}
          >
            <Checkbox onChange={onChangeTurn}/>
          </Form.Item>
        </div>
        <Form.Item
          name='turns_to_rotate'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='¿Cuáles?' disabled={!rotativeTurn}/>
        </Form.Item>
      </Col>
      <Col span={8} style={{display: 'flex'}}>
        <div className='turn_rotative'>
          <Form.Item
            name='requires_travel_availability'
            valuePropName='checked'
            noStyle
          >
            <Checkbox/>
          </Form.Item>
          <label>¿Disponibilidad para viajar?</label>
          <Form.Item
            name='vo_bo'
            valuePropName='checked'
            noStyle
          >
            <Checkbox/>
          </Form.Item>
          <label>Visto bueno</label>
        </div>
      </Col>
    </Row>
  )
}

export default TabFeatures;