import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
    SyncOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import FiltersApplications from './FiltersApplications';
import TagFilters from '../TagFilters';
import { useFiltersApplications } from '../hook/useFiltersApplications';
import moment from 'moment';

const SearchApplications = ({
    currentNode
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listData } = useFiltersApplications();
    const format = 'YYYY-MM-DD';

    const formatRange = () => {
        let dates = router.query?.date?.split(',');
        return [moment(dates[0], format), moment(dates[1], format)];
    }

    const showModal = () => {
        let filters = { ...router.query };
        filters.status = router.query?.status ? parseInt(router.query.status) : null;
        filters.date = router.query?.date ? formatRange() : null;
        filters.candidate = router.query?.candidate ? parseInt(router.query?.candidate) : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/jobbank/applications/',
        query: filters
    }, undefined, { shallow: true });

    const onFinishSearch = (values) => {
        values.date = values.date
            ? `${values.date[0].format(format)},${values.date[1].format(format)}`
            : null;
        let filters = createFiltersJB(values);
        setFilters(filters)
    }

    const deleteFilter = () => {
        formSearch.resetFields();
        setFilters()
    }

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                Postulaciones
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
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters listKeys={listKeys} />
                    </Col>
                </Row>
            </Card>
            <FiltersApplications
                listData={listData}
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(SearchApplications)