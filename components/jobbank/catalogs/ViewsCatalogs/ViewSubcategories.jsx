import React, { useState, useEffect } from 'react';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ruleRequired } from '../../../../utils/rules';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import { getMainCategories } from '../../../../redux/jobBankDuck';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';

const ViewSubcategories = ({
    filtersString,
    currentPage
 }) => {

    const {
        list_main_categories,
        load_main_categories,
    } = useSelector(state => state.jobBankStore);
    const currentNode = useSelector(state => state.userStore.current_node);
    const router = useRouter();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainData, setMainData] = useState({});

    useEffect(()=>{
        if(!currentNode) return;
        getSubCategories(currentNode.id, filtersString);
    },[currentNode, filtersString])
    
    useEffect(()=>{
        if(!currentNode) return;
        dispatch(getMainCategories(currentNode.id));
    },[currentNode])

    const getSubCategories = async (node, query = '') =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getSubCategories(node, query);
            setMainData(response.data)
            setLoading(false)
        } catch (e) {
            setLoading(false)
            console.log(e)
        }
    }

    const actionCreate = async (values) =>{
        try {
            await WebApiJobBank.createSubCategory({...values, node: currentNode.id});
            getSubCategories(currentNode.id, filtersString);
            message.success('Subcategoría registrada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.message;
            let msg = error
                ? 'Este nombre ya existe con la misma categoría'
                : 'Subcategoría no registrada';
            message.error(msg);
        }
    }

    const actionUpdate = async (id, values) =>{
        try {
            await WebApiJobBank.updateSubCategory(id, values);
            getSubCategories(currentNode.id, filtersString);
            message.success('Subcategoría actualizada');
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.message;
            let msg = error
                ? 'Este nombre ya existe con la misma categoría'
                : 'Subcategoría no actualizada';
            message.error(msg);
        }
    }

    const actionDelete = async (id) =>{
        try {
            await WebApiJobBank.deleteSubCategory(id);
            getSubCategories(currentNode.id, filtersString);
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
                <SearchCatalogs setOpenModal={setOpenModal}/>
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
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    extraFields={<SelectCategory/>}
                    numPage={currentPage}
                />
            </Col>
        </Row> 
    )
}

export default ViewSubcategories;