import React, { useState } from 'react';
import { Button, Row, Col, Form, Tooltip, Card } from 'antd';
import {
    SyncOutlined,
    SettingOutlined,
    TableOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import TagFilters from '../../jobbank/TagFilters';
import FiltersAssessments from './FiltersAssessments';

const SearchAssessments = ({
    actionAdd = () => { }
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);

    const showModal = () => {
        let filters = { ...router.query };
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/kuiz/assessments/',
        query: filters
    }, undefined, { shallow: true });

    const onFinishSearch = (values) => {
        let filters = createFiltersJB(values);
        setFilters(filters)
    }

    const deleteFilter = () => {
        formSearch.resetFields()
        setFilters()
    }

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                Evaluaciones
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
                                <Button onClick={() => actionAdd()}>
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            listKeys={{
                                name: {
                                    name: 'Nombre',
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
            <FiltersAssessments
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchAssessments;