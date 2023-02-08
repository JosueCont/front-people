import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Form,
    Select,
    Input,
} from 'antd';
import { useSelector } from 'react-redux';
import { useInfoProfile } from '../hook/useInfoProfile';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';
import VacantFields from '../VacantFields';

const FormProfiles = ({
    formProfile,
    valuesDefault,
    disabledClient,
    disabledField,
    setDisabledField
}) => {
    const {
        load_clients_options,
        load_profiles_types,
        list_profiles_types,
        list_clients_options,
        list_vacancies_fields
    } = useSelector(state => state.jobBankStore);
    const { formatData } = useInfoProfile();

    const onChangeType = (value) =>{
        setDisabledField(false);
        let resetValues = formatData(list_vacancies_fields, false, 'field');
        formProfile.setFieldsValue(resetValues);
        if(value == 'open_fields'){
            formProfile.setFieldsValue({
                ...valuesDefault,
                profile_type: value
            });
            return;
        }
        const type = item => item.id == value;
        let type_ = list_profiles_types.find(type);
        if(!type_) return;
        if(Object.keys(type_).length <= 0) return;
        if(Object.keys(type_.config).length <= 0) return;
        setDisabledField(!type_.form_enable);
        let activeFields = formatData(type_.config);
        formProfile.setFieldsValue(activeFields);
    }

    const onChangeDisabled = () =>{
        if(disabledField) return;
        setDisabledField(false)
        formProfile.setFieldsValue({
            profile_type: 'open_fields'
        })
    }

    return (
        <Row gutter={[24,0]}>
            <Col xs={24} lg={10}>
                <Form.Item
                    name='name'
                    label='Nombre del template'
                    style={{marginBottom: 0}}
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input maxLength={100} placeholder='Escriba el nombre'/>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={7}>
                <Form.Item
                    name='customer'
                    label='Cliente'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={disabledClient}
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
            <Col xs={24} sm={12} lg={7}>
                <Form.Item
                    name='profile_type'
                    label='Tipo de template'
                    rules={[ruleRequired]}
                    style={{marginBottom: 0}}
                >
                    <Select
                        showSearch
                        allowClear
                        disabled={load_profiles_types}
                        loading={load_profiles_types}
                        placeholder='Seleccionar un tipo'
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
            <Col span={24} style={{paddingTop: 12}}>
                <VacantFields
                    disabledField={disabledField}
                    onChangeDisabled={onChangeDisabled}
                />
            </Col>
        </Row>
    )
}

export default FormProfiles