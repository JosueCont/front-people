import React, { useState, useEffect } from 'react';
import { Row, Col, message, Menu } from 'antd';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { getMainCategories } from '../../../../redux/jobBankDuck';
import { PlusOutlined } from '@ant-design/icons';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewCategories = () => {

    const {
        list_main_categories,
        load_main_categories,
    } = useSelector(state => state.jobBankStore);
    const currentNode = useSelector(state => state.userStore.current_node);
    const router = useRouter();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    useEffect(()=>{
        if(!currentNode) return;
       dispatch(getMainCategories(currentNode.id));
    },[currentNode])

    useEffect(()=>{
        setLoading(load_main_categories);
    },[load_main_categories])
    
    useEffect(()=>{
        setMainData(list_main_categories);
    },[list_main_categories])

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createMainCategoy({...values, node: currentNode.id});
            dispatch(getMainCategories(currentNode.id));
            message.success('Categoría registrada');
        } catch (e) {
            console.log(e)
            message.error('Categoría no registrada');
        }
    }

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateMainCategory(itemToEdit.id, values);
            dispatch(getMainCategories(currentNode.id));
            message.success('Categoría actualizada');
        } catch (e) {
            console.log(e)
            message.error('Categoría no actualizada');
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteMainCategory(id);
            dispatch(getMainCategories(currentNode.id));
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
                <SearchCatalogs
                    setLoading={setLoading}
                    listComplete={list_main_categories}
                    setItemsFilter={setMainData}
                    setOpenModal={setOpenModal}
                />
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
                    itemToEdit={itemToEdit}
                    setItemToEdit={setItemToEdit}
                    itemsToDelete={itemsToDelete}
                    setItemsToDelete={setItemsToDelete}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    extraOptions={extraOptions}
                />
            </Col>
        </Row> 
    )
}

export default ViewCategories;