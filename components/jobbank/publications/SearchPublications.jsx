import React, { useState, useEffect } from 'react';
import { Button, Input, Row, Col, Form, Select, Tooltip } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import { optionsStatusVacant } from '../../../utils/constant';

const SearchPublications = ({
    load_vacancies_options,
    list_vacancies_options,
    load_profiles_options,
    list_profiles_options,
    list_connections_options,
    load_connections_options,
    currentNode
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();

    useEffect(()=>{
        let values = {...router.query};
        if(values.vacant__status) values.vacant__status = parseInt(values.vacant__status);
        if(values.account_to_share?.trim()) values.account_to_share = JSON.parse(values.account_to_share);
        formSearch.setFieldsValue(values);
    },[router])

    const onFinishSearch = (values) =>{
        values.account_to_share = values.account_to_share?.length > 0
            ? JSON.stringify(values.account_to_share) : null;
        let filters = createFiltersJB(values);
        router.replace({
            pathname: '/jobbank/publications/',
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace('/jobbank/publications', undefined, {shallow: true});
    }

    return (
        <Form
            layout='inline'
            onFinish={onFinishSearch}
            form={formSearch}
            style={{width: '100%'}}
        >
            <Row gutter={[0,8]} style={{width: '100%'}}>
                <Col xs={12} md={8} xl={4}>
                    <Form.Item
                        name='account_to_share'
                        style={{marginBottom: 0}}
                    >
                        <Select
                            allowClear
                            mode='multiple'
                            maxTagCount={1}
                            disabled={load_connections_options}
                            loading={load_connections_options}
                            placeholder='Cuenta'
                            notFoundContent='No se encontraron resultados'
                            optionFilterProp='children'
                        >
                            {list_connections_options.length > 0 && list_connections_options.map(item=> (
                                <Select.Option disabled={!item.is_active} value={item.code} key={item.code}>
                                    {item.name} {item.is_active ? '':' / No disponible'}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={12} md={8} xl={4}>
                    <Form.Item
                        name='vacant'
                        style={{marginBottom: 0}}
                    >
                        <Select
                            allowClear
                            showSearch
                            disabled={load_vacancies_options}
                            loading={load_vacancies_options}
                            placeholder='Vacante'
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
                <Col xs={12} md={8} xl={4}>
                    <Form.Item name='vacant__status' style={{marginBottom: 0}}>
                        <Select
                            allowClear
                            placeholder='Estatus vacante'
                            options={optionsStatusVacant}
                        />
                    </Form.Item>
                </Col>
                <Col xs={12} md={8} xl={4}>
                    <Form.Item
                        name='profile'
                        style={{marginBottom: 0}}
                    >
                        <Select
                            allowClear
                            showSearch
                            disabled={load_profiles_options}
                            loading={load_profiles_options}
                            placeholder='Template'
                            notFoundContent='No se encontraron resultados'
                            optionFilterProp='children'
                        >
                            <Select.Option value='open_fields' key='open_fields'>
                                Personalizado
                            </Select.Option>
                            {list_profiles_options.length > 0 && list_profiles_options.map(item=> (
                                <Select.Option value={item.id} key={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={12} md={8} xl={4}>
                    <Form.Item
                        name='is_published'
                        style={{marginBottom: 0}}
                    >
                        <Select
                            allowClear
                            placeholder='Estatus'
                        >
                            <Select.Option value='true' key='true'>Publicado</Select.Option>
                            <Select.Option value='false' key='false'>En borrador</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={12} sm={23} md={23} xl={4} style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto', gap: 8}}>
                    <div style={{display: 'flex', gap: 8}}>
                        <Tooltip title='Buscar'>
                            <Button htmlType='submit'>
                                <SearchOutlined />
                            </Button>
                        </Tooltip>
                        <Tooltip title='Limpiar filtros'>
                            <Button onClick={()=> deleteFilter()}>
                                <SyncOutlined />
                            </Button>
                        </Tooltip>
                    </div>
                    <Button onClick={()=> router.push({
                        pathname: '/jobbank/publications/add',
                        query: router.query
                    })}>
                        Agregar
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
        load_vacancies_options: state.jobBankStore.load_vacancies_options,
        list_vacancies_options: state.jobBankStore.list_vacancies_options,
        load_profiles_options: state.jobBankStore.load_profiles_options,
        list_profiles_options: state.jobBankStore.list_profiles_options,
        list_connections_options: state.jobBankStore.list_connections_options,
        load_connections_options: state.jobBankStore.load_connections_options
    }
}

export default connect(mapState)(SearchPublications)