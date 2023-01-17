import React, { useState, useEffect } from 'react';
import { Row, Col, message, Menu } from 'antd';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { PlusOutlined } from '@ant-design/icons';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewCategories = ({
    filtersString,
    currentPage
 }) => {

    const currentNode = useSelector(state => state.userStore.current_node);
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState({});

    useEffect(()=>{
        if(!currentNode) return;
        getMainCategories(currentNode.id, filtersString);
    },[currentNode, filtersString])

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

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createMainCategoy({...values, node: currentNode.id});
            getMainCategories(currentNode.id, filtersString);
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
            getMainCategories(currentNode.id, filtersString);
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
            getMainCategories(currentNode.id, filtersString);
            message.success('Categoría eliminada');
        } catch (e) {
            console.log(e)
            message.error('Categoría no eliminada')
        }
    }

    const ExtraOptions = ({item}) => {
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
                <SearchCatalogs actionBtnAdd={()=> setOpenModal(true)}/>
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
                    ExtraOptions={ExtraOptions}
                    numPage={currentPage}
                />
            </Col>
        </Row> 
    )
}

export default ViewCategories;