import React, { useState, useEffect } from 'react';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { getSectors } from '../../../../redux/jobBankDuck';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewSectors = () => {

    const {
        list_sectors,
        load_sectors
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
        dispatch(getSectors(currentNode.id));
    },[currentNode])

    useEffect(()=>{
        setLoading(load_sectors);
    },[load_sectors])
    
    useEffect(()=>{
        setMainData(list_sectors);
    },[list_sectors])

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createSector({...values, node: currentNode.id});
            dispatch(getSectors(currentNode.id));
            message.success('Sector registrado');
        } catch (e) {
            console.log(e)
            message.error('Sector no registrado');
        }
    }

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateSector(itemToEdit.id, values);
            dispatch(getSectors(currentNode.id));
            message.success('Sector actualizado');
        } catch (e) {
            console.log(e)
            message.error('Sector no actualizado');
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteSector(id);
            dispatch(getSectors(currentNode.id));
            message.success('Sector eliminado');
        } catch (e) {
            console.log(e)
            message.error('Sector no eliminado');
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    setLoading={setLoading}
                    setOpenModal={setOpenModal}
                    listComplete={list_sectors}
                    setItemsFilter={setMainData}
                />
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar sector'
                    titleEdit='Editar sector'
                    titleDelete='¿Estás seguro de eliminar este sector?'
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

export default ViewSectors;