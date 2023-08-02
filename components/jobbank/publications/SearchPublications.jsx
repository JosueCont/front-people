import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import TagFilters from '../TagFilters';
import FiltersPublications from './FiltersPublications';
import { useFiltersPublications } from '../hook/useFiltersPublications';

const SearchPublications = ({
    load_vacancies_options,
    list_vacancies_options,
    load_profiles_options,
    list_profiles_options,
    list_connections_options,
    load_connections_options,
    currentNode
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys } = useFiltersPublications();

    const setFilters = (filters = {}) => router.replace({
        pathname: '/jobbank/publications',
        query: filters
    }, undefined, {shallow: true});

    const onFinishSearch = (values) =>{
        values.account_to_share = values.account_to_share?.length > 0
            ? JSON.stringify(values.account_to_share) : null;
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
        if(values.vacant__status) values.vacant__status = parseInt(values.vacant__status);
        if(values.account_to_share?.trim()) values.account_to_share = JSON.parse(values.account_to_share);
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
                                Publicaciones
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
                                    pathname: '/jobbank/publications/add',
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
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersPublications
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
        load_vacancies_options: state.jobBankStore.load_vacancies_options,
        list_vacancies_options: state.jobBankStore.list_vacancies_options,
        load_profiles_options: state.jobBankStore.load_profiles_options,
        list_profiles_options: state.jobBankStore.list_profiles_options,
        list_connections_options: state.jobBankStore.list_connections_options,
        load_connections_options: state.jobBankStore.load_connections_options
    }
}

export default connect(mapState)(SearchPublications)