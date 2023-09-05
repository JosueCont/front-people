import React, { useMemo, useState, useEffect } from 'react'
import { Button, Row, Col, Form, Card, Menu, Dropdown } from 'antd';
import {
    SyncOutlined,
    SettingOutlined,
    ArrowLeftOutlined,
    EllipsisOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import FiltersHistory from './FiltersHistory';
import { createFiltersJB } from '../../../../utils/functions';
import TagFilters from '../../../jobbank/TagFilters';
import { useFiltersHistory } from './useFiltersHistory';

const SearchHistory = ({
    title = '',
    newFilters
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listData } = useFiltersHistory();

    const setFilters = (filters = {}) => router.replace({
        pathname: '/structure/catalogs/history',
        query: filters
    }, undefined, { shallow: true });

    const onFinishSearch = (values) => {
        let filters = createFiltersJB(values);
        setFilters({ ...newFilters, ...filters })
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
        let values = { ...router.query };
        formSearch.setFieldsValue(values);
        setOpenModal(true)
    }

    const defaultFilters = useMemo(()=>{
        let value = router.query?.is_current;
        return {'¿Es actual?' : value ? listKeys.is_current.get(value) : 'Sí'};
    },[router.query?.is_current])

    const MenuOptions = (
        <Menu>
            <Menu.Item
                key='1'
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/structure/catalogs')}
            >
                Regresar
            </Menu.Item>
            <Menu.Item
                key='3'
                icon={<SettingOutlined />}
                onClick={() => showModal()}
            >
                Configurar filtros
            </Menu.Item>
            <Menu.Item
                key='4'
                icon={<SyncOutlined />}
                onClick={() => deleteFilter()}
            >
                Limpiar filtros
            </Menu.Item>
        </Menu>
    )

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <div className='content_title_requets'>
                                <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                    {title}
                                </p>
                            </div>
                            <div className='content-end' style={{ gap: 8 }}>
                                <Dropdown
                                    placement='bottomRight'
                                    overlay={MenuOptions}
                                >
                                    <Button>
                                        <EllipsisOutlined />
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            discardKeys={['catalog', 'is_current']}
                            deleteKeys={['catalog']}
                            listKeys={listKeys}
                            defaultFilters={defaultFilters}
                        />
                    </Col>
                </Row>
            </Card>
            <FiltersHistory
                listData={listData}
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchHistory;