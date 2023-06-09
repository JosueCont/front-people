import React, { useState, useEffect } from 'react';
import {
    Form,
    Row,
    Col,
    Input,
    Select,
    DatePicker,
    Checkbox,
    InputNumber
} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace,
} from '../../../utils/rules';
import { validateNum, validateMaxLength } from '../../../utils/functions';
import {
    optionsSubproduct,
    optionsTypeJob,
    optionsTypeContract,
    optionsGenders,
    optionsStatusVacant
} from '../../../utils/constant';
import { useSelector } from 'react-redux';
import moment from 'moment';
import RangeAge from '../RangeAge';

const TabFeatures = ({
    formVacancies,
    hasEstrategy,
    disabledClient
}) => {

    const {
        load_states,
        list_states,
        load_clients_options,
        list_clients_options,
    } = useSelector(state => state.jobBankStore);
    const rotativeTurn = Form.useWatch('rotative_turn', formVacancies);
    const idState = Form.useWatch('location_id', formVacancies);

    const onChangeTurn = ({ target: { checked } }) => {
        formVacancies.setFieldsValue({
            turns_to_rotate: null
        })
    }

    const onChangeState = (value) =>{
        formVacancies.setFieldsValue({
            municipality: null
        })
    }

    const disabledDate = (current) => {
        return current && current < moment().startOf("day");
    }

    return (
        <Row gutter={[24, 0]}>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='customer_id'
                    label='Cliente'
                    tooltip={hasEstrategy
                        ? `Este campo no es posible actualizarlo,
                            ya que la vacante se en encuentra asociada a una estrategia.
                            ` : ''}
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_clients_options || hasEstrategy || disabledClient}
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
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='assignment_date'
                    label='Fecha de asignación'
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder='Seleccionar fecha'
                        format='DD-MM-YYYY'
                        disabledDate={disabledDate}
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='product'
                    label='Producto'
                    rules={[ruleWhiteSpace]}
                >
                    <Input maxLength={100} placeholder='Ej. Search' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
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
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='num_project'
                    label='Número de proyecto'
                >
                    <Input maxLength={100} placeholder='Número de proyecto' />
                    {/* <InputNumber
                        type='number'
                        controls={false}
                        maxLength={9}
                        max={2147483647}
                        placeholder='Número de proyecto'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        onPaste={validateNum}
                        style={{
                        width: '100%',
                        border: '1px solid black'
                        }}
                    /> */}
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='job_position'
                    label='Nombre de la vacante'
                    rules={[
                        ruleRequired,
                        ruleWhiteSpace
                    ]}
                >
                    <Input maxLength={100} placeholder='Nombre de la vacante' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='status'
                    label='Estatus de la vacante'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        placeholder='Seleccionar un estatus'
                        options={optionsStatusVacant}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='qty'
                    label='Número de posiciones a reclutar'
                    rules={[
                        ruleRequired,
                        { type: 'number', min: 1, message: 'Ingrese un valor mayor o igual a 1' },
                        { type: 'number', max: 2147483647, message: 'Ingrese un valor menor o igual a 2147483647' }
                    ]}
                >
                    <InputNumber
                        type='number'
                        controls={false}
                        maxLength={10}
                        // min={1}
                        // max={2147483647}
                        placeholder='Número de posiciones a reclutar'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        onPaste={validateNum}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='location_id'
                    label='Estado'
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar un opción'
                        notFoundContent='No se encontraron resultados'
                        disabled={load_states}
                        loading={load_states}
                        optionFilterProp='children'
                        onChange={onChangeState}
                    >
                        {list_states?.length > 0 && list_states.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='municipality'
                    label='Municipio'
                    rules={[ruleWhiteSpace]}
                >
                    <Input
                        disabled={!idState}
                        maxLength={100}
                        placeholder='Especificar el municipio'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='report_to'
                    label='¿A quién reportar?'
                    rules={[ruleWhiteSpace]}
                >
                    <Input maxLength={100} placeholder='Ej. Jefa de área, Gerente de operaciones, etc.' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='working_hours'
                    label='Horario laboral'
                    rules={[ruleWhiteSpace]}
                >
                    <Input maxLength={100} placeholder='Ej. L-V 9:30 AM - 6:00 PM y Sábados de 9:00 AM - 1:00 PM' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
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
            <Col xs={24} md={12} xl={8} xxl={6}>
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
            {/* <Col xs={24} md={12} xl={8} xxl={6}>
        <Form.Item label='Lugar de trabajo'>
          <Select
            placeholder='Lugar de trabajo'
            notFoundContent='No se encontraron resultados'
            options={[]}
          />
        </Form.Item>
      </Col> */}
            <RangeAge />
            <Col xs={24} md={12} xl={8} xxl={6}>
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
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='have_subordinates'
                    label='¿Cuántas personas tendrá a su cargo?'
                    rules={[ruleWhiteSpace]}
                >
                    <Input maxLength={100} placeholder='Ej. 1 - Puesto del subordinado' />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6} className='turn_rotative_content'>
                <div className='turn_rotative'>
                    <label>¿Rola turnos?</label>
                    <Form.Item
                        name='rotative_turn'
                        valuePropName='checked'
                        style={{ marginBottom: 0 }}
                    >
                        <Checkbox onChange={onChangeTurn} />
                    </Form.Item>
                </div>
                <Form.Item
                    name='turns_to_rotate'
                    rules={[ruleWhiteSpace]}
                >
                    <Input placeholder='¿Cuáles?' disabled={!rotativeTurn} />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    label='¿Disponibilidad para viajar?'
                    name='requires_travel_availability'
                >
                    <Select
                        // allowClear
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                    >
                        <Select.Option value={true} key={true}>Sí</Select.Option>
                        <Select.Option value={false} key={false}>No</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
            {/* <Col xs={24} md={12} xl={8} xxl={6} style={{display: 'flex'}}>
        <div className='turn_rotative'>
          <Form.Item
            name='vo_bo'
            valuePropName='checked'
            noStyle
          >
            <Checkbox/>
          </Form.Item>
          <label>Visto bueno</label>
        </div>
      </Col> */}
            <Col span={24}>
                <Form.Item
                    name='description'
                    label='Descripción de la vacante'
                // rules={[ruleWhiteSpace]}
                >
                    <Input.TextArea
                        autoSize={{ minRows: 5, maxRows: 5 }}
                        placeholder='Descripción de la vacante'
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default TabFeatures;