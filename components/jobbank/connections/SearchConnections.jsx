import React, { useEffect } from 'react';
import { Button, Input, Row, Col, Form, Select, Tooltip} from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { ruleWhiteSpace } from '../../../utils/rules';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';

const SearchConnections = ({
    currentNode
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();

    useEffect(()=>{
        formSearch.setFieldsValue(router.query);
    },[router.query])

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
                        <Button
                            icon={<ArrowLeftOutlined/>}
                            onClick={()=> router.push({
                                pathname: '/jobbank/settings',
                            })}
                        >
                            Regresar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(mapState)(SearchConnections);