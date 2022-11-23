import React, { useState } from 'react';
import { Button, Input, Row, Col, Form, Select, Tooltip } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import {
    getPublications,
    setJobbankFilters
} from '../../../redux/jobBankDuck';
import { useRouter } from 'next/router';

const SearchPublications = ({
    load_vacancies_options,
    list_vacancies_options,
    load_profiles_options,
    list_profiles_options,
    currentNode,
    getPublications,
    setJobbankFilters,
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();

    const createFilters = (obj) =>{
        let query = '';
        // if(obj.job_position) query += `&job_position__unaccent__icontains=${obj.job_position}`;
        // if(obj.status) query+= `&status=${obj.status}`;
        // if(obj.customer) query += `&customer=${obj.customer}`;
        // if(obj.recruiter) query += `&strategy__recruiter_id=${obj.recruiter}`;
        return query;
    }

    const onFinishSearch = (values) =>{
        // let filters = createFilters(values);
        // if(filters){
        //     setJobbankFilters(filters)
        //     getPublications(currentNode.id, filters);
        // }else deleteFilter();
    }

    const deleteFilter = () =>{
        setJobbankFilters("")
        formSearch.resetFields();
        getPublications(currentNode.id);
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
                        name='code'
                        style={{marginBottom: 0}}
                    >
                        <Select
                            allowClear
                            placeholder='Código'
                            notFoundContent='No se encontraron resultados'
                            options={[]}
                        />
                    </Form.Item>
                </Col>
                <Col xs={11} sm={12} md={8} xl={4}>
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
                            {list_profiles_options.length > 0 && list_profiles_options.map(item=> (
                                <Select.Option value={item.id} key={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={12} sm={23} md={15} xl={12} style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto', gap: 8}}>
                    <div style={{display: 'flex', gap: 8}}>
                        <Button htmlType='submit'>
                            <SearchOutlined />
                        </Button>
                        <Button onClick={()=> deleteFilter()}>
                            <SyncOutlined />
                        </Button>
                    </div>
                    <Button onClick={()=> router.push('/jobbank/publications/add')}>Agregar</Button>
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
    }
}

export default connect(
    mapState,{
        getPublications,
        setJobbankFilters
    }
)(SearchPublications)