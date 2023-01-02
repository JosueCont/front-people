import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
  SyncOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import ModalFilters from './ModalFilters';
import TagFilters from './TagFilters';

const SearchCandidates = ({
    currentNode,
    load_main_categories,
    list_main_categories,
    list_states,
    load_states
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);

    const showModal = () =>{
        let is_other = router.query?.other_area ? true : false;
        let state = router.query?.state ? parseInt(router.query.state) : null;
        formSearch.setFieldsValue({...router.query, is_other, state});
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const onFinishSearch = (values) =>{
        delete values.is_other;
        let filters = createFiltersJB(values);
        router.replace({
            pathname: '/jobbank/candidates/',
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace('/jobbank/candidates', undefined, {shallow: true});
    }

    const getArea = (id) =>{
        if(!id) return id;
        const find_ = item => item.id == id;
        let result = list_main_categories.find(find_);
        if(!result) return id;
        return result.name;
    }

    const getState = (id) =>{
        if(!id) return id;
        const find_ = item => item.id == id;
        let result = list_states.find(find_);
        if(!result) return id;
        return result.name;
    }

    const listKeys = {
        fisrt_name__unaccent__icontains: 'Nombre',
        last_name__unaccent__icontains: 'Apellidos',
        email__unaccent__icontains: 'Correo',
        cell_phone: 'Teléfono',
        job: 'Puesto',
        is_active: 'Estatus',
        area: 'Especialización',
        other_area: 'Otra especialización',
        state: 'Estado',
        municipality__unaccent__icontains: 'Municipio'
    }

    const listValues = {
        true: 'Activo',
        false: 'Inactivo',
    }

    const listGets = {
        area: getArea,
        state: getState
    }

    return (
        <>
            <Card bodyStyle={{padding: 12}}>
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Filtros aplicados
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
                                    pathname: '/jobbank/candidates/add',
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
                            listValues={listValues}
                            listGets={listGets}
                        />
                    </Col>  
                </Row>
            </Card>
            <ModalFilters
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
        list_main_categories: state.jobBankStore.list_main_categories,
        load_main_categories: state.jobBankStore.load_main_categories,
        list_states: state.jobBankStore.list_states,
        load_states: state.jobBankStore.load_states
    }
}

export default connect(mapState)(SearchCandidates)