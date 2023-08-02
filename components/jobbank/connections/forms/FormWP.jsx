import React from 'react';
import { Col, Form, Input, Button } from 'antd';
import FormConnection from '../FormConnection';
import { ruleURL, ruleRequired, ruleWhiteSpace } from '../../../../utils/rules';

const FormWP = ({
    infoConnection,
    loading
}) => {
    return (
        <>
            <FormConnection showActive={infoConnection.is_valid}/>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|APP_URL'
                    label='URL de la conexión'
                    rules={[
                        ruleURL,
                        ruleRequired,
                        ruleWhiteSpace
                    ]}
                >
                    <Input placeholder='Ej. https://graph.facebook.com/'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|PHONE_NUMBER_ID'
                    label='ID Telefónico'
                    rules={[ruleRequired]}
                >
                    <Input placeholder='ID Teléfonico'/>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item
                    name='data_config|ACCESS_TOKEN'
                    label='Token de acceso'
                    rules={[ruleRequired]}
                >
                    <Input.TextArea
                        // disabled
                        autoSize={{minRows: 4, maxRows: 4}}
                        placeholder='Token de acceso'
                    />
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

export default FormWP;