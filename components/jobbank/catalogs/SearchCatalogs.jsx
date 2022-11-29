import React from 'react';
import { Row, Col, Input, Button, Form } from 'antd';
import { ruleWhiteSpace } from '../../../utils/rules';
import { valueToFilter } from '../../../utils/functions';
import {
    SearchOutlined,
    SyncOutlined
} from '@ant-design/icons';

const SearchCatalogs = ({
    listComplete,
    setItemsFilter,
    setLoading,
    setOpenModal,
    actionBtn,
    textBtn = 'Agregar',
    iconBtn = <></>
}) => {

    const [formSearch] = Form.useForm();

    const onFinish = (values) =>{
        if(!values.name) return false;
        setLoading(true)
        const search = item => valueToFilter(item.name).includes(valueToFilter(values.name));
        let results = listComplete.filter(search);
        setTimeout(()=>{
            setItemsFilter(results);
            setLoading(false);
        },1000)
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        setLoading(true);
        setTimeout(() => {
            setItemsFilter(listComplete);
            setLoading(false);
        },1000);
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