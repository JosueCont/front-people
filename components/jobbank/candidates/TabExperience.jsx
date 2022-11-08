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
    ruleRequired,
    onlyNumeric
} from '../../../utils/rules';
import { useSelector } from 'react-redux';

const TabExperience = ({ sizeCol = 8 }) => {

    const {
        load_competences,
        list_competences,
        load_main_categories,
        list_main_categories,
        load_sub_categories,
        list_sub_categories
    } = useSelector(state => state.jobBankStore);

    return (
       <Row gutter={[24,0]}>
            <Col span={sizeCol}>
                <Form.Item
                    name='category'
                    label='Categoría'
                    // rules={[ruleRequired]}
                >
                    <Select
                        placeholder='Categoría'
                        notFoundContent='No se encontraron resultados'
                        disabled={load_main_categories}
                        loading={load_main_categories}
                    >
                         {list_main_categories?.length > 0 && list_main_categories.map(item => (
                            <Select.Option value={item.id} key={item.name}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='subcategory'
                    label='Subcategoría'
                    // rules={[ruleRequired]}
                >
                    <Select
                        placeholder='Subcategoría'
                        notFoundContent='No se encontraron resultados'
                        disabled={load_sub_categories}
                        loading={load_sub_categories}
                    >
                        {list_sub_categories.length > 0 && list_sub_categories.map(item=> (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='age_experience'
                    label='Años de experiencia'
                    rules={[onlyNumeric]}
                >
                    <Input placeholder='Años de experiencia'/>
                </Form.Item>
            </Col>
            <Col span={sizeCol}>
                <Form.Item
                    name='competences'
                    label='Competencias'
                >
                    <Select
                        mode='multiple'
                        maxTagCount={2}
                        disabled={load_competences}
                        loading={load_competences}
                        placeholder='Competencias'
                        notFoundContent='No se encontraron resultados'
                    >
                        {list_competences.length > 0 && list_competences.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
       </Row>
    )
}

export default TabExperience