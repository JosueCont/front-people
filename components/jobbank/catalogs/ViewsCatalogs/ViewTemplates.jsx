import React, { useState, useEffect } from 'react';
import { Row, Col, message, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { getProfilesTypes } from '../../../../redux/jobBankDuck';
import SearchCatalogs from '../SearchCatalogs';
import TableCatalogs from '../TableCatalogs';
import { useRouter } from 'next/router';

const ViewTemplates = () => {

    const {
        list_profiles_types,
        load_profiles_types
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
        dispatch(getProfilesTypes(currentNode.id));
    },[currentNode])

    useEffect(()=>{
        setLoading(load_profiles_types);
    },[load_profiles_types])
    
    useEffect(()=>{
        setMainData(list_profiles_types);
    },[list_profiles_types])

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteProfileType(id);
            dispatch(getProfilesTypes(currentNode.id));
            message.success('Template eliminado');
        } catch (e) {
            console.log(e)
            message.error('Template no eliminado');
        }
    }

    const openModalEdit = (item) =>{
        router.push({
            pathname: '/jobbank/settings/catalogs/profiles/edit',
            query: { id: item.id}
        })
    }

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <SearchCatalogs
                    setLoading={setLoading}
                    actionBtn={()=> router.push('/jobbank/settings/catalogs/profiles/add')}
                    listComplete={list_profiles_types}
                    setItemsFilter={setMainData}
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
                    itemToEdit={itemToEdit}
                    setItemToEdit={setItemToEdit}
                    itemsToDelete={itemsToDelete}
                    setItemsToDelete={setItemsToDelete}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    actionBtnEdit={openModalEdit}
                />
            </Col>
        </Row> 
    )
}

export default ViewTemplates;