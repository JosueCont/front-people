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
import moment from 'moment';
import { validateNum, getFullName, validateMaxLength } from '../../../utils/functions';
import { useSelector } from 'react-redux';
import { ruleRequired, ruleWhiteSpace, numCommaAndDot } from '../../../utils/rules';

const FormStrategies = ({
    formStrategies,
    disabledClient
}) => {

    const {
        load_clients_options,
        load_vacancies_options,
        load_jobboards_options,
        list_clients_options,
        list_vacancies_options,
        list_jobboards_options,
    } = useSelector(state => state.jobBankStore);
    const {
        load_persons,
        persons_company
    } = useSelector(state => state.userStore);
    const clientSelected = Form.useWatch('customer', formStrategies);
    const salary = Form.useWatch('salary', formStrategies);
    const percent = Form.useWatch('percentage_to_collect', formStrategies);
    const vacant = Form.useWatch('vacant', formStrategies);

    useEffect(()=>{
        if(list_vacancies_options.length <= 0) return;
        getSalary()
    },[vacant, list_vacancies_options])

    useEffect(()=>{
        getAmount()
    },[salary, percent])

    const setValue = (key, val) => formStrategies.setFieldsValue({[key]: val});
    const setSalary = (val = null) => setValue('salary', val);
    const setAmount = (val = null) => setValue('amount_to_collect', val);
    const setVacant = (val = null) => setValue('vacant', val);

    const getSalary = () =>{
        let key = 'salary_and_benefits';
        if(!vacant) return setSalary();
        const _find = item => item.id == vacant;
        let selected = list_vacancies_options.find(_find);
        if(!selected) return setSalary();
        let salaryNum = selected[key]?.gross_salary;
        if(!salaryNum) return setSalary();
        return setSalary(salaryNum);
    }

    const getAmount = () =>{
        let validation = !salary || !percent; 
        if(validation) return setAmount();
        let salary_ = parseFloat(salary.replaceAll(',',''));
        let amount = (salary_/100) * percent;
        let formatAmount = amount.toLocaleString("es-MX", {maximumFractionDigits: 4});
        return setAmount(formatAmount);
    }
    
    const optionsByClient = () =>{
        if(!clientSelected) return [];
        const options = item => item.customer?.id === clientSelected;
        return list_vacancies_options.filter(options);
    }

    const disabledDate = (current) => {
        return current && current < moment().startOf("day");
    };

    return (
        <Row gutter={[24,0]}>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='assignment_date'
                    label='Fecha de asignación'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Seleccionar una fecha'
                        disabledDate={disabledDate}
                        format='DD-MM-YYYY'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
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
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='product'
                    label='Producto'
                    rules={[ruleWhiteSpace, ruleRequired]}
                >
                    <Input maxLength={100} placeholder='Ej. Search'/>
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
            <Col xs={24} md={12} xl={8} xxl={6}>
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
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='num_project'
                    label='Número de proyecto'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Número de proyecto'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='customer'
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
                        onChange={(e)=> setVacant()}
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
                    name='vacant'
                    label='Vacante'
                    tooltip='El listado se habilita si el cliente seleccionado tiene vacantes registradas.'
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
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='qty_vacants'
                    label='Número de vacantes'
                    rules={[ruleRequired]}
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Número de vacantes'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
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
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='salary'
                    label='Sueldo (MXN)'
                    tooltip='El valor se obtiene por medio de la vacante seleccionada, si esta la tiene.'
                    rules={[
                        ruleRequired,
                        // numCommaAndDot()
                    ]}
                >
                    <Input
                        disabled
                        // maxLength={20}
                        placeholder='Ej. 70,500.5999'
                        // onKeyPress={e => e.which == 32 && e.preventDefault()}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='percentage_to_collect'
                    label='Porcentaje a cobrar'
                    rules={[
                        ruleRequired,
                        {type: 'number', min: 1, message: 'Mínimo de porcentaje mayor o igual a 1'},
                        {type: 'number', max: 100, message: 'Máximo de porcentaje menor o igual a 100'}
                    ]}
                >
                    <InputNumber
                        type='number'
                        maxLength={3}
                        controls={false}
                        placeholder='Porcentaje a cobrar'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
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
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='estimated_billing'
                    label='Estimado de facturación'
                >
                    <InputNumber
                        maxLength={20}
                        controls={false}
                        placeholder='Estimado de facturación'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='candidates_date_send'
                    label='Fecha de envío de candidatos'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Seleccionar una fecha'
                        format='DD-MM-YYYY'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='job_vacancies'
                    label='Bolsas de empleo'
                >   
                    <Select
                        mode='multiple'
                        disabled={load_jobboards_options}
                        loading={load_jobboards_options}
                        placeholder='Seleccionar las opciones'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {list_jobboards_options.length > 0 && list_jobboards_options.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='candidate_acceptance_date'
                    label='Fecha de aceptación de candidatos'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Seleccionar una fecha'
                        format='DD-MM-YYYY'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='hiring_rejection_date'
                    label='Fecha de contratación / cancelación'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Seleccionar una fecha'
                        format='DD-MM-YYYY'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            {/* <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='active_vacancy_days'
                    label='Días activos de la vacante'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Días activos de la vacante'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col> */}
            {/* <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='candidate_days_send'
                    label='Días envío de candidatos'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Días envío de candidatos'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col> */}
            {/* <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='acceptance_days'
                    label='Días aceptación'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Días aceptación'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col> */}
            {/* <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='hiring_days'
                    label='Días contratación'
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        controls={false}
                        placeholder='Días contratación'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    />
                </Form.Item>
            </Col> */}
            <Col span={24}>
                <Row gutter={[24,0]}>
                    <Col xs={24} md={12} xl={8}>
                        <Form.Item
                            name='searches'
                            label='Búsquedas'
                            tooltip='Nombre(s) de clientes para encontrar una vacante similar'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input.TextArea
                                autoSize={{ minRows: 4, maxRows: 4 }}
                                placeholder='Nombre(s) de clientes para encontrar una vacante similar'
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} xl={8}>
                        <Form.Item
                            name='target_company'
                            label='Empresas target'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input.TextArea
                                placeholder='Ej. Empresas del sector de consumo de alimentos y bebida'
                                autoSize={{
                                    minRows: 4,
                                    maxRows: 4,
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} xl={8}>
                        <Form.Item
                            name='comments'
                            label='Comentarios'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input.TextArea
                                placeholder='Comentarios'
                                autoSize={{
                                    minRows: 4,
                                    maxRows: 4,
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default FormStrategies