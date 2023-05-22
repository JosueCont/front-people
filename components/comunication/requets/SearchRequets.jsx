import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
  SyncOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { useRouter } from 'next/router';
import TagFilters from '../../jobbank/TagFilters';
import { createFiltersJB } from '../../../utils/functions';
import FiltersRequests from './FiltersRequests';
import { useFiltersRequests } from './useFiltersRequests';

const SearchRequests = () => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listGets, listKeys } = useFiltersRequests();
    const format = 'YYYY-MM-DD';

    const formatRange = () =>{
        let dates = router.query?.range?.split(',');
        return [moment(dates[0], format), moment(dates[1], format)];
    }

    const showModal = () =>{
        let filters = {...router.query};
        filters.range = router.query?.range ? formatRange() : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/comunication/requests/holidays',
        query: filters
    }, undefined, {shallow: true});

    const onFinishSearch = (values) =>{
        values.range = values.range ?
            `${values.range[0].format(format)},${values.range[1].format(format)}` : null;
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
                                <Button onClick={()=> router.push('holidays/new')}>
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
            <FiltersRequests
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchRequests;