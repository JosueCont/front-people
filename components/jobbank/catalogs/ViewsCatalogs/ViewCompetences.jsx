import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, message } from 'antd';
import { useSelector } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import { getFiltersJB, deleteFiltersJb } from '../../../../utils/functions';

const ViewCompetences = () => {

    const currentNode = useSelector(state => state.userStore.current_node);
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState([]);
    const [numPage, setNumPage] = useState(1);

    useEffect(()=>{
        if(!currentNode) return;
        getWithFilters();
    },[currentNode, router])

    const getCompetences = async (node, query = '') =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getCompetences(node, query);
            setMainData(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const getWithFilters = () =>{
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let params = deleteFiltersJb(router.query);
        let filters = getFiltersJB(params);
        setNumPage(page);
        getCompetences(currentNode.id, filters);
    }

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createCompetence({...values, node: currentNode.id});
            getWithFilters();
            message.success('Competencia registrada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Competencia no registrada';
            message.error(msg);
        }
    }

    const actionUpdate = async (id, values) =>{
        try {
            await WebApiJobBank.updateCompetence(id, values);
            getWithFilters();
            message.success('Competencia actuailzada')
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Competencia no actualizada';
            message.error(msg);
        }
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteCompetence(id);
            getWithFilters();
            message.success('Competencia eliminada');
        } catch (e) {
            console.log(e)
            message.error('Competencia no eliminada');
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs setOpenModal={setOpenModal}/>
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
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    numPage={numPage}
                />
            </Col>
        </Row> 
    )
}

export default ViewCompetences;