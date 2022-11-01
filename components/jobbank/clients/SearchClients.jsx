import React, { useState, useEffect } from 'react';
import { Button, Input, Row, Col, message} from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import ModalClients from './ModalClients';
import { connect } from 'react-redux';
import { getClients } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';

const SearchClients = ({
    user,
    currentNode,
    getClients
}) => {

    const [openModal, setOpenModal] = useState(false);
    const [toSearch, setToSearch] = useState('');
    
    const onFinish = async (values) =>{
        try {
            values.append('node', currentNode.id);
            values.append('registered_by', user.id);
            values.append('is_active', true);
            await WebApiJobBank.createClient(values);
            getClients(currentNode?.id)
            message.success('Cliente agregado');
        } catch (e) {
            console.log(e)
            if(e.response?.data['rfc']) message.error('Ya existe un cliente con el mismo RFC');
            else message.error('Cliente no agregado');
        }
    }

    const onFinishSearch = () =>{
        if(toSearch.trim()){
            let query = `&name__icontains=${toSearch.trim()}`;
            getClients(currentNode.id, query);
        } else deleteFilter();
    }

    const deleteFilter = () =>{
        setToSearch('')
        getClients(currentNode.id)
    }

    return (
        <>
            <Row gutter={[24,24]}>
                <Col xs={18} sm={18} md={16} lg={12} style={{display: 'flex', gap: '16px'}}>
                    <Input
                        value={toSearch}
                        placeholder={'Buscar por nombre'}
                        onChange={e=> setToSearch(e.target.value)}
                    />
                    <Button onClick={()=> onFinishSearch()}>
                        <SearchOutlined />
                    </Button>
                    <Button onClick={()=> deleteFilter()}>
                        <SyncOutlined />
                    </Button>
                </Col>
                <Col xs={6} sm={6} md={8}  lg={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
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