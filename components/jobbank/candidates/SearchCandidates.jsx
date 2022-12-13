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
    load_specialization_area,
    list_specialization_area
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);

    const showModal = () =>{
        let area = router.query?.area ? parseInt(router.query.area) : null;
        let is_other = router.query?.other_area ? true : false;
        formSearch.setFieldsValue({...router.query, area, is_other});
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
        let result = list_specialization_area.find(find_);
        if(!result) return id;
        return result.name;
    }

    const listKeys = {
        fisrt_name__icontains: 'Nombre',
        last_name__icontains: 'Apellidos',
        email__icontains: 'Correo',
        cell_phone: 'Teléfono',
        job: 'Puesto',
        is_active: 'Estatus',
        area: 'Especialización',
        other_area: 'Otra especialización'
    }

    const listValues = {
        true: 'Activo',
        false: 'Inactivo',
    }

    const listGets = {
        area: getArea
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
                                <Button onClick={()=> showModal()}>
                                    <SettingOutlined />
                                </Button>
                                <Button onClick={()=> deleteFilter()}>
                                    <SyncOutlined />
                                </Button>
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
        list_specialization_area: state.jobBankStore.list_specialization_area,
        load_specialization_area: state.jobBankStore.load_specialization_area,
    }
}

export default connect(mapState)(SearchCandidates)