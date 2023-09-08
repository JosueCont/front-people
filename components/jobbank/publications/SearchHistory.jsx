import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Form, Row, Col, Button, Card, Tooltip } from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
    ArrowLeftOutlined,
    SettingOutlined
} from '@ant-design/icons';
import moment from 'moment';
import TagFilters from '../TagFilters';
import FiltersHistory from './FiltersHistory';
import { createFiltersJB, getValueFilter } from '../../../utils/functions';

const SearchHistory = ({
    infoPublication = {},
    newFilters = {}
}) => {

    const {
        list_connections_options,
        load_connections_options
    } = useSelector(state => state.jobBankStore);
    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const formatDate = 'DD-MM-YYYY';

    const setFilters = (filters = {}) => router.replace({
        pathname: `/jobbank/publications/history/${router.query?.id}`,
        query: filters
    }, undefined, { shallow: true });

    const onFinishSearch = (values) => {
        let filters = { ...newFilters };
        filters['dates'] = values.dates
            ? `${values.dates[0].format(formatDate)},${values.dates[1].format(formatDate)}`
            : null;
        filters['account'] = values.account ?? null;
        let params = createFiltersJB(filters, ['id']);
        setFilters(params)
    }

    const deleteFilter = () => {
        formSearch.resetFields();
        setFilters()
    }

    const closeModal = () => {
        setOpenModal(false)
        formSearch.resetFields()
    }

    const actionBack = () => {
        router.push({
            pathname: '/jobbank/publications',
            query: newFilters
        })
    }

    const setDates = () => {
        let dates = router.query?.dates.split(',');
        return [moment(dates[0], formatDate), moment(dates[1], formatDate)];
    }

    const showModal = () => {
        let values = { ...router.query };
        values.dates = router.query?.dates ? setDates() : null;
        formSearch.setFieldsValue(values);
        setOpenModal(true)
    }

    const getAccount = (code) => getValueFilter({
        value: code,
        list: list_connections_options,
        keyEquals: 'code'
    })

    const getDates = (dates) => {
        let values = dates.split(',');
        let start = moment(values[0], formatDate).format(formatDate);
        let end = moment(values[1], formatDate).format(formatDate);
        return `${start} - ${end}`;
    }

    const listKeys = {
        account: {
            name: 'Cuenta',
            get: getAccount,
            loading: load_connections_options
        },
        dates: {
            name: 'Fecha',
            get: getDates
        }
    }

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                {Object.keys(infoPublication).length > 0 ?
                                    <>
                                        {infoPublication?.vacant?.job_position} / <span style={{ color: 'rgba(0,0,0,0.5)' }}>
                                            {infoPublication?.profile?.name ?? 'Personalizado'}
                                        </span>
                                    </>
                                    : <></>}
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
                                <Button
                                    onClick={() => actionBack()}
                                    icon={<ArrowLeftOutlined />}
                                >
                                    Regresar
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            listKeys={listKeys}
                            deleteKeys={['id']}
                            discardKeys={['id']}
                        />
                    </Col>
                </Row>
            </Card>
            <FiltersHistory
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchHistory