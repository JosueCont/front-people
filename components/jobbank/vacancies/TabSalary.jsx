import React from 'react';
import {
    Form,
    Row,
    Col,
    Input,
    Select,
    InputNumber
} from 'antd';
import {
    ruleRequired,
    numCommaAndDot
} from '../../../utils/rules';
import {
    optionsPaymentPeriod,
    optionsEconomicBenefits
} from '../../../utils/constant';
import dynamic from 'next/dynamic';

const EditorHTML = dynamic(() => import('../EditorHTML'), { ssr: false });

const TabSalary = ({
    formVacancies,
    infoVacant,
    setEditorState,
    editorState,
    setValueHTML,
    initialHTML,
    stylesEditor = {}
}) => {

    const { economic_benefits_description } = initialHTML;
    const benefitSelected = Form.useWatch('economic_benefits', formVacancies);

    const onChangeBenefit = (value) => {
        // formVacancies.setFieldsValue({ economic_benefits_description: null });
        setValueHTML(prev => ({ ...prev, economic_benefits_description: '<p></p>'}))
        setEditorState(prev => ({...prev, economic_benefits_description}));
    }

    return (
        <Row gutter={[24, 0]}>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='gross_salary'
                    label='Sueldo mensual bruto (MXN)'
                    rules={[ruleRequired, numCommaAndDot()]}
                >
                    <Input
                        prefix='$'
                        style={{ border: '1px solid black' }}
                        maxLength={10}
                        placeholder='Ej. 70,500.5999'
                        onKeyPress={e => e.which == 32 && e.preventDefault()}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
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
            <Col xs={24} md={12} xl={8} xxl={6}>
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
            <Col span={24}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} xl={12}>
                        <EditorHTML
                            isReadOnly={benefitSelected !== 3}
                            label='Descripción de prestaciones'
                            placeholder='Ej. Vales de despensa, seguro de vida, gastos médicos, etc.'
                            textHTML={infoVacant?.salary_and_benefits?.economic_benefits_description}
                            setValueHTML={e => setValueHTML(prev => ({ ...prev, economic_benefits_description: e }))}
                            editorState={editorState?.economic_benefits_description}
                            setEditorState={e => setEditorState(prev => ({ ...prev, economic_benefits_description: e }))}
                            {...stylesEditor}
                        />
                        {/* <Form.Item
                            name='economic_benefits_description'
                            label='Descripción de prestaciones'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input.TextArea
                                disabled={benefitSelected !== 3}
                                placeholder='Ej. Vales de despensa, seguro de vida, gastos médicos, etc.'
                                autoSize={{minRows: 5, maxRows: 5}}
                            />
                        </Form.Item> */}
                    </Col>
                    <Col xs={24} xl={12}>
                        <EditorHTML
                            label='Beneficios'
                            placeholder='Transporte, servicio de comedor, etc.'
                            textHTML={infoVacant?.salary_and_benefits?.benefits}
                            setValueHTML={e => setValueHTML(prev => ({ ...prev, benefits: e }))}
                            editorState={editorState?.benefits}
                            setEditorState={e => setEditorState(prev => ({ ...prev, benefits: e }))}
                            {...stylesEditor}
                        />
                        {/* <Form.Item
                            name='benefits'
                            label='Beneficios'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input.TextArea
                                placeholder='Transporte, servicio de comedor, etc.'
                                autoSize={{ minRows: 5, maxRows: 5 }}
                            />
                        </Form.Item> */}
                    </Col>
                    <Col xs={24} xl={12}>
                        <EditorHTML
                            label='Bonos'
                            placeholder='Especificar los bonos a otorgar'
                            textHTML={infoVacant?.salary_and_benefits?.rewards}
                            setValueHTML={e => setValueHTML(prev => ({ ...prev, rewards: e }))}
                            editorState={editorState?.rewards}
                            setEditorState={e => setEditorState(prev => ({ ...prev, rewards: e }))}
                            {...stylesEditor}
                        />
                        {/* <Form.Item
                            name='rewards'
                            label='Bonos'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input.TextArea
                                placeholder='Especificar los bonos a otorgar'
                                autoSize={{ minRows: 5, maxRows: 5 }}
                            />
                        </Form.Item> */}
                    </Col>
                    <Col xs={24} xl={12}>
                        <EditorHTML
                            label='Herramientas de trabajo'
                            placeholder='Uniformes, equipos de cómputo, etc.'
                            textHTML={infoVacant?.salary_and_benefits?.work_tools}
                            setValueHTML={e => setValueHTML(prev => ({ ...prev, work_tools: e }))}
                            editorState={editorState?.work_tools}
                            setEditorState={e => setEditorState(prev => ({ ...prev, work_tools: e }))}
                            {...stylesEditor}
                        />
                        {/* <Form.Item
                            name='work_tools'
                            label='Herramientas de trabajo'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input.TextArea
                                placeholder='Uniformes, equipos de cómputo, etc.'
                                autoSize={{ minRows: 5, maxRows: 5 }}
                            />
                        </Form.Item> */}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default TabSalary