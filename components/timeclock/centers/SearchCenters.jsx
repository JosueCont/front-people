import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import TagFilters from '../../jobbank/TagFilters';
import FiltersCenters from './FiltersCenters';
import { useFiltersCenters } from './useFiltersCenters';
import { createFiltersJB } from '../../../utils/functions';

const SearchCenters = () => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listGets } = useFiltersCenters();

    const setFilters = (filters = {}) => router.replace({
        pathname: '/timeclock/centers',
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

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const showModal = () =>{
        let values = {...router.query};
        formSearch.setFieldsValue(values);
        setOpenModal(true)
    }

    return (
        <>
            <Card bodyStyle={{padding: 12}}>
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Centros de trabajo
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
                                <Button onClick={()=> router.push({
                                    pathname: '/timeclock/centers/add',
                                    query: router.query
                                })}>
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
            <FiltersCenters
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchCenters;