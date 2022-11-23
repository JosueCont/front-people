import React, { useState, useEffect } from 'react';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { getJobBoards } from '../../../../redux/jobBankDuck';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewJobBoards = () => {

    const {
        list_jobboards_options,
        load_jobboards_options
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
        dispatch(getJobBoards(currentNode.id));
    },[currentNode])

    useEffect(()=>{
        setLoading(load_jobboards_options);
    },[load_jobboards_options])
    
    useEffect(()=>{
        setMainData(list_jobboards_options);
    },[list_jobboards_options])

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createJobBoard({...values, node: currentNode.id});
            dispatch(getJobBoards(currentNode.id));
            message.success('Bolsa de empleo registrada');
        } catch (e) {
            console.log(e)
            message.error('Bolsa de empleo no registrado');
        }
    }

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateJobBoard(itemToEdit.id, values);
            dispatch(getJobBoards(currentNode.id));
            message.success('Bolsa de empleo actualizada');
        } catch (e) {
            console.log(e)
            message.error('Bolsa de empleo no actualizada');
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteJobBoard(id);
            dispatch(getJobBoards(currentNode.id));
            message.success('Bolsa de empleo eliminada');
        } catch (e) {
            console.log(e)
            message.error('Bolsa de empleo no eliminada');
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    setLoading={setLoading}
                    setOpenModal={setOpenModal}
                    listComplete={list_jobboards_options}
                    setItemsFilter={setMainData}
                />
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar bolsa de empleo'
                    titleEdit='Editar bolsa de empleo'
                    titleDelete='¿Estás seguro de eliminar esta bolsa?'
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

export default ViewJobBoards;