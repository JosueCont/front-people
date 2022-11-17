import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Form,
    Select,
    Input,
} from 'antd';
import { useSelector } from 'react-redux';
import { useProcessInfo } from './hook/useProcessInfo';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';
import VacantFields from './VacantFields';

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
        list_clients_options
    } = useSelector(state => state.jobBankStore);
    const { formatData } = useProcessInfo();
    const { setFieldsValue, resetFields, getFieldValue } = formProfile;

    const onChangeType = (value) =>{
        if(!value) setDisabledField(false);
        let keepValues = {
            name: getFieldValue('name'),
            customer: getFieldValue('customer'),
            profile_type: value
        } 
        resetFields();
        if(value == 'open_fields'){
            let info = {...valuesDefault, ...keepValues};
            setFieldsValue(info);
            setDisabledField(false)
            return;
        }
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
        <Row gutter={[24,16]}>
            <Col xs={24} lg={10}>
                <Form.Item
                    name='name'
                    style={{marginBottom: 0}}
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input maxLength={100} placeholder='Nombre del perfil'/>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={7}>
                <Form.Item
                    name='customer'
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
            <Col span={24}>
                <VacantFields disabledField={disabledField}/>
            </Col>
        </Row>
    )
}

export default FormProfiles