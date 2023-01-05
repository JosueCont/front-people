import React, { useState, useEffect, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip, Radio } from 'antd';
import {
  SyncOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { createFiltersJB } from '../../../utils/functions';
import TagFilters from '../TagFilters';
import FiltersPreselection from './FiltersPreselection';
import { useFiltersPreselection } from '../hook/useFiltersPreselection';

const SearchPreselection = ({
    currentNode
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys, listGets } = useFiltersPreselection();

    const showModal = () =>{
        let state = router.query?.state ? parseInt(router.query.state) : null;
        let gender = router.query?.gender ? parseInt(router.query.gender) : null;
        formSearch.setFieldsValue({...router.query, state, gender});
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        formSearch.resetFields()
    }

    const onFinishSearch = (values) =>{
        let filters = createFiltersJB(values);
        let match = router.query?.match;
        if(match == '0') filters.match = match;
        router.replace({
            pathname: '/jobbank/preselection',
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace('/jobbank/preselection', undefined, {shallow: true});
    }

    const onChangeType = ({target: { value }}) =>{
        let filters = {...router.query, match: value};
        if(value == '1') delete filters.match;
        router.replace({
            pathname: '/jobbank/preselection',
            query: filters
        }, undefined, {shallow: true})
    }

    return (
        <>
            <Card bodyStyle={{padding: 12}}>
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{marginBottom: 0, fontSize: '1.25rem', fontWeight: 500}}>
                                Búsqueda de candidatos
                            </p>
                            <div className='content-end' style={{gap: 8}}>
                                <Radio.Group
                                    onChange={onChangeType}
                                    buttonStyle='solid'
                                    value={router.query?.match ?? '1'}
                                    className='radio-group-options'
                                >
                                    <Radio.Button value='1'>Compatibles</Radio.Button>
                                    <Radio.Button value='0'>Todos</Radio.Button>
                                </Radio.Group>
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

export default SearchPreselection