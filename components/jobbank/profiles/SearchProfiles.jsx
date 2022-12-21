import React, { useEffect } from 'react'
import { Button, Input, Row, Col, Form, Select, Tooltip } from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { ruleWhiteSpace } from '../../../utils/rules';
import { createFiltersJB } from '../../../utils/functions';

const SearchProfiles = ({
    currentNode,
    load_clients_options,
    list_clients_options
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();

    useEffect(()=>{
        formSearch.setFieldsValue(router.query);
    },[router])

    const onFinishSearch = (values) =>{
        let filters = createFiltersJB(values);
        router.replace({
            pathname: '/jobbank/profiles/',
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace('/jobbank/profiles', undefined, {shallow: true});
    }

    return (
        <Row gutter={[24,24]}>
            <Col xs={18} xxl={14}>
                <Form onFinish={onFinishSearch} form={formSearch} layout='inline' style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col span={12}>
                            <Form.Item
                                name='name__unaccent__icontains'
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
                        </Col>
                    </Row>
                </Form>
            </Col>
            <Col xs={6} xxl={10} style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button onClick={()=> router.push({
                    pathname: '/jobbank/profiles/add',
                    query: router.query
                })}>
                    Agregar
                </Button>
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

export default connect(mapState)(SearchProfiles)