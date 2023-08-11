import React, { useMemo, useState, useEffect } from 'react'
import { Button, Row, Col, Form, Card, Tooltip, Input } from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
    SettingOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../../utils/functions';
import TagFilters from '../../../jobbank/TagFilters';
import FiltersLevels from './FiltersLeves';
import { useFiltersLevels } from './useFiltersLevels';

const SearchLevels = ({
    title = '',
    actionAdd = () => { }
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [valueSearch, setValueSearch] = useState('');
    const { listKeys } = useFiltersLevels();

    const view = router.query?.tree;

    useEffect(() => {
        let value = router.query?.search;
        setValueSearch(value || '')
    }, [router.query?.search])

    const setFilters = (filters = {}) => router.replace({
        pathname: '/structure/catalogs/levels',
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
        let values = { ...router.query };
        values.parent = values?.parent ? parseInt(values?.parent) : null;
        values.is_active = values.is_active ? values.is_active : 'true';
        formSearch.setFieldsValue(values);
        setOpenModal(true)
    }

    const onGeneralSearch = () => {
        let status = router.query?.is_active;
        let params = { search: valueSearch };
        if (status == 'all') params.is_active = status;
        if(view) params.tree = view;
        let filters = createFiltersJB(params);
        setFilters(filters)
    }

    const onChangeSearch = ({ target }) => {
        setValueSearch(target.value?.trim())
    }

    const defaultFilters = useMemo(() => {
        let query = router.query?.is_active;
        let value = query ? listKeys.is_active.get(query) : 'Activo';
        return { 'Estatus': value }
    }, [router.query?.is_active])

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
                                <Input.Group style={{ width: 300 }} compact>
                                    <Input
                                        allowClear
                                        className='input-jb-clear'
                                        placeholder='Búsqueda general'
                                        value={valueSearch}
                                        onChange={onChangeSearch}
                                        onPressEnter={onGeneralSearch}
                                        style={{
                                            width: 'calc(100% - 32px)',
                                            borderTopLeftRadius: '10px',
                                            borderBottomLeftRadius: '10px'
                                        }}
                                    />
                                    <button
                                        className='ant-btn-simple'
                                        onClick={() => onGeneralSearch()}
                                        style={{
                                            borderTopRightRadius: '10px',
                                            borderBottomRightRadius: '10px'
                                        }}
                                    >
                                        <SearchOutlined />
                                    </button>
                                </Input.Group>
                            </div>
                            <div className='content-end' style={{ gap: 8 }}>
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => router.push('/structure/catalogs')}>
                                    Regresar
                                </Button>
                                <Button onClick={() => setFilters({
                                    tree: !(view && view == 'true')
                                })}>
                                    {view == 'true' ? 'Vista tabla' : 'Vista árbol'}
                                </Button>
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
                            discardKeys={['catalog', 'is_active', 'search','tree']}
                            deleteKeys={['catalog']}
                            listKeys={listKeys}
                            defaultFilters={defaultFilters}
                        />
                    </Col>
                </Row>
            </Card>
            <FiltersLevels
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchLevels;