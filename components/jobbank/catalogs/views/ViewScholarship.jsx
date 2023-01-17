import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewScholarship = ({
    filtersString,
    currentPage
}) => {

    const currentNode = useSelector(state => state.userStore.current_node);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState({});

    useEffect(()=>{
        if(!currentNode) return;
        getScholarship(currentNode.id, filtersString);
    },[currentNode, filtersString])

    const getScholarship = async (node, query = '') =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getScholarship(node, query);
            setMainData(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createScholarship({...values, node: currentNode.id});
            getScholarship(currentNode.id, filtersString);
            message.success('Escolaridad registrada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Escolaridad no registrada';
            message.error(msg);
        }
    }

    const actionUpdate = async (id, values) =>{
        try {
            await WebApiJobBank.updateScholarship(id, values);
            getScholarship(currentNode.id, filtersString);
            message.success('Escolaridad actualizada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya este' : 'Escolaridad no actualizada';
            message.error(msg);
        }
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteScholarship(id);
            getScholarship(currentNode.id, filtersString);
            message.success('Escolaridad eliminada')
        } catch (e) {
            console.log(e)
            message.error('Escolaridad no eliminada')
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs actionBtnAdd={()=> setOpenModal(true)}/>
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar escolaridad'
                    titleEdit='Editar escolaridad'
                    titleDelete='¿Estás seguro de eliminar esta escolaridad?'
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

export default ViewScholarship