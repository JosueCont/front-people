import React, { useEffect, useMemo, useState } from 'react';
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
    optionsStatusVacant
} from '../../../utils/constant';
import moment from 'moment';
import {
    validateNum,
    validateMaxLength
} from '../../../utils/functions';
import { useSelector } from 'react-redux';
import {
    ruleRequired,
    ruleWhiteSpace,
} from '../../../utils/rules';
import SelectPeople from '../../people/utils/SelectPeople';

const FormStrategies = ({
    formStrategies,
    disabledClient,
    optionVacant = [],
    infoStrategy = {}
}) => {

    const {
        load_clients_options,
        load_vacancies_options,
        load_jobboards_options,
        list_clients_options,
        list_vacancies_options,
        list_jobboards_options,
    } = useSelector(state => state.jobBankStore);
    
    const newListVacant = [...list_vacancies_options, ...optionVacant];

    const clientSelected = Form.useWatch('customer', formStrategies);
    const percent = Form.useWatch('percentage_to_collect', formStrategies);
    const vacant = Form.useWatch('vacant', formStrategies);
    const salary = Form.useWatch('salary', formStrategies);

    useEffect(() => {
        getSalary()
    }, [vacant, newListVacant])

    useEffect(() => {
        getAmount()
    }, [salary, percent])

    const setValue = (key, val) => formStrategies.setFieldsValue({ [key]: val });
    const setAmount = (val = null) => setValue('amount_to_collect', val);
    const setVacant = (val = null) => setValue('vacant', val);

    const resetValues = ({
        salary = null,
        vacant_status_read = null,
        num_project_read = null,
        qty_vacants = null
    }) => {
        formStrategies.setFieldsValue({
            salary,
            vacant_status_read,
            num_project_read,
            qty_vacants
        });
    }

    const formatSalary = (val) => val.toLocaleString("es-MX", { maximumFractionDigits: 4 });

    const getSalary = () => {
        let key = 'salary_and_benefits';
        if (!vacant) {
            resetValues({});
            return;
        }
        const _find = item => item.id == vacant;
        let selected = newListVacant.find(_find);
        if (!selected) {
            resetValues({});
            return;
        }
        let salaryNum = selected[key]?.gross_salary;
        let salary = salaryNum ? formatSalary(parseFloat(salaryNum.replaceAll(',', ''))) : null;
        resetValues({
            salary,
            num_project_read: selected?.num_project ?? null,
            vacant_status_read: selected.status,
            qty_vacants: selected.qty
        })
    }

    const getAmount = () => {
        let validation = !salary || !percent;
        if (validation) {
            setAmount();
            return;
        }
        let salary_ = parseFloat(salary.replaceAll(',', ''));
        let amount = (salary_ / 100) * percent;
        setAmount(formatSalary(amount));
    }

    const optionsByClient = useMemo(() => {
        if (!clientSelected) return [];
        const options = item => (item.customer?.id || item.customer) == clientSelected;
        return newListVacant.filter(options);
    }, [clientSelected, newListVacant])

    const disabledDate = (current) => {
        let date = infoStrategy?.assignment_date ? moment(infoStrategy?.assignment_date) : moment();
        return current && current < date.startOf("day");
    };

    const validateDecimal = (e) => {
        if (![8, 190].includes(e.which)
            && isNaN(String.fromCharCode(e.which))) e.preventDefault();
    }

    const validateMin = () => ({
        validator(_, value) {
            if ([undefined, null, '',].includes(value)) return Promise.resolve();
            let percent = parseFloat(value);
            if (percent <= 0) return Promise.reject('Ingrese un valor mayor a 0');
            if (percent > 100) return Promise.reject('Ingrese un valor menor o igual a 100');
            return Promise.resolve();
        }
    })

    return (
        <Row gutter={[24, 0]}>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='assignment_date'
                    label='Fecha de asignación'
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder='Seleccionar una fecha'
                        disabledDate={disabledDate}
                        format='DD-MM-YYYY'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <SelectPeople
                    name='recruiter'
                    label='Reclutador'
                    rules={[ruleRequired]}
                    itemSelected={infoStrategy?.recruiter
                        ? [infoStrategy?.recruiter] : []}
                />
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='product'
                    label='Producto'
                    rules={[ruleWhiteSpace, ruleRequired]}
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
                        placeholder='Seleccionar una opción'
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
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsTypeSale}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <SelectPeople
                    name='business_executive'
                    label='Ejecutivo comercial'
                    itemSelected={infoStrategy?.business_executive
                        ? [infoStrategy?.business_executive] : []}
                />
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
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                        onChange={(e) => setVacant()}
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
                    tooltip={`El listado se habilita si existen vacantes registradas,
                    activas y no asignadas a una estrategia, según el cliente seleccionado.`}
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={optionsByClient.length <= 0}
                        loading={load_vacancies_options}
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {optionsByClient.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.job_position}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    // name='num_project'
                    name='num_project_read'
                    label='Número de proyecto'
                    tooltip='El valor se obtiene de acuerdo al registro de la vacante seleccionada.'
                >
                    <Input disabled maxLength={100} placeholder='Número de proyecto' />
                    {/* <InputNumber
                        type='number'
                        disabled
                        maxLength={10}
                        controls={false}
                        placeholder='Número de proyecto'
                        onKeyDown={validateNum}
                        onKeyPress={validateMaxLength}
                        style={{
                            width: '100%',
                            border: '1px solid black'
                        }}
                    /> */}
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='qty_vacants'
                    label='Número de vacantes'
                    tooltip='El valor se obtiene de acuerdo al registro de la vacante seleccionada.'
                    rules={[ruleRequired,
                        { type: 'number', min: 1, message: 'Ingrese un valor mayor o igual a 1' },
                        { type: 'number', max: 2147483647, message: 'Ingrese un valor menor o igual a 2147483647' }
                    ]}
                >
                    <InputNumber
                        disabled
                        type='number'
                        maxLength={10}
                        controls={false}
                        min={1}
                        max={2147483647}
                        placeholder='Número de vacantes'
                        onPaste={validateNum}
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
                    // name='vacant_status'
                    name='vacant_status_read'
                    label='Estatus de la vacante'
                    tooltip='El valor se obtiene de acuerdo al registro de la vacante seleccionada.'
                >
                    <Select
                        allowClear
                        showSearch
                        disabled
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsStatusVacant}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='salary'
                    // name='salary_read'
                    label='Sueldo (MXN)'
                    tooltip={`El valor se obtiene de acuerdo al registro de la vacante
                        seleccionada, si no se visualiza este dato debe dirigirse al módulo de
                        Vacantes -> Sueldo y Prestaciones -> Sueldo mensual bruto (MXN).
                    `}
                    rules={[
                        ruleRequired,
                        // numCommaAndDot()
                    ]}
                >
                    <Input
                        prefix='$'
                        disabled
                        placeholder='Ej. 70,500.5999'
                        style={{ border: '1px solid black' }}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='percentage_to_collect'
                    label='Porcentaje a cobrar'
                    rules={[
                        ruleRequired,
                        validateMin
                    ]}
                >
                    <InputNumber
                        type='number'
                        maxLength={10}
                        // min={1}
                        // max={100}
                        step={0.1}
                        controls={false}
                        placeholder='Porcentaje a cobrar'
                        onPaste={validateDecimal}
                        onKeyDown={validateDecimal}
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
                    label='Monto a cobrar (MXN)'
                    tooltip='El valor será calculado de manera automática según el sueldo y porcentaje a cobrar.'
                >
                    <Input
                        prefix='$'
                        disabled
                        placeholder='Monto a cobrar'
                        style={{ border: '1px solid black' }}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='estimated_billing'
                    label='Estimado de facturación (MXN)'
                    rules={[
                        ({
                            validator(_, value) {
                                if ([undefined, null, ''].includes(value)) return Promise.resolve();
                                if (value <= 0) return Promise.reject('Ingrese un valor mayor a 0');
                                return Promise.resolve();
                            }
                        })
                    ]}
                >
                    <InputNumber
                        maxLength={10}
                        step={0.1}
                        prefix='$'
                        controls={false}
                        placeholder='Estimado de facturación'
                        onKeyDown={validateDecimal}
                        onKeyPress={validateMaxLength}
                        onPaste={validateDecimal}
                        style={{
                            width: '100%',
                            borderRadius: '10px',
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
                        style={{ width: '100%' }}
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
                        maxTagCount='responsive'
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
                        style={{ width: '100%' }}
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
                        style={{ width: '100%' }}
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
                <Row gutter={[24, 0]}>
                    <Col xs={24} md={12} xl={8}>
                        <Form.Item
                            name='searches'
                            label='Búsquedas'
                            tooltip='Nombre(s) de clientes para encontrar una vacante similar'
                        // rules={[ruleWhiteSpace]}
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
                        // rules={[ruleWhiteSpace]}
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
                        // rules={[ruleWhiteSpace]}
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