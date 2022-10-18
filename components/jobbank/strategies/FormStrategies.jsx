import React, { useEffect } from 'react';
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
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';

const FormStrategies = () => {

    const persons_company = useSelector(state => state.userStore.persons_company);
    const load_persons = useSelector(state => state.userStore.load_persons);

    const optionsCustomer = [
        {value: '556514e950aa47cf85a60f2c6bf11000', key: '556514e950aa47cf85a60f2c6bf11000', label: 'Cliente 1'},
        {value: 'f5a3ca94949e4d9387bc107935961fa9', key: 'f5a3ca94949e4d9387bc107935961fa9', label: 'Cliente 2'}
    ]

    const optionsVacant = [
        {value: '02fe534841da4d5cb4865d58bf889701', key: '02fe534841da4d5cb4865d58bf889701', label: 'Vacante 1'},
        {value: '848572dc7e414c10b8f3c5265c2590d3', key: '848572dc7e414c10b8f3c5265c2590d3', label: 'Vacante 2'}
    ]

    return (
        <Row gutter={[24,0]}>
            <Col span={6}>
                <Form.Item
                    name='assignment_date'
                    label='Fecha de asignación'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Fecha de asignación'
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
                        placeholder='Reclutador'
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
                    rules={[ruleWhiteSpace]}
                >
                    <Input placeholder='Producto'/>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='sub_product'
                    label='Subproducto'
                >
                    <Select
                        placeholder='Subproducto'
                        notFoundContent='No se encontraron resultados'
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
                        placeholder='Tipo de venta'
                        notFoundContent='No se encontraron resultados'
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
                        placeholder='Ejecutivo comercial'
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
                        placeholder='Cliente'
                        notFoundContent='No se encontraron resultados'
                        options={optionsCustomer}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='vacant'
                    label='Vacante'
                    rules={[ruleRequired]}
                >
                    <Select
                        placeholder='Vacante'
                        notFoundContent='No se encontraron resultados'
                        options={optionsVacant}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='qty_vacants'
                    label='Número de vacantes'
                >
                    <InputNumber
                        type='number'
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
                        placeholder='Estatus de la vacante'
                        notFoundContent='No se encontraron resultados'
                        options={optionsStatusVacant}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='salary'
                    label='Sueldo'
                    rules={[ruleRequired]}
                >
                    <InputNumber
                        type='number'
                        controls={false}
                        placeholder='Sueldo'
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
                    name='percentage_to_collect'
                    label='Porcentaje a cobrar'
                >
                    <InputNumber
                        type='number'
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
                >
                    <InputNumber
                        type='number'
                        controls={false}
                        placeholder='Monto a cobrar'
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
                    name='estimated_billing'
                    label='Estimado de facturación'
                >
                    <InputNumber
                        type='number'
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
                        placeholder='Fecha de envío de candidatos'
                        format='YYYY-MM-DD'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='job_bank'
                    label='Bolsas de empleo'
                    rules={[ruleWhiteSpace]}
                >
                    <Select
                        mode='multiple'
                        maxTagCount={2}
                        placeholder='Bolsas de empleo'
                        notFoundContent='No se encontraron resultados'
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
                    <Input placeholder='Búsquedas'/>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='candidate_acceptance_date'
                    label='Fecha de aceptación de candidatos'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Fecha de aceptación de candidatos'
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
                        placeholder='Fecha de contratación / cancelación'
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
                        placeholder='Empresas target'
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