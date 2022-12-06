import React from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Input, Button, Form } from 'antd';
import { ruleWhiteSpace } from '../../../utils/rules';
import { createFiltersJB } from '../../../utils/functions';
import {
    SearchOutlined,
    SyncOutlined
} from '@ant-design/icons';

const SearchCatalogs = ({
    setOpenModal,
    actionBtn,
    textBtn = 'Agregar',
    iconBtn = <></>
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const url = router.asPath?.split('?')[0];

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
                        name='name__unaccent__icontains'
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
                <Col span={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button icon={iconBtn} onClick={()=> actionBtn ? actionBtn() : setOpenModal(true)}>
                        {textBtn}
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default SearchCatalogs