import React from 'react';
import { Row, Col, Form, Input } from 'antd';
import {
    ruleWhiteSpace,
    ruleEmail,
    rulePhone
} from '../../../utils/rules';
import { validateNum } from '../../../utils/functions';

const TabContact = () => {
    return (
        <Row gutter={[24,0]} style={{margin: '24px 12px'}}>
            <Col span={12}>
                <Form.Item
                    name={'contact_name'}
                    rules={[ruleWhiteSpace]}
                >
                    <Input maxLength={50} placeholder={'Nombre del contacto'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name={'job_contact'}
                    rules={[ruleWhiteSpace]}
                >
                    <Input placeholder={'Ocupación del contacto'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name={'email_contact'}
                    rules={[ruleEmail]}
                    style={{marginBottom: 0}}
                >
                    <Input maxLength={50} placeholder={'Correo del contacto'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name={'phone_contact'}
                    rules={[rulePhone]}
                    style={{marginBottom: 0}}
                >
                    <Input
                        placeholder={'Teléfono del contacto'}
                        maxLength={10}
                        onKeyPress={validateNum}
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default TabContact