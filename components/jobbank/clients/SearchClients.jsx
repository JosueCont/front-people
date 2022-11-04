import React, { useState, useEffect } from 'react';
import { Button, Input, Row, Col, message, Form} from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import ModalClients from './ModalClients';
import { connect } from 'react-redux';
import { getClients } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { ruleWhiteSpace } from '../../../utils/rules';

const SearchClients = ({
    user,
    currentNode,
    getClients
}) => {

    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    
    const onFinish = async (values) =>{
        try {
            values.append('node', currentNode.id);
            values.append('registered_by', user.id);
            await WebApiJobBank.createClient(values);
            getClients(currentNode?.id)
            message.success('Cliente agregado');
        } catch (e) {
            console.log(e)
            if(e.response?.data['rfc']) message.error('Ya existe un cliente con el mismo RFC');
            else message.error('Cliente no agregado');
        }
    }

    const createQuerys = (obj) =>{
        let query = '';
        if(obj.name) query += `&name__unaccent__icontains=${obj.name}`;
        return query;
    }

    const onFinishSearch = (values) =>{
        const query = createQuerys(values);
        if(query) getClients(currentNode.id, query);
        else deleteFilter();
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        getClients(currentNode.id);
    }

    return (
        <>
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
                    <Button onClick={()=> setOpenModal(true)}>Agregar</Button>
                </Col>
            </Row>
            <ModalClients
                title={'Agregar cliente'}
                actionForm={onFinish}
                close={()=> setOpenModal(false)}
                visible={openModal}
            />
        </>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
        user: state.userStore.user
    }
}

export default connect(mapState, { getClients })(SearchClients);