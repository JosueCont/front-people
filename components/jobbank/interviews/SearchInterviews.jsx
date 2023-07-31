import React, { useState, useContext } from 'react';
import { Button, Row, Col, Form, Card, Tooltip, message } from 'antd';
import {
  SyncOutlined,
  SettingOutlined,
  CalendarOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import TagFilters from '../TagFilters';
import FiltersInterviews from './FiltersInterviews';
import { useFiltersInterviews } from '../hook/useFiltersInterviews';
import moment from 'moment';
import EventForm from './EventForm';
import { InterviewContext } from '../context/InterviewContext';
import BtnLoginGC from '../BtnLoginGC';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { getInterviews } from '../../../redux/jobBankDuck';

const SearchInterviews = ({
    currentNode,
    isCalendar = false,
    getInterviews,
    jobbank_filters,
    jobbank_page
}) => {

    const urlDefault = '/jobbank/interviews';
    const router = useRouter();
    const discardKeys = ['year','type','view','mth'];
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [openModalForm, setOpenModalForm] = useState(false);
    const { listKeys, listGets, listAwait, listDelete } = useFiltersInterviews();
    const { fetchAction, googleCalendar, createData, token } = useContext(InterviewContext);

    const actionCreate = async (values) =>{
        try{
            let body = {...createData(values), node: currentNode.id};
            let headers = {'access-token': token.access_token};
            await WebApiJobBank.createInterview(body, headers);
            getInterviews(currentNode.id, jobbank_filters);
            message.success('Evento registrado')
        }catch(e){
            console.log(e)
            let error = e.response?.data?.message;
            let msg = error ? error : 'Evento no registrado';
            message.error(msg)
        }
    }

    const showModal = () =>{
        let filters = {...router.query};
        filters.candidate = router.query?.candidate ? parseInt(router.query?.candidate) : null;
        filters.date = router.query?.date ? moment(router.query?.date, 'DD-MM-YYYY') : null;
        filters.status = router.query?.status ? parseInt(router.query?.status) : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: isCalendar ? `${urlDefault}/calendar` : urlDefault,
        query: filters
    }, undefined, {shallow: true});

    const onFinishSearch = (values) =>{
        let filters = createFiltersJB(values);
        if(router.query?.view) filters.view = router.query?.view;
        setFilters(filters);
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
                        <div className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Eventos
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
                                {/* {!isCalendar ? (
                                    <Tooltip title='Ver calendario'>
                                        <Button onClick={()=> router.push({
                                            pathname: `${urlDefault}/calendar`,
                                            query: router.query
                                        })}>
                                            <CalendarOutlined />
                                        </Button>
                                    </Tooltip>
                                ) :(
                                    <Tooltip title='Regresar'>
                                        <Button onClick={()=> router.push({
                                            pathname: urlDefault,
                                            query: router.query
                                        })}>
                                            <ArrowLeftOutlined/>
                                        </Button>
                                    </Tooltip>
                                )} */}
                                <BtnLoginGC/>
                                <Tooltip title={googleCalendar.msg}>
                                    <Button
                                        disabled={!googleCalendar.valid}
                                        onClick={()=> fetchAction(()=> setOpenModalForm(true))}
                                    >
                                        Agregar
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
                            listDelete={listDelete}
                            discardKeys={discardKeys}
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersInterviews
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
            <EventForm
                visible={openModalForm}
                close={()=> setOpenModalForm(false)}
                actionForm={actionCreate}
            />
        </>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
        jobbank_page: state.jobBankStore.jobbank_page,
        jobbank_filters: state.jobBankStore.jobbank_filters
    }
}

export default connect(mapState, { getInterviews })(SearchInterviews);