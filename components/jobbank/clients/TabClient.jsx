import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Button, Checkbox} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace,
    ruleURL,
    rfcFormat
} from '../../../utils/rules';
import { optionsBusinessName } from '../../../utils/constant';
import { useSelector } from 'react-redux';

const TabClient = ({ sizeCol = 12 }) =>{

    const {
        list_sectors,
        load_sectors
    } = useSelector(state => state.jobBankStore);

    return (
        <Row gutter={[24,0]} className='tab-client'>
            <Col xs={24} xl={14} xxl={24}>
                <Row gutter={[24,0]}>
                    <Col xs={24} md={12} style={{display: 'none'}}>
                        <Form.Item name='is_active' valuePropName='checked'>
                            <Checkbox>¿Está activo?</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} xl={12} xxl={8}>
                        <Form.Item
                            name='name'
                            label='Nombre del cliente'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input maxLength={50} placeholder='Escriba un nombre'/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} xl={12} xxl={8}>
                        <Form.Item
                            name='rfc'
                            label='RFC del cliente'
                            rules={[
                                ruleRequired,
                                rfcFormat
                            ]}
                        >
                            <Input placeholder='RFC' maxLength={13}/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} xl={12} xxl={8}>
                        <Form.Item label='Sector' name='sector'>
                            <Select
                                allowClear
                                showSearch
                                disabled={load_sectors}
                                loading={load_sectors}
                                placeholder='Seleccionar un sector'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_sectors.length > 0 && list_sectors.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} xl={12} xxl={8}>
                        <Form.Item 
                            name='website'
                            label='URL de su sitio'
                            rules={[ruleURL]}
                        >
                            <Input placeholder='Iniciar con http(s)://'/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} xl={12} xxl={8}>
                        <Form.Item
                            name='business_name'
                            label='Razón social'
                        >
                            <Select
                                allowClear
                                placeholder='Razón social'
                                options={optionsBusinessName}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
            <Col xs={24} xl={10} xxl={24}>
                <Row gutter={[24,0]}>
                    <Col xs={24} lg={12} xl={24} xxl={12}>
                        <Form.Item
                            name='description'
                            label='Descripción del cliente'
                            // rules={[ruleWhiteSpace]}
                        >
                            <Input.TextArea
                                placeholder='Escriba una breve descripción'
                                autoSize={{
                                    minRows: 3,
                                    maxRows: 3
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12} xl={24} xxl={12}>
                        <Form.Item
                            name='comments'
                            label='Comentarios adicionales'
                            // rules={[ruleWhiteSpace]}
                            // style={{marginBottom: 0}}
                        >
                            <Input.TextArea
                                autoSize={{
                                    minRows: 3,
                                    maxRows: 3
                                }}
                                placeholder='Escriba los comentarios'
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default TabClient;