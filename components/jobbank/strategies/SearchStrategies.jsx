import React, { useEffect, useState } from 'react';
import {
    SyncOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import TagFilters from '../TagFilters';
import FiltersStrategies from './FiltersStrategies';
import { useFiltersStrategies } from '../hook/useFiltersStrategies';

const SearchStrategies = () => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys } = useFiltersStrategies();

    const setFilters = (filters = {}) => router.replace({
        pathname: '/jobbank/strategies',
        query: filters
    }, undefined, { shallow: true });

    const onFinishSearch = (values) => {
        let filters = createFiltersJB(values);
        setFilters(filters)
    }

    const deleteFilter = () => {
        formSearch.resetFields();
        setFilters()
    }

    const closeModal = () => {
        setOpenModal(false)
        formSearch.resetFields()
    }

    const showModal = () => {
        let filters = { ...router.query };
        filters.vacant__status = router.query?.vacant__status ? parseInt(router.query?.vacant__status) : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                Estrategias
                            </p>
                            <div className='content-end' style={{ gap: 8 }}>
                                <Tooltip title='Configurar filtros'>
                                    <Button onClick={() => showModal()}>
                                        <SettingOutlined />
                                    </Button>
                                </Tooltip>
                                <Tooltip title='Limpiar filtros'>
                                    <Button onClick={() => deleteFilter()}>
                                        <SyncOutlined />
                                    </Button>
                                </Tooltip>
                                <Button onClick={() => router.push({
                                    pathname: '/jobbank/strategies/add',
                                    query: router.query
                                })}>
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters listKeys={listKeys} />
                    </Col>
                </Row>
            </Card>
            <FiltersStrategies
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchStrategies