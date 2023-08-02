import React, { useState } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
    SyncOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import TagFilters from '../TagFilters';
import FiltersClients from './FiltersClients';

const SearchClients = () => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);

    const setFilters = (filters = {}) => router.replace({
        pathname: '/jobbank/clients',
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
        formSearch.setFieldsValue(router.query);
        setOpenModal(true)
    }

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                Clientes
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
                                    pathname: '/jobbank/clients/add',
                                    query: router.query
                                })}>
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            listKeys={{
                                name__unaccent__icontains: {
                                    name: 'Nombre'
                                },
                                is_active: {
                                    name: 'Estatus',
                                    get: e => e == 'true'
                                        ? 'Activo' : 'Inactivo'
                                }
                            }}
                        />
                    </Col>
                </Row>
            </Card>
            <FiltersClients
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchClients