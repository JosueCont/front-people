import React, { useState } from 'react';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { getVacancies } from '../../../redux/jobBankDuck';
import { useRouter } from 'next/router';
import { ruleWhiteSpace } from '../../../utils/rules';

const SearchVacancies = ({
    load_clients_options,
    list_clients_options,
    currentNode,
    getVacancies
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();

    const createQuerys = (obj) =>{
        let query = '';
        if(obj.job_position) query += `&job_position__icontains=${obj.job_position}`;
        if(obj.customer) query += `&customer=${obj.customer}`;
        return query;
    }

    const onFinishSearch = (values) =>{
        const query = createQuerys(values);
        if(query) getVacancies(currentNode.id, query);
        else deleteFilter();
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        getVacancies(currentNode.id)
    }

    return (
        <Row gutter={[24,24]}>
            <Col xs={18} xxl={14}>
                <Form onFinish={onFinishSearch} form={formSearch} layout='inline' style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col span={12}>
                            <Form.Item
                                name='job_position'
                                rules={[ruleWhiteSpace]}
                                style={{marginBottom: 0}}
                            >
                                <Input placeholder='Buscar por nombre'/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='customer' style={{marginBottom: 0}}>
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
                        <Col span={4} style={{display: 'flex', gap: '8px'}}>
                            <Button htmlType='submit'>
                                <SearchOutlined />
                            </Button>
                            <Button onClick={()=> deleteFilter()}>
                                <SyncOutlined />
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
            <Col xs={6} xxl={10} style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button onClick={()=> router.push('/jobbank/vacancies/add')}>Agregar</Button>
            </Col>
        </Row>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
        load_clients_options: state.jobBankStore.load_clients_options,
        list_clients_options: state.jobBankStore.list_clients_options,
    }
}

export default connect(
    mapState,{
        getVacancies
    }
)(SearchVacancies)