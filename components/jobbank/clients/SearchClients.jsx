import React, { useState, useEffect } from 'react';
import { Button, Input, Row, Col, message, Form, Select, Tooltip} from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import ModalClients from './ModalClients';
import { connect } from 'react-redux';
import {
    getClients,
    setJobbankFilters
} from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { ruleWhiteSpace } from '../../../utils/rules';

const SearchClients = ({
    user,
    currentNode,
    getClients,
    setJobbankFilters
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
            return true;
        } catch (e) {
            console.log(e)
            if(e.response?.data['rfc']){
                message.error('RFC ya registrado');
                return 'RFC_EXIST';
            } else message.error('Cliente no agregado');
            return false;
        }
    }

    const createFilters = (obj) =>{
        let query = '';
        if(obj.name) query += `&name__unaccent__icontains=${obj.name}`;
        if(obj.is_active !== undefined) query += `&is_active=${obj.is_active}`;
        return query;
    }

    const onFinishSearch = (values) =>{
        let filters = createFilters(values);
        if(filters){
            setJobbankFilters(filters)
            getClients(currentNode.id, filters);
        }else deleteFilter();
    }

    const deleteFilter = () =>{
        setJobbankFilters("")
        formSearch.resetFields();
        getClients(currentNode.id);
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
                                    name='name'
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
                                        <Select.Option value={true} key={true}>Activo</Select.Option>
                                        <Select.Option value={false} key={false}>Inactivo</Select.Option>
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
                <Col span={4} style={{display: 'flex', justifyContent: 'flex-end'}}>
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

export default connect(
    mapState,{
        getClients,
        setJobbankFilters
    }
)(SearchClients);