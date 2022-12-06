import React, { useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';
import { useSelector } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import { useRouter } from 'next/router';
import { getFiltersJB, deleteFiltersJb } from '../../../../utils/functions';

const ViewTemplates = () => {

    const currentNode = useSelector(state => state.userStore.current_node);
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState([]);
    const [numPage, setNumPage] = useState(1);
    const [newFilters, setNewFilters] = useState({});

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        setNewFilters(deleteFiltersJb(router.query));
    },[router])

    useEffect(()=>{
        if(!currentNode) return;
        getWithFilters();
    },[currentNode, router])

    const getProfilesTypes = async (node, query = '') =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getProfilesTypes(node, query);
            setMainData(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const getWithFilters = () =>{
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let filters = getFiltersJB(newFilters);
        setNumPage(page);
        getProfilesTypes(currentNode.id, filters);
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteProfileType(id);
            getWithFilters();
            message.success('Template eliminado');
        } catch (e) {
            console.log(e)
            message.error('Template no eliminado');
        }
    }

    const openModalEdit = (item) =>{
        router.push({
            pathname: '/jobbank/settings/catalogs/profiles/edit',
            query: {...newFilters, id: item.id}
        })
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    actionBtn={()=> router.push({
                        pathname: '/jobbank/settings/catalogs/profiles/add',
                        query: newFilters
                    })}
                />
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar tipo de template'
                    titleEdit='Editar tipo de template'
                    titleDelete='¿Estás seguro de eliminar este tipo de template?'
                    actionDelete={actionDelete}
                    catalogResults={mainData}
                    catalogLoading={loading}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    actionBtnEdit={openModalEdit}
                    numPage={numPage}
                />
            </Col>
        </Row> 
    )
}

export default ViewTemplates;