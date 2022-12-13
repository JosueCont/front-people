import React, { useState, useEffect } from 'react';
import { Row, Col, message, Menu } from 'antd';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { PlusOutlined } from '@ant-design/icons';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import { getFiltersJB, deleteFiltersJb } from '../../../../utils/functions';

const ViewCategories = () => {

    const currentNode = useSelector(state => state.userStore.current_node);
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState({});
    const [numPage, setNumPage] = useState(1);

    useEffect(()=>{
        if(!currentNode) return;
        getWithFilters();
    },[currentNode, router])

    const getMainCategories = async (node, query = '') =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getMainCategories(node, query);
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
        getMainCategories(currentNode.id, filters);
    }

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createMainCategoy({...values, node: currentNode.id});
            getWithFilters()
            message.success('Categoría registrada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Categoría no registrada';
            message.error(msg);
        }
    }

    const actionUpdate = async (id, values) =>{
        try {
            await WebApiJobBank.updateMainCategory(id, values);
            getWithFilters()
            message.success('Categoría actualizada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Categoría no actualizada';
            message.error(msg);
        }
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteMainCategory(id);
            getWithFilters()
            message.success('Categoría eliminada');
        } catch (e) {
            console.log(e)
            message.error('Categoría no eliminada')
        }
    }

    const extraOptions = (item) => {
        return(
            <>
                <Menu.Item
                    key='3'
                    icon={<PlusOutlined/>}
                    onClick={()=> router.replace({
                        pathname: '/jobbank/settings/catalogs/subcategories',
                        query: { category: item.id }
                    })}
                >
                    Registrar subcategoría
                </Menu.Item>
            </>
        )
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs setOpenModal={setOpenModal}/>
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar categoría'
                    titleEdit='Editar categoría'
                    titleDelete='¿Estás seguro de eliminar esta categoría?'
                    actionCreate={actionCreate}
                    actionUpdate={actionUpdate}
                    actionDelete={actionDelete}
                    catalogResults={mainData}
                    catalogLoading={loading}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    extraOptions={extraOptions}
                    numPage={numPage}
                />
            </Col>
        </Row> 
    )
}

export default ViewCategories;