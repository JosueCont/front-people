import React, { useState } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
  SyncOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import TagFilters from '../../jobbank/TagFilters';
import { createFiltersJB } from '../../../utils/functions';
import { useFiltersIncapacity } from './useFiltersInpacity';
import FiltersIncapacity from './FiltersIncapacity';

const SearchIncapacity = () => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys } = useFiltersIncapacity();

    const showModal = () =>{
        let filters = {...router.query};
        filters.status = router.query?.status ? parseInt(router.query?.status) : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/comunication/requests/incapacity',
        query: filters
    }, undefined, {shallow: true});

    const onFinishSearch = (values) =>{
        let filters = createFiltersJB(values);
        setFilters(filters)
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        setFilters()
    }

    return (
        <>
            <Card bodyStyle={{padding: 12}}>
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Solicitudes
                            </p>
                            <div className='content-end' style={{gap: 8}}>
                                <Tooltip title='Configurar filtros'>
                                    <Button onClick={()=> showModal()}>
                                        <SettingOutlined />
                                    </Button>
                                </Tooltip>
                                <Tooltip title='Limpiar filtros'>
                                    <Button onClick={()=> deleteFilter()}>
                                        <SyncOutlined />
                                    </Button>
                                </Tooltip>
                                <Button onClick={()=> router.push('incapacity/new')}>
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            listKeys={listKeys}
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersIncapacity
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchIncapacity;