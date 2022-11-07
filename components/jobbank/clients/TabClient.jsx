import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Button, Checkbox} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace,
    ruleURL,
    rfcFormat
} from '../../../utils/rules';
import { useSelector } from 'react-redux';

const TabClient = ({ sizeCol = 12 }) =>{

    const {
        list_sectors,
        load_sectors
    } = useSelector(state => state.jobBankStore);

    return (
        <Row gutter={[24,0]} className='tab-client'>
            <Col span={12} style={{display: 'none'}}>
                <Form.Item name='is_active' valuePropName='checked'>
                    <Checkbox>¿Está activo?</Checkbox>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='name'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input maxLength={50} placeholder='Escriba un nombre'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='rfc'
                    rules={[
                        ruleRequired,
                        rfcFormat
                    ]}
                >
                    <Input placeholder='RFC' maxLength={13}/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='description'
                    rules={[ruleWhiteSpace]}
                >
                    <Input maxLength={50} placeholder='Escriba una descripción'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item name='sector'>
                    <Select
                        allowClear
                        disabled={load_sectors}
                        loading={load_sectors}
                        placeholder='Seleccionar un sector'
                        notFoundContent='No se encontraron resultados'
                    >
                        {list_sectors.length > 0 && list_sectors.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item 
                    name='website'
                    rules={[ruleURL]}
                    help=''
                >
                    <Input placeholder='URL de su sitio, iniciar con http(s)://'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='business_name'
                    rules={[ruleWhiteSpace]}
                    // style={{marginBottom: 0}}
                >
                    <Input maxLength={50} placeholder='Razón social'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='comments'
                    rules={[ruleWhiteSpace]}
                    // style={{marginBottom: 0}}
                >
                    <Input.TextArea
                        maxLength={400}
                        autoSize={{
                            minRows: 3,
                            maxRows: 3
                        }}
                        placeholder='Comentarios'
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default TabClient;