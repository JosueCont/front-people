import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import { getFiltersJB, deleteFiltersJb } from '../../../../utils/functions';

const ViewSectors = () => {

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

    const getWithFilters = () =>{
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let params = deleteFiltersJb(router.query);
        let filters = getFiltersJB(params);
        setNumPage(page);
        getSectors(currentNode.id, filters);
    }

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createSector({...values, node: currentNode.id});
            getWithFilters();
            message.success('Sector registrado');
        } catch (e) {
            console.log(e)
            message.error('Sector no registrado');
        }
    }

    const actionUpdate = async (id, values) =>{
        try {
            await WebApiJobBank.updateSector(id, values);
            getWithFilters();
            message.success('Sector actualizado');
        } catch (e) {
            console.log(e)
            message.error('Sector no actualizado');
        }
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteSector(id);
            getWithFilters();
            message.success('Sector eliminado');
        } catch (e) {
            console.log(e)
            message.error('Sector no eliminado');
        }
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs setOpenModal={setOpenModal}/>
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
                    numPage={numPage}
                />
            </Col>
        </Row> 
    )
}

export default ViewSectors;