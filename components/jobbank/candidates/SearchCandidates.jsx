import React, { useState } from 'react';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { ruleWhiteSpace } from '../../../utils/rules';
import { getCandidates } from '../../../redux/jobBankDuck';

const SearchCandidates = ({
    currentNode,
    getCandidates
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();

    const createQuerys = (obj) =>{
        let query = '';
        if(obj.name) query += `&name__icontains=${obj.name}`;
        return query;
    }

    const onFinishSearch = (values) =>{
        const query = createQuerys(values);
        // if(query) getCandidates(currentNode.id, query);
        // else deleteFilter();
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        // getCandidates(currentNode.id);
    }

    return (
        <Row gutter={[24,24]}>
            <Col xs={18} xxl={14}>
                <Form onFinish={onFinishSearch} form={formSearch} layout='inline' style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col span={20}>
                            <Form.Item
                                name='name'
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
                <Button onClick={()=> router.push('/jobbank/candidates/add')}>Agregar</Button>
            </Col>
        </Row>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState,{ getCandidates }
)(SearchCandidates)