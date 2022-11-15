import React, { useState, useEffect } from 'react';
import { Table, Tabs, Card, Row, Col, Button, Input, Form } from 'antd';
import { useRouter } from 'next/router';
import {
    SearchOutlined,
    SyncOutlined,
    SettingOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { valueToFilter } from '../../../utils/functions';
import { ruleWhiteSpace } from '../../../utils/rules';
import { useCatalog } from './hook/useCatalog';

const ListCatalogs = () => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const { catalogsJobbank } = useCatalog();
    const [listCatalogs, setLisCatalogs] = useState(catalogsJobbank);
    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) =>{
        if(!values.name) return false;
        setLoading(true)
        const search = item => valueToFilter(item.name).includes(valueToFilter(values.name));
        let results = catalogsJobbank.filter(search);
        setTimeout(()=>{
            setLisCatalogs(results);
            setLoading(false);
        },1000)
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        setLoading(true);
        setTimeout(() => {
            setLisCatalogs(catalogsJobbank);
            setLoading(false);
        },1000);
    }

    const redirect = (item) =>{
        let url = `/jobbank/settings/catalogs/${item.catalog}`;
        router.push(url);
    }

    const columns = [
        {
            title: 'Catálogo',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Acciones',
            render: (item) =>{
                return(
                    <SettingOutlined onClick={()=> redirect(item)}/>
                )
            }
        }
    ]

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <Row gutter={[24,24]}>
                    <Col span={12}>
                        <Form
                            onFinish={onFinishSearch}
                            form={formSearch}
                            layout='inline'
                            style={{width: '100%'}}
                        >
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
                    <Col span={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={()=> router.replace('/jobbank/settings')}
                        >
                            Regresar
                        </Button>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Table
                    size='small'
                    loading={loading}
                    columns={columns}
                    dataSource={listCatalogs}
                    pagination={{
                        hideOnSinglePage: true,
                        showSizeChanger: false
                    }}
                />
            </Col>
        </Row>
    )
}

export default ListCatalogs