import React, { useState, useEffect } from 'react';
import { Button, Input, Row, Col, message, Form} from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { ruleWhiteSpace } from '../../../utils/rules';

const SearchCatalogs = ({
    user,
    currentNode
}) => {

    const [formSearch] = Form.useForm();

    const createQuerys = (obj) =>{
        let query = '';
        if(obj.name) query += `&name__icontains=${obj.name}`;
        return query;
    }

    const onFinishSearch = (values) =>{
        const query = createQuerys(values);
        // if(query) getClients(currentNode.id, query);
        // else deleteFilter();
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        // getClients(currentNode.id);
    }

    return (
        <Row gutter={[24,24]}>
            <Col span={24}>
                <Form onFinish={onFinishSearch} form={formSearch} layout='inline' style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col span={16}>
                            <Form.Item
                                name='name'
                                rules={[ruleWhiteSpace]}
                                style={{marginBottom: 0}}
                            >
                                <Input placeholder='Buscar por nombre'/>
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{display: 'flex', gap: '8px'}}>
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
        </Row>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
        user: state.userStore.user
    }
}

export default connect(mapState)(SearchCatalogs);