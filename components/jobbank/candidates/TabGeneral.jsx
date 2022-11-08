import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber
} from 'antd';
import {
    ruleWhiteSpace,
    ruleRequired,
    ruleEmail,
    rulePhone,
    onlyNumeric
} from '../../../utils/rules';
import { validateNum } from '../../../utils/functions';

const TabGeneral = ({ sizeCol = 8 }) => {
    return (
        <Row gutter={[24,0]}>
            <Col span={sizeCol}>
                <Form.Item
                    name='name'
                    label='Nombre y apellidos'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='Nombre y apelldos'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='date_birth'
                    label='Fecha de nacimiento'
                    rules={[ruleRequired]}
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Fecha de nacimiento'
                        format='YYYY-MM-DD'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='email'
                    label='Correo'
                    rules={[ruleRequired, ruleEmail]}
                >
                    <Input placeholder='Correo'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='phone'
                    label='Teléfono celular'
                    rules={[rulePhone, ruleRequired]}
                >
                    <Input placeholder='Teléfono celular'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='cell'
                    label='Teléfono fijo'
                    rules={[rulePhone]}
                >
                    <Input placeholder='Teléfono fijo'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='address'
                    label='Dirección'
                    rules={[onlyNumeric]}
                >
                    <Input placeholder='Dirección'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='about_me'
                    label='Acerca de ti'
                    rules={[ruleWhiteSpace]}
                >
                    <Input.TextArea
                        placeholder='Acerca de ti'
                        autoSize={{
                            minRows: 5,
                            maxRows: 5,
                        }}
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default TabGeneral;