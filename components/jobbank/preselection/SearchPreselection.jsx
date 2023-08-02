import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip, Radio, Select } from 'antd';
import {
  SyncOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import TagFilters from '../TagFilters';
import FiltersPreselection from './FiltersPreselection';
import { useFiltersPreselection } from '../hook/useFiltersPreselection';
import WebApiPeople from '../../../api/WebApiPeople';

const SearchPreselection = ({
    currentNode,
    list_vacancies_options,
    load_vacancies_options
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys } = useFiltersPreselection();

    const idVacant = router.query?.vacant ?? null;
    const match = router.query?.applyMatch ?? null;

    const defaultFilters = useMemo(()=>{
        if(!idVacant) return {};
        if(list_vacancies_options.length <= 0) return {};
        const find_ = item => item.id == idVacant;
        let result = list_vacancies_options.find(find_);
        if(!result) return {};
        return {
            'Cliente': result?.customer?.name,
            'Vacante': result.job_position,
            'Género': listKeys['gender'].get(result.gender) ?? 'N/A',
            'Puestos': result.qty ?? 0,
            'Aceptados': result.candidates_accepted,
            'En proceso': result.candidates_in_process,
            'Disponibles': result.available
        };
    },[idVacant, list_vacancies_options])

    const showModal = () =>{
        let filters = {...router.query};
        filters.language = router.query?.language
            ? parseInt(router.query.language) : null;
        filters.status_level_study = router.query?.status_level_study
            ? parseInt(router.query.status_level_study) : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/jobbank/preselection',
        query: filters
    }, undefined, {shallow: true});

    const onFinishSearch = (values) =>{
        let filters = createFiltersJB(values);
        if(idVacant) filters.vacant = idVacant;
        if(match == '0') filters.applyMatch = match;
        setFilters(filters)
    }

    const deleteFilter = () =>{
        let filters = {};
        if(idVacant) filters.vacant = idVacant;
        if(match == '0') filters.applyMatch = match;
        formSearch.resetFields();
        setFilters(filters)
    }

    const onChangeType = ({target: { value }}) =>{
        let filters = {...router.query, applyMatch: value};
        if(value == '1') delete filters.applyMatch;
        setFilters(filters)
    }

    const onChangeVacant = (value) =>{
        let filters = value ? {...router.query, vacant: value} : {};
        setFilters(filters)
    }

    return (
        <>
            <Card bodyStyle={{padding: 12}}>
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <div className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Búsqueda de candidatos
                            </p>
                            <div className='content-end' style={{gap: 8}}>
                                <Select
                                    allowClear
                                    showSearch
                                    disabled={load_vacancies_options}
                                    loading={load_vacancies_options}
                                    value={idVacant}
                                    className='select-jb'
                                    placeholder='Vacante'
                                    notFoundContent='No se encontraron resultados'
                                    optionFilterProp='children'
                                    style={{width: 150}}
                                    onChange={onChangeVacant}
                                >
                                    {list_vacancies_options.length > 0 && list_vacancies_options.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.job_position}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <Tooltip title={idVacant ? '' : 'Seleccionar una vacante'}>
                                    <Radio.Group
                                        onChange={onChangeType}
                                        buttonStyle='solid'
                                        value={router.query?.applyMatch ?? '1'}
                                        disabled={!idVacant}
                                        className='radio-group-options'
                                    >
                                            <Radio.Button value='1'>Compatibles</Radio.Button>
                                            <Radio.Button value='0'>Todos</Radio.Button>
                                    </Radio.Group>
                                </Tooltip>
                                <Tooltip title={idVacant ? 'Configurar filtros' : 'Seleccionar una vacante'}>
                                    <Button
                                        className='btn-jb-disabled'
                                        onClick={()=> showModal()}
                                        disabled={!idVacant}
                                    >
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
                            discardKeys={['vacant','applyMatch']}
                            defaultFilters={defaultFilters}
                        />
                    </Col>  
                </Row>
            </Card>
            <FiltersPreselection
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

const mapState = (state) => {
    return{
        currentNode: state.userStore.current_node,
        load_vacancies_options: state.jobBankStore.load_vacancies_options,
        list_vacancies_options: state.jobBankStore.list_vacancies_options
    }
}

export default connect(mapState)(SearchPreselection);