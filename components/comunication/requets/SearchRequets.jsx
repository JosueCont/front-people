import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
  SyncOutlined,
  SettingOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import TagFilters from '../../jobbank/TagFilters';
import {
    createFiltersJB,
    downLoadFileBlob,
    getDomain
} from '../../../utils/functions';
import FiltersRequests from './FiltersRequests';
import { useFiltersRequests } from './useFiltersRequests';
import { API_URL_TENANT } from '../../../config/config';

const SearchRequests = ({
    lastFilters = "",
    currentURL = '/comunication/requests/holidays',
    isAdmin = true
}) => {

    const router = useRouter();
    const { current_node } = useSelector(state => state.userStore);
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listAwait} = useFiltersRequests();
    const format = 'YYYY-MM-DD';

    const formatRange = () =>{
        let dates = router.query?.range?.split(',');
        return [moment(dates[0], format), moment(dates[1], format)];
    }

    const showModal = () =>{
        let filters = {...router.query};
        filters.range = router.query?.range ? formatRange() : null;
        filters.status__in = router.query?.status__in
            ? router.query?.status__in?.split(',') : ['1'];
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: currentURL,
        query: filters
    }, undefined, {shallow: true});

    const onFinishSearch = (values) =>{        
        values.range = values.range ?
            `${values.range[0].format(format)},${values.range[1].format(format)}` : null;
        values.status__in = values?.status__in?.length > 0
            ? values.status__in?.join(',') : null;
        let filters = createFiltersJB(values);        
        setFilters(filters)
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        setFilters()
    }

    const downloadFile = async () => {  
        const url = `/person/vacation?person__node__id=${current_node?.id}&download=true`                            
        await downLoadFileBlob(
            `${getDomain(API_URL_TENANT)}${url}${lastFilters}`,
            "reporte_vacaciones.xlsx",
            "GET",
            null,
            "No se encontraron resultados"
        );
    }

    const defaultFilter = useMemo(()=>{
        let value = router.query?.status__in;
        let name = value ? listKeys['status__in'].get(value) : 'Pendiente';
        return {Estatus: name}
    },[router.query?.status__in])

    return (
        <>
            <Card bodyStyle={{padding: 12}}>
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Solicitudes
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
                                <Tooltip title='Descargar Excel'>
                                    <Button onClick={()=> downloadFile()}>
                                        <DownloadOutlined />
                                    </Button>
                                </Tooltip>
                                <Button onClick={()=> router.push({
                                    pathname: 'holidays/new',
                                    query: {...router.query}
                                })}>
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            listKeys={listKeys}
                            listAwait={listAwait}
                            discardKeys={['status__in']}
                            defaultFilters={defaultFilter}
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersRequests
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
                showCollaborator={isAdmin}
                showSupervisor={isAdmin}
            />
        </>
    )
}

export default SearchRequests;