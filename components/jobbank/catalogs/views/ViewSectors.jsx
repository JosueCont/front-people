import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, message } from 'antd';
import { useSelector } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewSectors = ({
    filtersString,
    currentPage
}) => {

    const currentNode = useSelector(state => state.userStore.current_node);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState([]);

    useEffect(()=>{
        if(!currentNode) return;
        getSectors(currentNode.id, filtersString);
    },[currentNode, filtersString])

    const getSectors = async (node, query = '') => {
        try {
            setLoading(true)
            let response = await WebApiJobBank.getSectors(node, query);
            setMainData(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createSector({...values, node: currentNode.id});
            getSectors(currentNode.id, filtersString);;
            message.success('Sector registrado');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Sector no registrado';
            message.error(msg);
        }
    }

    const actionUpdate = async (id, values) =>{
        try {
            await WebApiJobBank.updateSector(id, values);
            getSectors(currentNode.id, filtersString);;
            message.success('Sector actualizado');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Sector no actualizado';
            message.error(msg);
        }
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteSector(id);
            getSectors(currentNode.id, filtersString);;
            message.success('Sector eliminado');
        } catch (e) {
            console.log(e)
            message.error('Sector no eliminado');
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs actionBtnAdd={()=> setOpenModal(true)}/>
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
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    numPage={currentPage}
                />
            </Col>
        </Row> 
    )
}

export default ViewSectors;