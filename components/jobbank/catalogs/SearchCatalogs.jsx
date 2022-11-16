import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Form, Button } from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { ruleWhiteSpace } from '../../../utils/rules';
import { valueToFilter } from '../../../utils/functions';
import ModalCatalogs from './ModalCatalogs';
import { useCatalog } from './hook/useCatalog';

const SearchCatalogs = () => {

    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { infoCatalog, currentCatalog, setCurrentCatalog } = useCatalog();

    const onFinishSearch = (values) =>{
        if(!values.name) return;
        setCurrentCatalog({...currentCatalog, loading: true});
        const _filter = item => valueToFilter(item.name).includes(valueToFilter(values.name));
        let results = infoCatalog.results?.filter(_filter);
        setTimeout(()=>{
            setCurrentCatalog({results, loading: false})
        },2000)
        
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        setCurrentCatalog({
            results: infoCatalog.results,
            loading: false
        });
    }

    return (
        <>
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
                    <Button onClick={()=> setOpenModal(true)}>
                        Agregar
                    </Button>
                </Col>
            </Row>
            <ModalCatalogs
                title={`Agregar ${infoCatalog.titleModal}`}
                close={()=> setOpenModal(false)}
                actionForm={infoCatalog.actionCreate}
                visible={openModal}
            />
        </>
    )
}

export default SearchCatalogs