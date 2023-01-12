import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
  SyncOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import FiltersCandidates from './FiltersCandidates';
import TagFilters from '../TagFilters';
import { useFiltersCandidate } from '../hook/useFiltersCandidate';

const SearchCandidates = ({
    currentNode
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listGets, listKeys } = useFiltersCandidate();

    const showModal = () =>{
        let state = router.query?.state ? parseInt(router.query.state) : null;
        formSearch.setFieldsValue({...router.query, state});
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const onFinishSearch = (values) =>{
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
                            listGets={listGets}
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersCandidates
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
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(SearchCandidates)