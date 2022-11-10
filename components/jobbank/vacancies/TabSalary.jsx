import React from 'react';
import {
    Form,
    Row,
    Col,
    Input,
    Select,
    InputNumber
} from 'antd';
import { validateNum } from '../../../utils/functions';
import {
    fourDecimal,
    onlyNumeric,
    ruleRequired,
    ruleWhiteSpace,
    numCommaAndDot
} from '../../../utils/rules';
import {
    optionsPaymentPeriod,
    optionsEconomicBenefits
} from '../../../utils/constant';

const TabSalary = ({ formVacancies }) => {

    const benefitSelected = Form.useWatch('economic_benefits', formVacancies);

    const onChangeBenefit = (value) =>{
        formVacancies.setFieldsValue({economic_benefits_description: null});
    }

    return (
        <Row gutter={[24,0]}>
            <Col span={8}>
                <Form.Item
                    name='gross_salary'
                    label='Sueldo mensual bruto (MXN)'
                    rules={[numCommaAndDot()]}
                >
                    <Input
                        maxLength={20}
                        placeholder='Ej. 70,500.5999'
                        onKeyPress={e => e.which == 32 && e.preventDefault()}
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name='payment_period'
                    label='Periodo de pago'
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar un periodo'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsPaymentPeriod}
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name='economic_benefits'
                    label='Prestaciones'
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una prestación'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsEconomicBenefits}
                        onChange={onChangeBenefit}
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name='economic_benefits_description'
                    label='Descripción de prestaciones'
                    rules={[ruleWhiteSpace]}
                >
                    <Input
                        disabled={benefitSelected !== 3}
                        placeholder='Ej. Vales de despensa, seguro de vida, gastos médicos, etc.'
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name='benefits'
                    label='Beneficios'
                    rules={[ruleWhiteSpace]}
                >
                    <Input placeholder='Transporte, servicio de comedor, etc.'/>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name='rewards'
                    label='Bonos'
                    rules={[ruleWhiteSpace]}
                >
                    <Input placeholder='Especificar los bonos a otorgar'/>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name='work_tools'
                    label='Herramientas de trabajo'
                    rules={[ruleWhiteSpace]}
                >
                    <Input placeholder='Uniformes, equipos de cómputo, etc.'/>
                </Form.Item>
            </Col>
        </Row>
    )
}

export default TabSalary