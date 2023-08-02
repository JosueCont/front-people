import React, { useState } from 'react'
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB, getValueFilter } from '../../../utils/functions';
import TagFilters from '../TagFilters';
import FiltersProfiles from './FiltersProfiles';

const SearchProfiles = ({
    currentNode,
    load_clients_options,
    list_clients_options
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);

    const setFilters = (filters = {}) => router.replace({
        pathname: '/jobbank/profiles',
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
        formSearch.setFieldsValue(router.query);
        setOpenModal(true)
    }

    return (
        <>
            <Card bodyStyle={{padding: 12}}>
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Templates de vacante
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
                                    pathname: '/jobbank/profiles/add',
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
                                customer: {
                                    name: 'Cliente',
                                    loading: load_clients_options,
                                    get: e => getValueFilter({
                                        value: e,
                                        list: list_clients_options
                                    })
                                }
                            }}
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersProfiles
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
        load_clients_options: state.jobBankStore.load_clients_options,
        list_clients_options: state.jobBankStore.list_clients_options,
    }
}

export default connect(mapState)(SearchProfiles)