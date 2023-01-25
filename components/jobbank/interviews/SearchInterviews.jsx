import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip, Radio, Select } from 'antd';
import {
  SyncOutlined,
  SettingOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import TagFilters from '../TagFilters';
import FiltersInterviews from './FiltersInterviews';
import { useFiltersInterviews } from '../hook/useFiltersInterviews';
import moment from 'moment';

const SearchInterviews = () => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listGets } = useFiltersInterviews();

    const showModal = () =>{
        let filters = {...router.query};
        filters.candidate = router.query?.candidate ? parseInt(router.query?.candidate) : null;
        filters.date = router.query?.date ? moment(router.query?.date, 'DD-MM-YYYY') : null;
        filters.status = router.query?.status ? parseInt(router.query?.status) : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/jobbank/interviews',
        query: filters
    }, undefined, {shallow: true});

    const onFinishSearch = (values) =>{
        let filters = createFiltersJB(values);
        setFilters(filters);
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
                        <div className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Listado de entrevistas
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
                                <Tooltip title='Ver calendario'>
                                    <Button onClick={()=> router.push({
                                        pathname: '/jobbank/interviews/calendar',
                                        query: router.query
                                    })}>
                                        <CalendarOutlined />
                                    </Button>
                                </Tooltip>
                                <Button>
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            listKeys={listKeys}
                            listGets={listGets}
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersInterviews
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchInterviews;