import React, { useState, useEffect, useMemo} from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import TagFilters from '../../jobbank/TagFilters';
import FiltersCenters from './FiltersCenters';
import { useFiltersCenters } from './useFiltersCenters';
import { createFiltersJB } from '../../../utils/functions';
import { connect } from 'react-redux';

const SearchCenters = ({
    currentNode
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listGets } = useFiltersCenters();

    const setFilters = (filters = {}) => router.replace({
        pathname: '/timeclock/centers',
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
        let values = {...router.query};
        values.node = values.node ? parseInt(values.node) : currentNode?.id;
        formSearch.setFieldsValue(values);
        setOpenModal(true)
    }

    const defaultFilters = useMemo(()=>{
        let node = router.query?.node;
        if(!node) return {'Empresa': currentNode?.name};
        return {'Empresa': listGets['node'](node)};
    },[currentNode, router.query?.node])

    return (
        <>
            <Card bodyStyle={{padding: 12}}>
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Centros de trabajo
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
                                    pathname: '/timeclock/centers/add',
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
                            discardKeys={['node']}
                            defaultFilters={defaultFilters}
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersCenters
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

export default connect(
    mapState, {}
)(SearchCenters);