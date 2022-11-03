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
  ruleMaxAge
} from '../../../utils/rules';
import { validateNum } from '../../../utils/functions';
import {
  optionsSubproduct,
  optionsTypeJob,
  optionsTypeContract,
  optionsGenders
} from '../../../utils/constant';
import { useSelector } from 'react-redux';

const TabFeatures = ({
  showTurns,
  setShowTurns,
  disabledClient
}) => {

  const {
    load_clients_options,
    list_clients_options
  } = useSelector(state => state.jobBankStore);

  const styleDisabled = {
    width: 32,
    borderRight: 0,
    borderLeft: 0,
    pointerEvents: 'none',
    textAlign: 'center',
    background: '#ffff'
  }
  
  const ruleRangeAge = ({getFieldValue}, type) => ({
    validator(_, value){
      let intVal = parseInt(value);
      if( type == 'min'
        && intVal
        && intVal < 18
        || intVal > 100
      ) return Promise.reject('Edad mínima mayor o igual a 18');
      if(type == 'max'
        && intVal
        && intVal < 18
        || intVal > 100
      ) return Promise.reject('Edad máxima menor o igual a 70');
      // if(type == 'min'
      //   && intVal
      //   && !getFieldValue('age_max')
      // ) return Promise.reject('Edad máxima requerida');
      // if(type == 'max'
      //   && intVal
      //   && !getFieldValue('age_min')
      // ) return Promise.reject('Edad mínima requerida')
      return Promise.resolve();
    }
  })
  
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
          <Input placeholder='Producto'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='sub_product'
          label='Subproducto'
        >
          <Select
            placeholder='Seleccionar un subproducto'
            notFoundContent='No se encontraron resultados'
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
            placeholder='Número de proyecto'
            style={{
              width: '100%',
              border: '1px solid black'
            }}
            onKeyPress={validateNum}
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
          <Input placeholder='Nombre de la vacante'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='qty'
          label='Número de posiciones a reclutar'
        >
          <InputNumber
            type='number'
            controls={false}
            style={{
              width: '100%',
              border: '1px solid black'
            }}
            placeholder='Número de posiciones a reclutar'
            onKeyPress={validateNum}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='description'
          label='Descripción'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='Descripción'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='report_to'
          label='¿A quién reportar?'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='¿A quién reportar?'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='working_hours'
          label='Horario laboral'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='Horario laboral'/>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='type_job'
          label='Tipo de trabajo'
        >
          <Select
            placeholder='Tipo de trabajo'
            notFoundContent='No se encontraron resultados'
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
            placeholder='Tipo de contrato'
            notFoundContent='No se encontraron resultados'
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
              rules={[
                // ruleWhiteSpace,
                ruleMinAge(18)
              ]}>
              <InputNumber
                type='number'
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
          label='Sexo'
        >
          <Select
            placeholder='Sexo'
            notFoundContent='No se encontraron resultados'
            options={optionsGenders}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name='have_subordinates'
          label='¿Tendrá gente a su cargo?'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='Número y posiciones'/>
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
            <Checkbox onChange={e => setShowTurns(e.target.checked)}/>
          </Form.Item>
        </div>
        <Form.Item
          name='turns_to_rotate'
          rules={[ruleWhiteSpace]}
        >
          <Input placeholder='¿Cuáles?' disabled={!showTurns}/>
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