import React from 'react';
import { Row, Col, Form, Select, Input, DatePicker, TimePicker } from 'antd';
import { useSelector } from 'react-redux';
import { optionsStatusInterviews } from '../../../utils/constant';

const FormInterview = () => {

    const {
        load_clients_options,
        load_profiles_types,
        list_profiles_types,
        list_clients_options,
        list_vacancies_fields,
        load_vacancies_options,
        list_vacancies_options,
        load_candidates_options,
        list_candidates_options
    } = useSelector(state => state.jobBankStore);

    return (
        <Row gutter={[24,0]}>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item name='type' label='Tipo de entrevista'>
                    <Select
                        showSearch
                        allowClear
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={[]}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='client'
                    label='Cliente'
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_clients_options}
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
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='vacant'
                    label='Vacante'
                >
                    <Select
                        allowClear
                        showSearch
                        disabled={load_vacancies_options}
                        loading={load_vacancies_options}
                        placeholder='Seleccionar una opción'
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
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='candidate'
                    label='Candidato'
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        disabled={load_candidates_options}
                        loading={load_candidates_options}
                        optionFilterProp='children'
                    >
                        {list_candidates_options?.length > 0 && list_candidates_options.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                                {item.fisrt_name} {item.last_name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='date'
                    label='Fecha'
                >
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder='Seleccionar una fecha'
                        format='DD-MM-YYYY'
                        inputReadOnly
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='hour'
                    label='Hora'
                >
                    <TimePicker
                        inputReadOnly
                        placeholder='Seleccionar una hora'
                        format='hh:mm a'
                        style={{width: '100%'}}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='status'
                    label='Estatus'
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder='Seleccionar una opción'
                        notFoundContent='No se encontraron resultados'
                        optionFilterProp='label'
                        options={optionsStatusInterviews}
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default FormInterview