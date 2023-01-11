import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewAcademics = ({
    filtersString,
    currentPage
}) => {

    const currentNode = useSelector(state => state.userStore.current_node);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState({});

    useEffect(()=>{
        if(!currentNode) return;
        getAcademics(currentNode.id, filtersString);
    },[currentNode, filtersString])

    const getAcademics = async (node, query = '') =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getAcademics(node, query);
            setMainData(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createAcademic({...values, node: currentNode.id});
            getAcademics(currentNode.id, filtersString);
            message.success('Carrera registrada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Carrera no registrada';
            message.error(msg);
        }
    }

    const actionUpdate = async (id, values) =>{
        try {
            await WebApiJobBank.updateAcademic(id, values);
            getAcademics(currentNode.id, filtersString);
            message.success('Carrera actualizada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya este' : 'Carrera no actualizada';
            message.error(msg);
        }
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteAcademic(id);
            getAcademics(currentNode.id, filtersString);
            message.success('Carrera eliminada')
        } catch (e) {
            console.log(e)
            message.error('Carrera no eliminada')
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs actionBtnAdd={()=> setOpenModal(true)}/>
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
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    numPage={currentPage}
                />
            </Col>
        </Row> 
    )
}

export default ViewAcademics;