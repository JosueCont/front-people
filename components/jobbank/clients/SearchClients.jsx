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
    currentNode,
    getClients
}) => {

    const [openModal, setOpenModal] = useState(false);

    const onFinish = async (values) =>{
        try {
            await WebApiJobBank.createClient(values);
            getClients(currentNode?.id)
            message.success('Cliente agregado');
        } catch (e) {
            message.error('Cliente no agregado');
            console.log(e)
        }
    }

    return (
        <>
            <Row gutter={[24,24]}>
                <Col xs={18} sm={18} md={16} lg={12} style={{display: 'flex', gap: '16px'}}>
                    <Input placeholder={'Buscar por nombre'}/>
                    <Button icon={<SearchOutlined />} onClick={()=> onFinishSearch()}/>
                    <Button icon={<SyncOutlined />} onClick={()=> deleteFilter()} />
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
    }
}

export default connect(mapState, { getClients })(SearchClients);