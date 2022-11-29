import React, { useState, useEffect } from 'react';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { getAcademics } from '../../../../redux/jobBankDuck';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewAcademics = () => {

    const {
        list_academics,
        load_academics
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
        dispatch(getAcademics(currentNode.id));
    },[currentNode])

    useEffect(()=>{
        setLoading(load_academics);
    },[load_academics])
    
    useEffect(()=>{
        setMainData(list_academics);
    },[list_academics])

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createAcademic({...values, node: currentNode.id});
            dispatch(getAcademics(currentNode.id));
            message.success('Carrera registrada');
        } catch (e) {
            console.log(e)
            message.error('Carrera no registrada');
        }
    }

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateAcademic(itemToEdit.id, values);
            dispatch(getAcademics(currentNode.id));
            message.success('Carrera actualizada');
        } catch (e) {
            console.log(e)
            message.error('Carrera no actualizada');
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteAcademic(id);
            dispatch(getAcademics(currentNode.id));
            message.success('Carrera eliminada')
        } catch (e) {
            console.log(e)
            message.error('Carrera no eliminada')
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    setLoading={setLoading}
                    listComplete={list_academics}
                    setItemsFilter={setMainData}
                    setOpenModal={setOpenModal}
                />
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar carrera'
                    titleEdit='Editar carrera'
                    titleDelete='¿Estás seguro de eliminar esta carrera?'
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

export default ViewAcademics;