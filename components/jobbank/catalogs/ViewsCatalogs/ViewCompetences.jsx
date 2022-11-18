import React, { useState, useEffect } from 'react';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { getCompetences } from '../../../../redux/jobBankDuck';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewCompetences = () => {

    const {
        list_competences,
        load_competences
    } = useSelector(state => state.jobBankStore);
    const currentNode = useSelector(state => state.userStore.current_node);
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    useEffect(()=>{
        if(!currentNode) return;
        dispatch(getCompetences(currentNode.id));
    },[currentNode])

    useEffect(()=>{
        setLoading(load_competences);
    },[load_competences])
    
    useEffect(()=>{
        setMainData(list_competences);
    },[list_competences])

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createCompetence({...values, node: currentNode.id});
            dispatch(getCompetences(currentNode.id));
            message.success('Competencia registrada');
        } catch (e) {
            console.log(e)
            message.error('Competencia no registrada');
        }
    }

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateCompetence(itemToEdit.id, values);
            dispatch(getCompetences(currentNode.id));
            message.success('Competencia actuailzada')
        } catch (e) {
            console.log(e)
            message.error('Competencia no actualizada');
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteCompetence(id);
            dispatch(getCompetences(currentNode.id));
            message.success('Competencia eliminada');
        } catch (e) {
            console.log(e)
            message.error('Competencia no eliminada');
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    setLoading={setLoading}
                    setOpenModal={setOpenModal}
                    listComplete={list_competences}
                    setItemsFilter={setMainData}
                />
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar competencia'
                    titleEdit='Editar competencia'
                    titleDelete='¿Estás seguro de eliminar esta competencia?'
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

export default ViewCompetences;