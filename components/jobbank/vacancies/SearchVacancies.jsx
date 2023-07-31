import React, { useState } from 'react';
import { Button, Row, Col, Form, Tooltip, Card } from 'antd';
import {
    SyncOutlined,
    SettingOutlined,
    TableOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import TagFilters from '../TagFilters';
import FiltersVacancies from './FiltersVacancies';
import { useFiltersVacancies } from '../hook/useFiltersVacancies';

const SearchVacancies = ({
    list_vacancies,
    load_vacancies,
    currentNode,
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listGets, listAwait, listDelete } = useFiltersVacancies();

    const showModal = () =>{
        let filters = {...router.query};
        filters.status = router.query?.status ? parseInt(router.query.status) : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/jobbank/vacancies/',
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

    return (
       <>
            <Card bodyStyle={{padding: 12}}>
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Vacantes
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
                                    pathname: '/jobbank/vacancies/add',
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
                            listGets={listGets}
                            listAwait={listAwait}
                            listDelete={listDelete}
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersVacancies
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
        list_vacancies: state.jobBankStore.list_vacancies,
        load_vacancies: state.jobBankStore.load_vacancies,
    }
}

export default connect(mapState)(SearchVacancies)