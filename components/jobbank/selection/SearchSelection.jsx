import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip, message } from 'antd';
import {
  SyncOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import ModalFilters from './ModalFilters';
import TagFilters from '../TagFilters';
import { useFiltersSelection } from '../hook/useFiltersSelection';
import ModalSelection from './ModalSelection';
import { getSelection } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';

const SearchSelection = ({
    currentNode,
    currentPage,
    currentFilters,
    getSelection
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listGets } = useFiltersSelection();

    const actionCreate = async (values) =>{
        try {
            // await WebApiJobBank.createSelection({...values, node: currentNode.id});
            getSelection(currentNode.id, currentFilters, currentPage)
            message.success('Proceso registrado')
        } catch (e) {
            console.log(e)
            message.error('Proceso no registrado');
        }
    }

    const onFinishSearch = (values) =>{
        let filters = createFiltersJB(values);
        router.replace({
            pathname: '/jobbank/selection',
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace('/jobbank/selection', undefined, {shallow: true});
    }

    const showModal = () =>{
        let status = router.query?.status ? parseInt(router.query.status) : null;
        formSearch.setFieldsValue({...router.query, status});
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
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
                                <Button
                                    onClick={()=> setOpenModalAdd(true)}
                                >
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
            <ModalFilters
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
            <ModalSelection
                title='Agregar proceso'
                visible={openModalAdd}
                actionForm={actionCreate}
                close={()=> setOpenModalAdd(false)}
            />
        </>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(mapState, {getSelection})(SearchSelection);