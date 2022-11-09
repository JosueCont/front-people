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
import { ruleWhiteSpace } from '../../../utils/rules';
import { optionsStatusVacant } from '../../../utils/constant';

const SearchVacancies = ({
    load_clients_options,
    list_clients_options,
    currentNode,
    getVacancies,
    setJobbankFilters
}) => {

    const router = useRouter();
    const optionAll = [{value: 'all', key: 'all', label: 'Todos'}];
    const [formSearch] = Form.useForm();

    const createFilters = (obj) =>{
        let query = '';
        if(obj.job_position) query += `&job_position__unaccent__icontains=${obj.job_position}`;
        if(obj.status) query+= `&status=${obj.status}`;
        if(obj.customer) query += `&customer=${obj.customer}`;
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
        <Row gutter={[24,24]}>
            <Col span={20}>
                <Form
                    layout='inline'
                    onFinish={onFinishSearch}
                    form={formSearch}
                    style={{width: '100%'}}
                >
                    <Row style={{width: '100%'}}>
                        <Col span={10}>
                            <Form.Item
                                name='job_position'
                                rules={[ruleWhiteSpace]}
                                style={{marginBottom: 0}}
                            >
                                <Input placeholder='Buscar por nombre'/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name='status'
                                style={{marginBottom: 0}}
                            >
                                <Select
                                    allowClear
                                    placeholder='Seleccionar un estatus'
                                    options={optionsStatusVacant}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name='customer'
                                style={{marginBottom: 0}}
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
            <Col span={4}style={{display: 'flex', justifyContent: 'flex-end'}}>
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
        getVacancies,
        setJobbankFilters
    }
)(SearchVacancies)