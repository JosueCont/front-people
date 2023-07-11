import React, { useState } from 'react';
import { Button, Row, Col, Form, Tooltip, Card, Menu } from 'antd';
import {
    SyncOutlined,
    SettingOutlined,
    EllipsisOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../utils/functions';
import TagFilters from '../jobbank/TagFilters';
import FiltersPeople from './FiltersPeople';
import { useFiltersPeople } from './useFiltersPeople';
import OptionsPeople from './OptionsPeople';
import DownloadPeople from './options/DownloadPeople';
import ImportPeople from './options/ImportPeople';

const SearchPeople = () => {

    const {
        permissions
    } = useSelector(state => state.userStore);

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listGets } = useFiltersPeople();

    const showModal = () => {
        let filters = { ...router.query };
        filters.gender = router.query?.gender ? parseInt(router.query?.gender) : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/home/persons/copy',
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

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                Personas
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
                                <OptionsPeople/>
                                {permissions.person?.create && (
                                    <Button>
                                        Agregar
                                    </Button>
                                )}
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
            <FiltersPeople
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchPeople