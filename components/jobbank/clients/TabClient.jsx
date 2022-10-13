import React, { useRef } from 'react';
import { Row, Col, Form, Input, Select, Button} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace,
    ruleURL
} from '../../../utils/rules';

const TabClient = () =>{

    const options = [
        {key: '9c5b2a3edf694717a04ffdda0fca13e7', value: '9c5b2a3edf694717a04ffdda0fca13e7', label: 'Sector 1'},
        {key: '21bba3f0ae434e84810346f8f52bff24', value: '21bba3f0ae434e84810346f8f52bff24', label: 'Sector 2'},
        {key: 'fb23dbe189074a0a83c0b10c427c3e1f', value: 'fb23dbe189074a0a83c0b10c427c3e1f', label: 'Sector 3'},
        {key: '6e641b9e43f34ae4aa1ebd3aab074c70', value: '6e641b9e43f34ae4aa1ebd3aab074c70', label: 'Sector 4'}
    ]

    return (
        <Row gutter={[24,0]} style={{margin: '24px 12px'}}>
            <Col span={12}>
                <Form.Item
                    name={'name'}
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input maxLength={50} placeholder={'Escriba un nombre'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name={'description'}
                    rules={[ruleWhiteSpace]}
                >
                    <Input maxLength={50} placeholder={'Escriba una descripción'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name={'sector'}>
                    <Select
                        placeholder={'Seleccione un sector'}
                        notFoundContent={'No se encontraron resultados'}
                        options={options}
                    />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item 
                    name={'website'}
                    rules={[ruleURL]}
                >
                    <Input placeholder={'Escriba la url de su sitio'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name={'business_name'}
                    rules={[ruleWhiteSpace]}
                    // style={{marginBottom: 0}}
                >
                    <Input maxLength={50} placeholder={'Razón social'}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name={'comments'}
                    rules={[ruleWhiteSpace]}
                    // style={{marginBottom: 0}}
                >
                    <Input placeholder={'Comentarios'}/>
                </Form.Item>
            </Col>
        </Row>
    )
}

export default TabClient;