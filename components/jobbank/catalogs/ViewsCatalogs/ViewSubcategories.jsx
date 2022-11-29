import React, { useState, useEffect } from 'react';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ruleRequired } from '../../../../utils/rules';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import {
    getSubCategories,
    getMainCategories
} from '../../../../redux/jobBankDuck';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewSubcategories = () => {

    const {
        list_sub_categories,
        load_sub_categories,
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
        dispatch(getSubCategories(currentNode.id));
        dispatch(getMainCategories(currentNode.id));
    },[currentNode])

    useEffect(()=>{
        setLoading(load_sub_categories);
    },[load_sub_categories])
    
    useEffect(()=>{
        setMainData(list_sub_categories);
    },[list_sub_categories])

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createSubCategory({...values, node: currentNode.id});
            dispatch(getSubCategories(currentNode.id));
            message.success('Subcategoría registrada');
        } catch (e) {
            console.log(e)
            message.error('Subcategoría no registrada');
        }
    }

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateSubCategory(itemToEdit.id, values);
            dispatch(getSubCategories(currentNode.id));
            message.success('Subcategoría actualizada');
        } catch (e) {
            console.log(e)
            message.error('Subcategoría no actualizada');
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteSubCategory(id);
            dispatch(getSubCategories(currentNode.id));
            message.success('Subcategoría eliminada');
        } catch (e) {
            console.log(e)
            message.error('Subcategoría no eliminada');
        }
    }

    const SelectCategory = () => (
        <Form.Item
            name='category'
            label='Categoría'
            rules={[ruleRequired]}
        >
            <Select
                allowClear
                showSearch
                disabled={router.query?.category}
                placeholder='Seleccionar una categoría'
                notFoundContent='No se encontraron resultados'
                optionFilterProp='children'
                loading={load_main_categories}
            >
                {list_main_categories?.length > 0 && list_main_categories.map(item => (
                    <Select.Option value={item.id} key={item.name}>
                        {item.name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    )

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    setLoading={setLoading}
                    setOpenModal={setOpenModal}
                    listComplete={list_sub_categories}
                    setItemsFilter={setMainData}
                />
            </Col>
            <Col span={24}>
                <TableCatalogs
                    titleCreate='Agregar subcategoría'
                    titleEdit='Editar subcategoría'
                    titleDelete='¿Estás seguro de eliminar esta subcategoría?'
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
                    extraFields={<SelectCategory/>}
                />
            </Col>
        </Row> 
    )
}

export default ViewSubcategories;