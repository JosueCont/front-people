import React, { useEffect } from 'react';
import { Button, Input, Row, Col, Form, Select, Tooltip} from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { ruleWhiteSpace } from '../../../utils/rules';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';

const SearchClients = ({
    user,
    currentNode
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();

    useEffect(()=>{
        formSearch.setFieldsValue(router.query);
    },[router])

    const onFinishSearch = (values) =>{
        let filters = createFiltersJB(values);
        router.replace({
            pathname: '/jobbank/clients/',
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace('/jobbank/clients', undefined, {shallow: true});
    }

    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={20}>
                    <Form
                        onFinish={onFinishSearch}
                        form={formSearch}
                        layout='inline'
                        style={{width: '100%'}}
                    >
                        <Row style={{width: '100%'}}>
                            <Col span={14}>
                                <Form.Item
                                    name='name__unaccent__icontains'
                                    rules={[ruleWhiteSpace]}
                                    style={{marginBottom: 0}}
                                >
                                    <Input placeholder='Buscar por nombre'/>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name='is_active'
                                    style={{marginBottom: 0}}
                                >
                                    <Select
                                        allowClear
                                        placeholder='Estatus'
                                    >
                                        <Select.Option value='true' key='true'>Activo</Select.Option>
                                        <Select.Option value='false' key='false'>Inactivo</Select.Option>
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
                <Col span={4} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button onClick={()=> router.push({
                        pathname: '/jobbank/clients/add',
                        query: router.query
                    })}>
                        Agregar
                    </Button>
                </Col>
            </Row>
        </>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
        user: state.userStore.user
    }
}

export default connect(mapState)(SearchClients);