import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Row, Col, Input, Select, Form } from 'antd';
import { ruleRequired } from '../../../utils/rules';
import VacantFields from '../VacantFields';
import { useInfoProfile } from '../hook/useInfoProfile';

const FormPublications = ({
    formPublications,
    valuesDefault = {},
    disableField,
    setDisabledField
}) => {

    const {
        list_connections_options,
        load_connections_options,
        load_vacancies_options,
        load_profiles_options,
        list_vacancies_options,
        list_profiles_options,
        list_clients_options,
        load_clients_options,
        list_vacancies_fields,
        list_strategies_options,
        load_strategies_options
    } = useSelector(state => state.jobBankStore);
    const router = useRouter();
    const vacant = router?.query?.vacancy;
    const strategy = router?.query?.strategy;
    const client = router?.query?.client;
    const vacancy = Form.useWatch('vacant', formPublications);
    const template = Form.useWatch('profile', formPublications);
    // const strategy = Form.useWatch('strategy', formPublications);
    const customer = Form.useWatch('customer', formPublications);
    const { formatData } = useInfoProfile();

    // useEffect(()=>{
    //     onChangeCustomer();
    // },[customer])

    useEffect(()=>{
        if(list_vacancies_options.length <= 0) return;
        clientByVacant();
    },[vacant, list_vacancies_options, customer])

    useEffect(()=>{
        if(list_strategies_options.length <= 0) return;
        valuesByStrategy();
    },[strategy, list_strategies_options, customer])
    
    const setValue = (key, val) => formPublications.setFieldsValue({[key]: val});
    const setCustomer = (val = null) => setValue('customer', val);
    const setVacant = (val = null) => setValue('vacant', val);
    const setProfile = (val = null) => setValue('profile', val);
    
    const resetValues = () =>{
        setCustomer()
        setVacant()
    }

    const valuesByStrategy = () =>{
        if(!strategy) return;
        const _find = item => item.id == strategy;
        let result = list_strategies_options.find(_find);
        if(!result) return resetValues();
        if(result.customer?.id) setCustomer(result.customer.id);
        let idVacant = result?.vacant?.id;
        if(idVacant) setVacant(idVacant);
    }

    const clientByVacant = () =>{
        if(!vacant) return;
        const _find = item => item.id == vacant;
        let result = list_vacancies_options.find(_find);
        if(!result) return setCustomer();
        if(!result.customer) return setCustomer();
        setCustomer(result.customer.id);
    }

    const templatesByClient = useMemo(()=>{
        if(!customer) return [];
        const _filter = item => item.customer == customer;
        return list_profiles_options.filter(_filter);
    },[customer, list_profiles_options, template])

    const vacantsByClient = useMemo(()=>{
        if(!customer) return [];
        const options = item => item.customer?.id == customer;
        return list_vacancies_options.filter(options);
    },[customer, list_vacancies_options, vacancy])

    const onChangeCustomer = () =>{
        setProfile();
        setVacant();
        resetVacantFields();
        setDisabledField(false);
    }

    const resetVacantFields = () =>{
        let resetValues = formatData(list_vacancies_fields, false, 'field');
        formPublications.setFieldsValue(resetValues);
    }

    const onChangeType = (value) =>{
        setDisabledField(false);
        resetVacantFields();
        if(value == 'open_fields'){
            formPublications.setFieldsValue({
                ...valuesDefault,
                profile: value
            });
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

    const onChangeDisabled = () =>{
        if(!disableField) return;
        setDisabledField(false)
        formPublications.setFieldsValue({
            profile: 'open_fields'
        })
    }

    return (
        <Row gutter={[24,0]}>
            {/* <Col span={5}>
                <Form.Item
                    name='strategy'
                    label='Estrategia'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        loading={load_strategies_options}
                        placeholder='Seleccionar una estrategia'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {list_strategies_options.length > 0 && list_strategies_options.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.product}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col> */}
            <Col span={6}>
                <Form.Item
                    name='customer'
                    label='Cliente'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={client || vacant || strategy}
                        loading={load_clients_options}
                        placeholder='Seleccionar un cliente'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                        onChange={onChangeCustomer}
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
                    name='vacant'
                    label='Vacante'
                    tooltip='El listado se habilita si el cliente seleccionado tiene vacantes registradas.'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={vacantsByClient.length <=0 || vacant || strategy}
                        loading={load_vacancies_options}
                        placeholder='Seleccionar una vacante'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {vacantsByClient.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.job_position}
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
                        {templatesByClient.map(item=> (
                            <Select.Option value={item.id} key={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='account_to_share'
                    label='Cuentas conectadas'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        mode='multiple'
                        maxTagCount={1}
                        disabled={load_connections_options}
                        loading={load_connections_options}
                        placeholder='Seleccionar las cuentas'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {list_connections_options.length > 0 && list_connections_options.map(item=> (
                            <Select.Option value={item.code} key={item.code}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={24} style={{paddingTop: 12}}>
                <VacantFields
                    disabledField={disableField}
                    onChangeDisabled={onChangeDisabled}
                />
            </Col>
        </Row>
    )
}

export default FormPublications