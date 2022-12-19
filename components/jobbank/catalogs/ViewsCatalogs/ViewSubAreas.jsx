import React, { useState, useEffect } from 'react';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import { getFiltersJB, deleteFiltersJb } from '../../../../utils/functions';
import { getSpecializationArea } from '../../../../redux/jobBankDuck';
import { ruleRequired } from '../../../../utils/rules';

const ViewSubAreas = () => {

    const {
        list_specialization_area,
        load_specialization_area,
    } = useSelector(state => state.jobBankStore);
    const currentNode = useSelector(state => state.userStore.current_node);
    const router = useRouter();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState([]);
    const [numPage, setNumPage] = useState(1);

    useEffect(()=>{
        if(!currentNode) return;
        getWithFilters();
    },[currentNode, router])

    useEffect(()=>{
        if(!currentNode) return;
        dispatch(getSpecializationArea(currentNode.id));
    },[currentNode])

    const getWithFilters = () =>{
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let params = deleteFiltersJb(router.query);
        let filters = getFiltersJB(params);
        setNumPage(page);
        getSpecializationSubArea(currentNode.id, filters);
    }

    const getSpecializationSubArea = async (node, query) =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getSpecializationSubArea(node, query);
            setMainData(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createSpecializationSubArea({...values, node: currentNode.id});
            getWithFilters();
            message.success('Subárea registrada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Subárea no registrada';
            message.error(msg);
        }
    }
    
    const actionUpdate = async (id, values) =>{
        try {
            await WebApiJobBank.updateSpecializationSubArea(id, values);
            getWithFilters();
            message.success('Subárea actualizada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Subárea no actualizada';
            message.error(msg);
        }
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteSpecializationSubArea(id);
            getWithFilters();
            message.success('Subárea eliminada');
        } catch (e) {
            console.log(e)
            message.error('Subárea no eliminada');
        }
    }

    const SelectArea = () => (
        <Form.Item
            name='area'
            label='Área de especialización'
            rules={[ruleRequired]}
        >
            <Select
                allowClear
                showSearch
                disabled={router.query?.area}
                placeholder='Seleccionar un área'
                notFoundContent='No se encontraron resultados'
                optionFilterProp='children'
                loading={load_specialization_area}
            >
                {list_specialization_area?.length > 0 && list_specialization_area.map(item => (
                    <Select.Option value={item.id} key={item.name}>
                        {item.name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    )

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs setOpenModal={setOpenModal}/>
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar subárea'
                    titleEdit='Editar subárea'
                    titleDelete='¿Estás seguro de eliminar esta subárea?'
                    actionCreate={actionCreate}
                    actionUpdate={actionUpdate}
                    actionDelete={actionDelete}
                    catalogResults={mainData}
                    catalogLoading={loading}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    numPage={numPage}
                    extraFields={<SelectArea/>}
                />
            </Col>
        </Row> 
    )
}

export default ViewSubAreas