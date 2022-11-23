import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd';
import MyModal from '../../../common/MyModal';
import { ruleRequired, onlyNumeric } from '../../../utils/rules';
import { useSelector } from 'react-redux';

const ModalExperience = ({
    title = '',
    close = () =>{},
    itemToEdit = {},
    visible = false,
    textSave = '',
    actionForm = () =>{}
}) => {

    const {
        load_competences,
        list_competences,
        load_main_categories,
        list_main_categories,
        load_sub_categories,
        list_sub_categories
    } = useSelector(state => state.jobBankStore);
    const [formExperience] = Form.useForm();
    const [loading, setLoading] = useState();

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        formExperience.setFieldsValue(itemToEdit);
    },[itemToEdit])

    const onCloseModal = () =>{
        close();
        formExperience.resetFields();
    }

    const onFinish = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            actionForm(values)
            onCloseModal()
        },2000)
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            widthModal={800}
            close={onCloseModal}
            closable={!loading}
        >
            <Form
                form={formExperience}
                layout='vertical'
                onFinish={onFinish}
            >
                <Row gutter={[24,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='category'
                            label='Categoría'
                            rules={[ruleRequired]}
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
                    <Col span={12}>
                        <Form.Item
                            name='sub_category'
                            label='Subcategoría'
                            rules={[ruleRequired]}
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
                    <Col span={12}>
                        <Form.Item
                            name='experience_years'
                            label='Años de experiencia'
                            rules={[onlyNumeric]}
                        >
                            <Input placeholder='Años de experiencia'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                    <Col span={24} style={{display: 'flex', justifyContent: 'flex-end', gap: 8}}>
                        <Button disabled={loading} onClick={()=> onCloseModal()}>Cancelar</Button>
                        <Button htmlType='submit' loading={loading}>
                            {textSave}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalExperience