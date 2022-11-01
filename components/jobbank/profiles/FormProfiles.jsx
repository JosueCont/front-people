import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Checkbox,
    Button,
    Form,
    Select,
    Input,
    Divider,
    Tabs,
    Skeleton
} from 'antd';
import { useSelector } from 'react-redux';
import { useProcessInfo } from './hook/useProcessInfo';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';

const FormProfiles = ({
    formProfile,
    valuesDefault,
    disabledClient,
    disabledField,
    setDisabledField
}) => {
    const {
        load_clients_options,
        load_vacancies,
        load_profiles_types,
        list_profiles_types,
        list_clients_options,
        list_vacancies_fields
    } = useSelector(state => state.jobBankStore);
    const { formatData } = useProcessInfo();
    const { setFieldsValue, resetFields, getFieldValue } = formProfile;
    const titleSection = {
        main: 'Características del puesto',
        education_and_competence: 'Educación, competencias y habilidades',
        salary_and_benefits_set: 'Sueldo y prestaciones',
        recruitment_process: 'Proceso de reclutamiento'
    }


    const onChangeType = (value) =>{
        if(value == 'open_fields'){
            setFieldsValue({...valuesDefault, profile_type: value});
            setDisabledField(false)
            return;
        }
        let keepValues = {
            name: getFieldValue('name'),
            customer: getFieldValue('customer'),
            profile_type: value
        } 
        resetFields();
        setFieldsValue(keepValues);
        const type = item => item.id == value;
        let type_ = list_profiles_types.find(type);
        if(!type_) return;
        if(Object.keys(type_).length <= 0) return;
        if(Object.keys(type_.config).length <= 0) return;
        setDisabledField(!type_.form_enable)
        let activeFields = formatData(type_.config);
        setFieldsValue(activeFields);
    }

    return (
        <Row gutter={[8,0]}>
            <Col span={10}>
                <Form.Item
                    name='name'
                    style={{marginBottom: 0}}
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='Nombre'/>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name='customer'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        showSearch
                        disabled={disabledClient}
                        loading={load_clients_options}
                        placeholder='Cliente'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {list_clients_options.length > 0 && list_clients_options.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item name='profile_type' style={{marginBottom: 0}}>
                    <Select
                        disabled={load_profiles_types}
                        loading={load_profiles_types}
                        placeholder='Perfil de vacante'
                        notFoundContent='No se encontraron resultados'
                        onChange={onChangeType}
                    >
                        <Select.Option value='open_fields' key='open_fields'>
                            Personalizado
                        </Select.Option>
                        {list_profiles_types.length > 0 && list_profiles_types.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Skeleton loading={load_vacancies} active>
                    <Row gutter={[8,8]} className='vacant-list-fields'>
                        {Object.keys(list_vacancies_fields).length > 0
                            && Object.entries(list_vacancies_fields).map(([key, val]) => (
                            <>
                                <Divider plain>{titleSection[key]}</Divider>
                                <Col span={24} style={{background: '#f0f0f0', padding: '8px 12px', borderRadius: '12px'}}>
                                    <Row gutter={[8,0]} className='section-list-fields'>
                                        {Array.isArray(val) && _.chunk(val, Math.ceil(val.length/4)).map((record, idx) => (
                                            <Col xs={24} md={12} lg={6} key={`record_${idx}`} style={{display: 'flex', flexDirection: 'column'}}>
                                                {record.map((item, index) => (
                                                    <Form.Item name={`${key}|${item.field}`} key={`item_${idx}_${index}`} valuePropName='checked' noStyle>
                                                        <Checkbox style={{marginLeft: 0}} disabled={disabledField}>
                                                            {item.name}
                                                        </Checkbox>
                                                    </Form.Item>
                                                ))}
                                            </Col>
                                        ))}
                                    </Row>
                                </Col>
                            </>
                        ))}
                    </Row>
                </Skeleton>
            </Col>
        </Row>
    )
}

export default FormProfiles