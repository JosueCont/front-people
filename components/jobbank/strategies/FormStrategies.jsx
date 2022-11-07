import React, { useEffect, useState } from 'react';
import {
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    Select,
    InputNumber
} from 'antd';
import {
    optionsSubproduct,
    optionsTypeSale,
    optionsStatusVacant,
    optionsJobBank
} from '../../../utils/constant';
import { validateNum } from '../../../utils/functions';
import { useSelector } from 'react-redux';
import { getFullName } from '../../../utils/functions';
import { ruleRequired, ruleWhiteSpace, numCommaAndDot } from '../../../utils/rules';

const FormStrategies = ({ formStrategies }) => {

    const {
        load_clients_options,
        load_vacancies_options,
        list_clients_options,
        list_vacancies_options
    } = useSelector(state => state.jobBankStore);
    const {
        load_persons,
        persons_company
    } = useSelector(state => state.userStore);
    const clientSelected = Form.useWatch('customer', formStrategies);
    const salary = Form.useWatch('salary', formStrategies);
    const percent = Form.useWatch('percentage_to_collect', formStrategies);

    useEffect(()=>{
        getAmount()
    },[salary, percent])

    const getAmount = () =>{
        try {
            let objReset = { amount_to_collect: null };
            const setVal = (obj) => formStrategies.setFieldsValue(obj);
            let validation = !salary || !percent; 
            if(validation) return setVal(objReset);
            let salary_ = parseFloat(salary.replace(',',''));
            let amount = (salary_/100) * percent;
            let formatAmount = amount.toLocaleString("es-MX", {maximumFractionDigits: 4});
            let objSet = { amount_to_collect: formatAmount };
            setVal(objSet);
        } catch (e) {
            console.log(e)
        }
    }

    const onChangeClient = (value) =>{
        formStrategies.setFieldsValue({vacant: null})
    }
    
    const optionsByClient = () =>{
        if(!clientSelected) return [];
        const options = item => item.customer?.id === clientSelected;
        return list_vacancies_options.filter(options);
    }

    return (
        <Row gutter={[24,0]}>
            <Col span={6}>
                <Form.Item
                    name='assignment_date'
                    label='Fecha de asignación'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Seleccionar una fecha'
                        format='YYYY-MM-DD'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='recruiter'
                    label='Reclutador'
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_persons}
                        loading={load_persons}
                        placeholder='Seleccionar un reclutador'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {persons_company.length > 0 && persons_company.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {getFullName(item)}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='product'
                    label='Producto'
                    rules={[ruleWhiteSpace, ruleRequired]}
                >
                    <Input maxLength={100} placeholder='Ej. Search'/>
                </Form.Item>
            </Col>
            <Col span={6}>
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
            <Col span={6}>
                <Form.Item
                    name='sale_type'
                    label='Tipo de venta'
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar un tipo'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsTypeSale}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='business_executive'
                    label='Ejecutivo comercial'
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_persons}
                        loading={load_persons}
                        placeholder='Seleccionar un ejecutivo'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {persons_company.length > 0 && persons_company.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {getFullName(item)}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='num_project'
                    label='Número de proyecto'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Número de proyecto'
                        onKeyPress={validateNum}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='customer'
                    label='Cliente'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_clients_options}
                        loading={load_clients_options}
                        placeholder='Seleccionar un cliente'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                        onChange={onChangeClient}
                    >
                        {list_clients_options.length > 0 && list_clients_options.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='vacant'
                    label='Vacante'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={optionsByClient().length <= 0}
                        loading={load_vacancies_options}
                        placeholder='Seleccionar una vacante'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {optionsByClient().map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.job_position}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='qty_vacants'
                    label='Número de vacantes'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Número de vacantes'
                        onKeyPress={validateNum}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='vacant_status'
                    label='Estatus de la vacante'
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar un estatus'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsStatusVacant}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='salary'
                    label='Sueldo (MXN)'
                    rules={[ruleRequired, numCommaAndDot]}
                >
                    <Input
                        maxLength={20}
                        placeholder='Ej. 70,500.5999'
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='percentage_to_collect'
                    label='Porcentaje a cobrar'
                    rules={[
                        {type: 'number', min: 1, message: 'Mínimo de porcentaje mayor o igual a 1'},
                        {type: 'number', max: 100, message: 'Máximo de porcentaje menor o igual a 100'}
                    ]}
                >
                    <InputNumber
                        type='number'
                        maxLength={3}
                        controls={false}
                        placeholder='Porcentaje a cobrar'
                        onKeyPress={validateNum}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='amount_to_collect'
                    label='Monto a cobrar'
                    tooltip='El valor será calculado de manera automática según el sueldo y porcentaje a cobrar.'
                >
                    <Input
                        disabled
                        controls={false}
                        placeholder='Monto a cobrar'
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='estimated_billing'
                    label='Estimado de facturación'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Estimado de facturación'
                        onKeyPress={validateNum}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='candidates_date_send'
                    label='Fecha de envío de candidatos'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Seleccionar una fecha'
                        format='YYYY-MM-DD'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='job_bank'
                    label='Bolsas de empleo'
                >
                    <Select
                        mode='multiple'
                        maxTagCount={1}
                        placeholder='Seleccionar las opciones'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsJobBank}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='searches'
                    label='Búsquedas'
                    rules={[ruleWhiteSpace]}
                >
                    <Input
                        maxLength={100}
                        placeholder='Ej. Búsqueda del Fruto KAM, La Central Ventas Mayoreo'
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='candidate_acceptance_date'
                    label='Fecha de aceptación de candidatos'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Seleccionar una fecha'
                        format='YYYY-MM-DD'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='hiring_rejection_date'
                    label='Fecha de contratación / cancelación'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Seleccionar una fecha'
                        format='YYYY-MM-DD'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='active_vacancy_days'
                    label='Días activos de la vacante'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Días activos de la vacante'
                        onKeyPress={validateNum}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='candidate_days_send'
                    label='Días envío de candidatos'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Días envío de candidatos'
                        onKeyPress={validateNum}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='acceptance_days'
                    label='Días aceptación'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Días aceptación'
                        onKeyPress={validateNum}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='hiring_days'
                    label='Días contratación'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Días contratación'
                        onKeyPress={validateNum}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='target_company'
                    label='Empresas target'
                    rules={[ruleWhiteSpace]}
                >
                    <Input.TextArea
                        placeholder='Ej. Empresas del sector de consumo de alimentos y bebida'
                        maxLength={400}
                        autoSize={{
                            minRows: 4,
                            maxRows: 4,
                        }}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='comments'
                    label='Comentarios'
                    rules={[ruleWhiteSpace]}
                >
                    <Input.TextArea
                        placeholder='Comentarios'
                        maxLength={400}
                        autoSize={{
                            minRows: 4,
                            maxRows: 4,
                        }}
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default FormStrategies