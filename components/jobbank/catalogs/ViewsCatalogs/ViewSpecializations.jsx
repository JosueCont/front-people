import React, { useState, useEffect } from 'react';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ruleRequired } from '../../../../utils/rules';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import { getSpecializationArea } from '../../../../redux/jobBankDuck';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewSpecializations = () => {

    const {
        list_specialization_area,
        load_specialization_area
    } = useSelector(state => state.jobBankStore);
    const currentNode = useSelector(state => state.userStore.current_node);
    const router = useRouter();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    useEffect(()=>{
        if(!currentNode) return;
        dispatch(getSpecializationArea(currentNode.id));
    },[currentNode])

    useEffect(()=>{
        setLoading(load_specialization_area);
    },[load_specialization_area])
    
    useEffect(()=>{
        setMainData(list_specialization_area);
    },[list_specialization_area])

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createSpecializationArea({...values, node: currentNode.id});
            dispatch(getSpecializationArea(currentNode.id));
            message.success('Especialización registrada');
        } catch (e) {
            console.log(e)
            message.error('Especialización no registrada');
        }
    }

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateSpecializationArea(itemToEdit.id, values);
            dispatch(getSpecializationArea(currentNode.id));
            message.success('Especialización actualizada');
        } catch (e) {
            console.log(e)
            message.error('Especialización no actualizada');
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteSpecializationArea(id);
            dispatch(getSpecializationArea(currentNode.id));
            message.success('Especialización eliminada');
        } catch (e) {
            console.log(e)
            message.error('Especialización no eliminada');
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    setLoading={setLoading}
                    setOpenModal={setOpenModal}
                    listComplete={list_specialization_area}
                    setItemsFilter={setMainData}
                />
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar especialización'
                    titleEdit='Editar especialización'
                    titleDelete='¿Estás seguro de eliminar esta especialización?'
                    actionCreate={actionCreate}
                    actionUpdate={actionUpdate}
                    actionDelete={actionDelete}
                    catalogResults={mainData}
                    catalogLoading={loading}
                    itemToEdit={itemToEdit}
                    setItemToEdit={setItemToEdit}
                    itemsToDelete={itemsToDelete}
                    setItemsToDelete={setItemsToDelete}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />
            </Col>
        </Row> 
    )
}

export default ViewSpecializations;