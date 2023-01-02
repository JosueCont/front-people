import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Select, Form } from 'antd';
import { ruleRequired } from '../../../../utils/rules';
import VacantFields from '../../profiles/VacantFields';

const FormTemplate = () => {
    return (
        <Row gutter={[24,0]}>
            <Col span={12}>
                <Form.Item
                    name='name'
                    label='Nombre'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                   <Input maxLength={50} placeholder='Nombre'/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name='form_enable'
                    label='¿Se podrá editar?'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron'
                        options={[
                            {value: true, key: true, label: 'Sí'},
                            {value: false, key: false, label: 'No'}
                        ]}
                    />
                </Form.Item>
            </Col>
            <Col span={24} style={{paddingTop: 12}}>
                <VacantFields/>
            </Col>
        </Row>
    )
}

export default FormTemplate