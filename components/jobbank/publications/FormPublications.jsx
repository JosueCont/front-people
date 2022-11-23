import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Input, Select, Form } from 'antd';
import { ruleRequired } from '../../../utils/rules';
import VacantFields from '../profiles/VacantFields';
import { useProcessInfo } from '../profiles/hook/useProcessInfo';

const FormPublications = ({
    formPublications
}) => {

    const {
        list_connections,
        load_connections,
        load_vacancies_options,
        load_profiles_options,
        list_vacancies_options,
        list_profiles_options,
        list_clients_options,
        load_clients_options
    } = useSelector(state => state.jobBankStore);
    const vacant = Form.useWatch('vacant', formPublications);
    const customer = Form.useWatch('customer', formPublications);
    const [disableField, setDisabledField] = useState(false);
    const { formatData } = useProcessInfo();

    useEffect(()=>{
        setProfile(null);
    },[customer])

    useEffect(()=>{
        clientByVacant()
    },[vacant])

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

    const onChangeType = (value) =>{
        if(!value) setDisabledField(false);
        let keepValues = {
            vacant: formPublications.getFieldValue('vacant'),
            customer: formPublications.getFieldValue('customer'),
            code_post: formPublications.getFieldValue('code_post'),
            profile: value
        } 
        formPublications.resetFields();
        if(value == 'open_fields'){
            // let info = {...valuesDefault, ...keepValues};
            formPublications.setFieldsValue(keepValues);
            setDisabledField(false)
            return;
        }
        formPublications.setFieldsValue(keepValues);
        const type = item => item.id == value;
        let type_ = list_profiles_options.find(type);
        if(!type_) return;
        if(Object.keys(type_).length <= 0) return;
        if(Object.keys(type_.fields_name).length <= 0) return;
        if(type_.profile_type) setDisabledField(type_.profile_type.form_enable);
        let activeFields = formatData(type_.fields_name);
        formPublications.setFieldsValue(activeFields);
    }

    return (
        <Row gutter={[24,16]}>
            <Col span={6}>
                <Form.Item
                    name='vacant'
                    label='Vacante'
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_vacancies_options}
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