import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import TagFilters from '../../jobbank/TagFilters';
import FiltersLogs from './FiltersLogs';
import { useFiltersLogs } from './useFiltersLogs';
import { createFiltersJB } from '../../../utils/functions';
import moment from 'moment';

const SearchLogs = ({
    currentNode,
    list_companies,
    load_companies
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listGets, listAwait } = useFiltersLogs();

    const format = 'YYYY-MM-DD';

    const setFilters = (filters = {}) => router.replace({
        pathname: '/timeclock/logs',
        query: filters
    }, undefined, {shallow: true});

    const onFinishSearch = (values) =>{
        values.timestamp__date = values.timestamp__date
            ? values?.timestamp__date?.format('DD-MM-YYYY')
            : null;
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
        values.timestamp__date = values?.timestamp__date
            ? moment(values?.timestamp__date, 'DD-MM-YYYY') : null;
        formSearch.setFieldsValue(values);
        setOpenModal(true)
    }

    const defaultFilters = useMemo(()=>{
        let node = router.query?.node;
        if(!node) return {'Empresa': currentNode?.name};
        return {'Empresa': listGets['node'](node)};
    },[currentNode, router.query?.node, list_companies])

    return (
        <>
            <Card bodyStyle={{padding: 12}}>
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Logs de eventos
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
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            listKeys={listKeys}
                            listGets={listGets}
                            listAwait={listAwait}
                            discardKeys={['node']}
                            defaultFilters={defaultFilters}
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersLogs
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
        currentNode: state.userStore.current_node,
        list_companies: state.timeclockStore.list_companies,
        load_companies: state.timeclockStore.load_companies
    }
}

export default connect(
    mapState, {}
)(SearchLogs);