import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Form, Select, Input, Button, InputNumber } from 'antd';
import MyModal from '../../../common/MyModal';
import { ruleRequired, onlyNumeric } from '../../../utils/rules';
import { validateNum, validateMaxLength } from '../../../utils/functions';
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
    const categorySelected = Form.useWatch('category', formExperience);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        formExperience.setFieldsValue(itemToEdit);
    },[itemToEdit])

    const onChangeCategory = (value) =>{
        formExperience.setFieldsValue({
          sub_category: null
        })
      }

    const optionsByCategory = useMemo(()=>{
        if(!categorySelected) return [];
        const options = item => item.category === categorySelected;
        return list_sub_categories.filter(options);
    },[categorySelected])

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

    const ruleMaxYears = {
        type: 'number',
        max: 90,
        message: 'Experiencia máxima menor o igual a 90 años'
    }

    const ruleMinYears = {
        type: 'number',
        min: 1,
        message: 'Experiencia mínima mayor o igual a 1 año'
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
                                allowClear
                                showSearch
                                placeholder='Seleccionar una categoría'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_main_categories}
                                loading={load_main_categories}
                                onChange={onChangeCategory}
                                optionFilterProp='children'
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
                                allowClear
                                showSearch
                                placeholder='Seleccionar una subcategoría'
                                notFoundContent='No se encontraron resultados'
                                disabled={optionsByCategory.length <= 0}
                                loading={load_sub_categories}
                                optionFilterProp='children'
                            >
                                {optionsByCategory.map(item=> (
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
                            rules={[ruleRequired, ruleMinYears, ruleMaxYears]}
                        >
                            <InputNumber
                                type='number'
                                maxLength={2}
                                controls={false}
                                onKeyDown={validateNum}
                                onKeyPress={validateMaxLength}
                                placeholder='Años de experiencia'
                                style={{
                                    width: '100%',
                                    border: '1px solid black'
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='competences'
                            label='Competencias'
                            rules={[ruleRequired]}
                        >
                            <Select
                                mode='multiple'
                                maxTagCount={1}
                                disabled={load_competences}
                                loading={load_competences}
                                placeholder='Seleccionar las competencias'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
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