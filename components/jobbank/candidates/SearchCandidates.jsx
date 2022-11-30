import React, { useState, useEffect } from 'react';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { onlyNumeric, ruleWhiteSpace } from '../../../utils/rules';
import { createFiltersJB } from '../../../utils/functions';

const SearchCandidates = ({
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
            pathname: '/jobbank/candidates/',
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace('/jobbank/candidates', undefined, {shallow: true});
    }

    return (
        <Form onFinish={onFinishSearch} form={formSearch} layout='inline' style={{width: '100%'}}>
            <Row gutter={[0,8]} style={{width: '100%'}}>
                <Col xs={12} md={8} xl={5}>
                    <Form.Item
                        name='fisrt_name__icontains'
                        rules={[ruleWhiteSpace]}
                        style={{marginBottom: 0}}
                    >
                        <Input placeholder='Buscar por nombre'/>
                    </Form.Item>
                </Col>
                <Col xs={12} md={8} xl={5}>
                    <Form.Item
                        name='last_name__icontains'
                        rules={[ruleWhiteSpace]}
                        style={{marginBottom: 0}}
                    >
                        <Input placeholder='Buscar por apellidos'/>
                    </Form.Item>
                </Col>
                <Col xs={12} md={8} xl={5}>
                    <Form.Item
                        name='email__icontains'
                        rules={[ruleWhiteSpace]}
                        style={{marginBottom: 0}}
                    >
                        <Input placeholder='Buscar por correo'/>
                    </Form.Item>
                </Col>
                <Col xs={12} md={8} xl={5}>
                    <Form.Item
                        name='cell_phone'
                        rules={[onlyNumeric]}
                        style={{marginBottom: 0}}
                    >
                        <Input placeholder='Buscar por teléfono'/>
                    </Form.Item>
                </Col>
                {/* <Col xs={12} md={8} xl={4}>
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
                </Col> */}
                <Col xs={12} sm={23} md={23} xl={4} style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto', gap: 8}}>
                    <div style={{display: 'flex', gap: 8}}>
                        <Button htmlType='submit'>
                            <SearchOutlined />
                        </Button>
                        <Button onClick={()=> deleteFilter()}>
                            <SyncOutlined />
                        </Button>
                    </div>
                    <Button onClick={()=> router.push({
                        pathname: '/jobbank/candidates/add',
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
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(SearchCandidates)