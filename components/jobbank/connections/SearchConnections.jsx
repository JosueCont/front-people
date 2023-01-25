import React, { useEffect, useState } from 'react';
import { Button, Input, Row, Col, Form, Tooltip, message} from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { ruleWhiteSpace } from '../../../utils/rules';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import ModalConnection from './ModalConnection';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { getConnections } from '../../../redux/jobBankDuck';

const SearchConnections = ({
    currentNode,
    jobbank_page,
    jobbank_filters,
    getConnections
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);

    useEffect(()=>{
        formSearch.setFieldsValue(router.query);
    },[router.query])

    const actionCreate = async (values) =>{
        try {
            values.append('node', currentNode.id);
            await WebApiJobBank.createConnection(values);
            getConnections(currentNode.id, jobbank_filters, jobbank_page);
            message.success('Conexión registrada');
        } catch (e) {
            console.log(e)
            message.error('Conexión no registrada');
        }
    }

    const onFinishSearch = (values) =>{
        let filters = createFiltersJB(values);
        router.replace({
            pathname: '/jobbank/settings/connections',
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace('/jobbank/settings/connections', undefined, {shallow: true});
    }

    return (
        <>
            <Form
                layout='inline'
                onFinish={onFinishSearch}
                form={formSearch}
                style={{width: '100%'}}
            >
                <Row gutter={[0,8]} style={{width: '100%'}}>
                    <Col xs={24} sm={12} md={12} xl={12}>
                        <Form.Item
                            name='name__unaccent__icontains'
                            rules={[ruleWhiteSpace]}
                            style={{marginBottom: 0}}
                        >
                            <Input placeholder='Buscar por nombre'/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} xl={12} style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto', gap: 8}}>
                        <div style={{display: 'flex', gap: 8}}>
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
                        </div>
                        <div style={{display: 'flex', gap: 8}}>
                            <Button
                                icon={<ArrowLeftOutlined/>}
                                onClick={()=> router.push({
                                    pathname: '/jobbank/settings',
                                })}
                            >
                                Regresar
                            </Button>
                            <Button onClick={()=> setOpenModal(true)}>
                                Agregar
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
            <ModalConnection
                visible={openModal}
                title='Agregar conexión'
                actionForm={actionCreate}
                close={()=> setOpenModal(false)}
            />
        </>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        jobbank_page: state.jobBankStore.jobbank_page
    }
}

export default connect(mapState,{getConnections})(SearchConnections);