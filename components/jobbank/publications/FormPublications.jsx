import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Input, Select, Form } from 'antd';
import { ruleRequired } from '../../../utils/rules';
import VacantFields from '../profiles/VacantFields';
import { useProcessInfo } from '../profiles/hook/useProcessInfo';

const FormPublications = ({
    formPublications,
    valuesDefault = {},
    disableField,
    setDisabledField,
    disabledVacant
}) => {

    const {
        list_connections,
        load_connections,
        load_vacancies_options,
        load_profiles_options,
        list_vacancies_options,
        list_profiles_options,
        list_clients_options,
        load_clients_options,
        list_vacancies_fields
    } = useSelector(state => state.jobBankStore);
    const vacant = Form.useWatch('vacant', formPublications);
    const customer = Form.useWatch('customer', formPublications);
    const profile = Form.useWatch('profile', formPublications);
    const { formatData } = useProcessInfo();

    // useEffect(()=>{
    //     onChangeCustomer();
    // },[customer])

    useEffect(()=>{
        if(list_vacancies_options.length <= 0) return;
        clientByVacant();
    },[vacant, list_vacancies_options])

    // useEffect(()=>{
    //     if(list_profiles_options.length <= 0) return;
    //     onChangeType(profile);
    // },[profile, list_profiles_options])

    const setValue = (key, val) => formPublications.setFieldsValue({[key]: val});
    const setCustomer = (val) => setValue('customer', val);
    const setProfile = (val) => setValue('profile', val); 

    const clientByVacant = () =>{
        if(!vacant) return setCustomer(null);
        const _find = item => item.id == vacant;
        let result = list_vacancies_options.find(_find);
        if(!result) return setCustomer(null);
        if(!result.customer) return setCustomer(null);
        setCustomer(result.customer.id);
    }

    const templatesByClient = () =>{
        if(!customer) return [];
        const _filter = item => item.customer == customer;
        return list_profiles_options.filter(_filter);
    }

    const onChangeCustomer = () =>{
        setProfile(null);
        resetVacantFields();
        setDisabledField(false);
    }

    const resetVacantFields = () =>{
        let resetValues = formatData(list_vacancies_fields, false, 'field');
        formPublications.setFieldsValue(resetValues);
    }

    const onChangeType = (value) =>{
        if(!value) setDisabledField(false);
        resetVacantFields();
        if(value == 'open_fields'){
            formPublications.setFieldsValue({
                ...valuesDefault,
                profile: value
            });
            setDisabledField(false);
            return;
        }
        const type = item => item.id == value;
        let type_ = list_profiles_options.find(type);
        if(!type_) return;
        if(Object.keys(type_).length <= 0) return;
        if(Object.keys(type_.fields_name).length <= 0) return;
        // if(type_.profile_type) setDisabledField(type_.profile_type.form_enable);
        setDisabledField(true);
        let activeFields = formatData(type_.fields_name);
        formPublications.setFieldsValue(activeFields);
    }

    return (
        <Row gutter={[24,0]}>
            <Col span={6}>
                <Form.Item
                    name='vacant'
                    label='Vacante'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={disabledVacant}
                        loading={load_vacancies_options}
                        placeholder='Seleccionar una vacante'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {list_vacancies_options.length > 0 && list_vacancies_options.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.job_position}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='customer'
                    label='Cliente de la vacante'
                    tooltip='El cliente se obtiene por medio de la vacante, si esta está asociada a uno.'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled
                        loading={load_clients_options}
                        placeholder='Seleccionar un cliente'
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
                <Form.Item
                    name='profile'
                    label='Template de vacante'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_profiles_options}
                        loading={load_profiles_options}
                        placeholder='Seleccionar un template'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                        onChange={onChangeType}
                    >
                        <Select.Option value='open_fields' key='open_fields'>
                            Personalizado
                        </Select.Option>
                        {templatesByClient().map(item=> (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='code_post'
                    label='Cuentas conectadas'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_connections}
                        loading={load_connections}
                        placeholder='Seleccionar una cuenta'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {list_connections.length > 0 && list_connections.map(item=> (
                            <Select.Option value={item.code} key={item.code}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={24}>
                <VacantFields disabledField={disableField}/>
            </Col>
        </Row>
    )
}

export default FormPublications