import React, { useState } from 'react';
import { Button, Input, Row, Col, Form, Select, Tooltip } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import {
    getVacancies,
    setJobbankFilters
} from '../../../redux/jobBankDuck';
import { useRouter } from 'next/router';
import { getFullName } from '../../../utils/functions';
import { ruleWhiteSpace } from '../../../utils/rules';
import { optionsStatusVacant } from '../../../utils/constant';

const SearchVacancies = ({
    load_clients_options,
    list_clients_options,
    currentNode,
    getVacancies,
    setJobbankFilters,
    load_persons,
    persons_company
}) => {

    const router = useRouter();
    const optionAll = [{value: 'all', key: 'all', label: 'Todos'}];
    const [formSearch] = Form.useForm();

    const createFilters = (obj) =>{
        let query = '';
        if(obj.job_position) query += `&job_position__unaccent__icontains=${obj.job_position}`;
        if(obj.status) query+= `&status=${obj.status}`;
        if(obj.customer) query += `&customer=${obj.customer}`;
        if(obj.recruiter) query += `&recruiter=${obj.recruiter}`;
        return query;
    }

    const onFinishSearch = (values) =>{
        let filters = createFilters(values);
        if(filters){
            setJobbankFilters(filters)
            getVacancies(currentNode.id, filters);
        }else deleteFilter();
    }

    const deleteFilter = () =>{
        setJobbankFilters("")
        formSearch.resetFields();
        getVacancies(currentNode.id)
    }

    return (
        <Form
            layout='inline'
            onFinish={onFinishSearch}
            form={formSearch}
            style={{width: '100%'}}
        >
            <Row gutter={[0,8]} style={{width: '100%'}}>
                <Col xs={24} sm={12} md={8} xl={7}>
                    <Form.Item
                        name='job_position'
                        rules={[ruleWhiteSpace]}
                        style={{marginBottom: 0}}
                    >
                        <Input placeholder='Buscar por vacante'/>
                    </Form.Item>
                </Col>
                <Col xs={12} md={8} xl={4}>
                    <Form.Item
                        name='status'
                        style={{marginBottom: 0}}
                    >
                        <Select
                            allowClear
                            placeholder='Estatus'
                            options={optionsStatusVacant}
                        />
                    </Form.Item>
                </Col>
                <Col xs={12} md={8} xl={4}>
                    <Form.Item
                        name='customer'
                        style={{marginBottom: 0}}
                    >
                        <Select
                            allowClear
                            showSearch
                            disabled={load_clients_options}
                            loading={load_clients_options}
                            placeholder='Cliente'
                            notFoundContent='No se encontraron resultados'
                            optionFilterProp='children'
                        >
                            {list_clients_options.length > 0 && list_clients_options.map(item=> (
                                <Select.Option value={item.id} key={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={11} sm={12} md={8} xl={4}>
                    <Form.Item
                        name='recruiter'
                        style={{marginBottom: 0}}
                    >
                        <Select
                            allowClear
                            showSearch
                            disabled={load_persons}
                            loading={load_persons}
                            placeholder='Reclutador'
                            notFoundContent='No se encontraron resultados'
                            optionFilterProp='children'
                        >
                            {persons_company.length > 0 && persons_company.map(item => (
                                <Select.Option value={item.id} key={item.id}>
                                    {getFullName(item)}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={12} sm={23} md={15} xl={5} style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto', gap: 8}}>
                    <div style={{display: 'flex', gap: 8}}>
                        <Button htmlType='submit'>
                            <SearchOutlined />
                        </Button>
                        <Button onClick={()=> deleteFilter()}>
                            <SyncOutlined />
                        </Button>
                    </div>
                    <Button onClick={()=> router.push('/jobbank/vacancies/add')}>Agregar</Button>
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
        load_persons: state.userStore.load_persons,
        persons_company: state.userStore.persons_company
    }
}

export default connect(
    mapState,{
        getVacancies,
        setJobbankFilters
    }
)(SearchVacancies)