import React from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Input, Button, Form, Tooltip } from 'antd';
import { ruleWhiteSpace } from '../../../utils/rules';
import { createFiltersJB } from '../../../utils/functions';
import {
    SearchOutlined,
    SyncOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';

const SearchCatalogs = ({
    actionBtnAdd = ()=>{},
    keyName = 'name__unaccent__icontains',
    showBtnAdd = true,
    backURl = '/jobbank/settings/catalogs',
    disabledAdd = false,
    msgAdd = ''
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const url = router.asPath?.split('?')[0];

    useEffect(()=>{
        formSearch.setFieldsValue(router.query);
    },[router.query])

    const onFinish = (values) =>{
        let filters = createFiltersJB(values);
        router.replace({
            pathname: url,
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace(url, undefined, {shallow: true});
    }

    return (
        <Form
            onFinish={onFinish}
            form={formSearch}
            layout='inline'
            style={{width: '100%'}}
        >
            <Row style={{width: '100%'}}>
                <Col span={8}>
                    <Form.Item
                        name={keyName}
                        rules={[ruleWhiteSpace]}
                        style={{marginBottom: 0}}
                    >
                        <Input placeholder='Buscar por nombre'/>
                    </Form.Item>
                </Col>
                <Col span={8} style={{display: 'flex', gap: '8px'}}>
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
                </Col>
                <Col span={8}>
                    <div className='content-end' style={{gap: 8}}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={()=> router.push(backURl)}
                        >
                            Regresar
                        </Button>
                        {showBtnAdd && (
                            <Tooltip title={msgAdd}>
                                <Button
                                    disabled={disabledAdd}
                                    onClick={()=> actionBtnAdd()}
                                >
                                    Agregar
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                </Col>
            </Row>
        </Form>
    )
}

export default SearchCatalogs