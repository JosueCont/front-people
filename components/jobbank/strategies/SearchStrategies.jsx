import React, { useEffect, useState } from 'react';
import {
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Input, Row, Col, Form, Select, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { ruleWhiteSpace } from '../../../utils/rules';
import { createFiltersJB } from '../../../utils/functions';
import { optionsStatusVacant } from '../../../utils/constant';

const SearchStrategies = ({
  currentNode,
  load_clients_options,
  list_clients_options,
  load_vacancies_options,
  list_vacancies_options
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const clientSelected = Form.useWatch('customer', formSearch);

    useEffect(()=>{
        let values = {...router.query};
        if(values.vacant__status) values.vacant__status = parseInt(values.vacant__status);
        formSearch.setFieldsValue(values);
    },[router])

    const onFinishSearch = (values) =>{
        let filters = createFiltersJB(values);
        router.replace({
            pathname: '/jobbank/strategies/',
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace('/jobbank/strategies', undefined, {shallow: true});
    }

    const onChangeClient = (value) =>{
        formSearch.setFieldsValue({vacant: null});
    }

    const optionsByClient = () =>{
        if(!clientSelected) return [];
        const options = item => item.customer?.id === clientSelected;
        return list_vacancies_options.filter(options);
    }

    return (
        <Form
            onFinish={onFinishSearch}
            form={formSearch} layout='inline'
            style={{width: '100%'}}
        >
            <Row style={{width: '100%'}}>
                <Col xs={24} sm={12} md={8} xl={5}>
                    <Form.Item
                        name='product__unaccent__icontains'
                        rules={[ruleWhiteSpace]}
                        style={{marginBottom: 0}}
                    >
                        <Input placeholder='Buscar por producto'/>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={5}>
                    <Form.Item name='customer' style={{marginBottom: 0}}>
                        <Select
                            allowClear
                            showSearch
                            disabled={load_clients_options}
                            loading={load_clients_options}
                            placeholder='Cliente'
                            notFoundContent='No se encontraron resultados'
                            optionFilterProp='children'
                            onChange={onChangeClient}
                        >
                            {list_clients_options.length > 0 && list_clients_options.map(item=> (
                                <Select.Option value={item.id} key={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={5}>
                    <Form.Item name='vacant' style={{marginBottom: 0}}>
                        <Select
                            allowClear
                            showSearch
                            disabled={optionsByClient().length <= 0}
                            loading={load_vacancies_options}
                            placeholder='Vacante'
                            notFoundContent='No se encontraron resultados'
                            optionFilterProp='children'
                        >
                            {optionsByClient().map(item=> (
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
                <Col xs={12} sm={23} md={15} xl={5} style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto', gap: 8}}>
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
                        pathname: '/jobbank/strategies/add',
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
        load_clients_options: state.jobBankStore.load_clients_options,
        list_clients_options: state.jobBankStore.list_clients_options,
        load_vacancies_options: state.jobBankStore.load_vacancies_options,
        list_vacancies_options: state.jobBankStore.list_vacancies_options
    }
}

export default connect(mapState)(SearchStrategies)