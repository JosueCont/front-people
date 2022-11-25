import React, { useState, useEffect } from 'react';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { ruleWhiteSpace } from '../../../utils/rules';
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
        <Row gutter={[24,24]}>
            <Col xs={18} xxl={14}>
                <Form onFinish={onFinishSearch} form={formSearch} layout='inline' style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col span={20}>
                            <Form.Item
                                name='name__unaccent__icontains'
                                rules={[ruleWhiteSpace]}
                                style={{marginBottom: 0}}
                            >
                                <Input placeholder='Buscar por nombre'/>
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
                <Button onClick={()=> router.push({
                    pathname: '/jobbank/candidates/add',
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
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(SearchCandidates)