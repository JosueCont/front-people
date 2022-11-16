import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Input, Select, Form } from 'antd';
import VacantFields from '../profiles/VacantFields';

const FormPublications = ({
    formPublications
}) => {

    const openFields = {id: 'open_fields', name: 'Personalizado'};
    const vacant = Form.useWatch('vacant', formPublications);

    useEffect(()=>{
        clientByVacant()
    },[vacant])

    const setClient = (val) => formPublications.setFieldsValue({client: val});

    const clientByVacant = () =>{
        if(!vacant) return setClient(null);
        const _find = item => item.id == vacant;
        let vacancie = list_vacancies_options.find(_find);
        if(!vacancie) return setClient(null);
        if(!vacancie.customer) return setClient(null);
        let name = vacancie.customer?.name;
        setClient(name);
    }

    const optionsByClient = () =>{
        if(!vacant) return [openFields];
        const _find = item => item.id == vacant;
        let vacancie = list_vacancies_options.find(_find);
        if(!vacancie) return [openFields]
        if(!vacancie.customer) return [openFields];
        const _filter = item => item.customer == vacancie.customer.id;
        let profiles = list_profiles_options.filter(_filter);
        return [...profiles, openFields];
    }

    const {
        list_connections,
        load_connections,
        load_vacancies_options,
        load_profiles_options,
        list_vacancies_options,
        list_profiles_options
    } = useSelector(state => state.jobBankStore);

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
                    name='client'
                    label='Cliente de la vacante'
                    style={{marginBottom: 0}}
                >
                    <Input
                        disabled
                        placeholder='Nombre del cliente'
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name='profile'
                    label='Perfiles de vacante'
                    style={{marginBottom: 0}}
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_profiles_options}
                        loading={load_profiles_options}
                        placeholder='Seleccionar un perfil'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='children'
                    >
                        {optionsByClient().map(item=> (
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
                <VacantFields/>
            </Col>
        </Row>
    )
}

export default FormPublications