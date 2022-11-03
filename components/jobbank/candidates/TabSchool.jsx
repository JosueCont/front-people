import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    DatePicker
} from 'antd';
import {
    optionsLevelAcademic,
    optionsStatusAcademic,
    optionsLangVacant
} from '../../../utils/constant';
import {
    ruleWhiteSpace,
    ruleRequired
} from '../../../utils/rules';

const TabSchool = ({ sizeCol = 8 }) => {
    return (
        <Row gutter={[24,0]}>
            <Col span={sizeCol}>
                <Form.Item
                    name='scholarship'
                    label='Escolaridad'
                    rules={[ruleRequired]}
                >
                    <Select
                        placeholder='Escolaridad'
                        options={optionsLevelAcademic}
                    />
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='status_school'
                    label='Estatus'
                    rules={[ruleRequired]}
                >
                    <Select
                        placeholder='Estatus'
                        options={optionsStatusAcademic}
                    />
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='date_finish'
                    label='Fecha de finalización'
                    rules={[ruleRequired]}
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Fecha de finalización'
                        format='YYYY-MM-DD'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='name_school'
                    label='Nombre de la institución'
                    rules={[ruleWhiteSpace]}
                >
                    <Input placeholder='Nombre de la institución'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='specialization'
                    label='Especialización'
                >
                    <Select
                        placeholder='Especialización'
                        options={[]}
                    />
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='language'
                    label='Idioma'
                >
                    <Select
                        mode='multiple'
                        placeholder='Idioma'
                        options={optionsLangVacant}
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default TabSchool