import React from 'react';
import { Col, Form, Input, Button } from 'antd';
import FormConnection from '../FormConnection';
import { ruleWhiteSpace, ruleRequired } from '../../../../utils/rules';

const FormGC = ({
    infoConnection,
    loading
}) => {
    return (
        <>
            <FormConnection showActive={infoConnection.is_valid}/>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|API_KEY'
                    label='Clave API'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='Clave API'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|CLIENT_ID'
                    label='Identificador (Client ID)'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='Identificador (Client ID)'/>
                </Form.Item>
            </Col>
            <Col span={24} style={{display: 'flex', alignItems: 'center'}}>
                <Button
                    loading={loading}
                    htmlType='submit'
                    style={{marginLeft: 'auto'}}
                >
                    Actualizar
                </Button>
            </Col>
        </>
    )
}

export default FormGC