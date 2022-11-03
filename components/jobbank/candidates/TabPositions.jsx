import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    DatePicker
} from 'antd';
import { optionsStatusAcademic } from '../../../utils/constant';
import {
    ruleWhiteSpace,
    ruleRequired,
} from '../../../utils/rules';
import { useSelector } from 'react-redux';

const TabPositions = ({ sizeCol = 8 }) => {

    const {
        list_sectors,
        load_sectors
    } = useSelector(state => state.jobBankStore);

    return (
        <Row gutter={[24,0]}>
            <Col span={sizeCol}>
                <Form.Item
                    name='title_position'
                    label='Título de la posición'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='Título de la posición'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='bussines'
                    label='Empresa'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='Empresa'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='sector'
                    label='Sector'
                >
                    <Select
                        disabled={load_sectors}
                        loading={load_sectors}
                        placeholder='Sector'
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
                    name='date_start'
                    label='Fecha de inicio'
                    rules={[ruleRequired]}
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Fecha de inicio'
                        format='YYYY-MM-DD'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='date_end'
                    label='Fecha de finalización'
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
                    name='status_position'
                    label='Estatus'
                >
                    <Select
                        placeholder='Estatus'
                        options={optionsStatusAcademic}
                    />
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='cv'
                    label='Adjuntar CV'
                >
                    <Input placeholder='Adjuntar CV'/>
                </Form.Item>
            </Col>
        </Row>
    )
}

export default TabPositions