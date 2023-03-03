import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Table, Row, Col, Menu, Dropdown, Button, message } from 'antd';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { optionsStatusAsignament, optionsSourceType } from '../../../../utils/constant';
import { SearchOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ModalCustomer from './ModalCustomer';
import ListItems from '../../../../common/ListItems';

const TabCustomer = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [vacantAssets, setVacantAssests] = useState([]);
    const [clientAssets, setClientAssets] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete ] = useState ([]);

    useEffect(()=>{
        if(!router.query?.id) return;
        getVacantAssets(router.query?.id);
    },[router.query?.id])

    useEffect(()=>{
        if(!router.query?.vacant) return;
        getEvaluationsVacant(router.query?.vacant);
    },[router.query?.vacant])

    const getVacantAssets = async (id) =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getVacancyAssesmentCandidateVacancy(id);
            let data = response?.data?.results ?? [];
            setVacantAssests(data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const getEvaluationsVacant = async (id) =>{
        try {
            setFetching(true)
            let response = await WebApiJobBank.getEvaluationsVacant(id);
            let data = response?.data?.results ?? [];
            const filter_ = item => item.source == 2;
            setClientAssets(data.filter(filter_));
            setFetching(false)
            console.log("🚀 ~ file: TabCustomer.jsx:40 ~ getEvaluationsVacant ~ response:", response)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const actionCreate = async (values) =>{
        try {
            let body = {...values, candidate_vacancy: router.query?.id};
            await WebApiJobBank.addVacancyAssesmentCandidateVacancy(body);
            message.success('Evaluación registrada')
            getVacantAssets(router.query?.id)
        } catch (e) {
            console.log(e)
            message.error('Evaluación no registrada')
        }
    }

    const actionUpdate = async (values) =>{
        try {
            let body = {...values, candidate_vacancy: router.query?.id};
            await WebApiJobBank.editVacancyAssesmentCandidateVacancy(itemToEdit.id, body);
            message.success('Evaluación actualizada')
            getVacantAssets(router.query?.id)
        } catch (e) {
            console.log(e)
            message.error('Evaluación no actualizada')
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1)?.id;
            await WebApiJobBank.deleteVacancyAssesmentCandidateVacancy(id);
            message.success('Evaluación eliminada')
            getVacantAssets(router.query?.id)
        } catch (e) {
            console.log(e)
            message.error('Evaluación no eliminada')
        }
    }

    const getStatus = (item) =>{
        const find_ = record => record.value == item.status;
        let result = optionsStatusAsignament.find(find_);
        if(!result) return null;
        return result.label;
    }

    const getType = (item) =>{
        const find_ = record => record.value == item.vacant_assessment?.source;
        let result = optionsSourceType.find(find_);
        if(!result) return null;
        return result.label;
    }

    const openModalEdit = (item) =>{
        setOpenModal(true)
        setItemToEdit(item)
    }

    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const openModalRemove = (item) =>{
        setOpenModalDelete(true)
        setItemsToDelete([item])
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    const isEdit = useMemo(()=> Object.keys(itemToEdit).length > 0, [itemToEdit]);

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> openModalEdit(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    onClick={()=> openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        )
    }

    const columns = [
        {
            title: 'Evaluación',
            dataIndex: ['vacant_assessment', 'name'],
            key: ['vacant_assessment', 'name']
        },
        {
            title: 'Usuario',
            dataIndex: 'user',
            key: 'user'
        },
        {
            title: 'Tipo',
            render: (item)=>{
                return(
                    <>{getType(item)}</>
                )
            }
        },
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <>{getStatus(item)}</>
                )
            }
        },
        {
            // title: 'Acciones',
            title: ()=>{
                return(
                    <Button
                        size='small'
                        onClick={()=> setOpenModal(true)}
                    >
                        Agregar
                    </Button>
                )
            },
            width: 100,
            render: (item) => {
                return( 
                    <Dropdown overlay={() => menuItem(item)}>
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        }
    ]

    return (
        <>
            <Row gutter={[0,24]}>
                <Col span={24}>
                    <Table
                        rowKey='id'
                        size='small'
                        className='table-custom'
                        columns={columns}
                        loading={loading}
                        dataSource={vacantAssets}
                        pagination={{
                            hideOnSinglePage: true,
                            showSizeChanger: false,
                        }}
                    />
                </Col>
            </Row>
            <ModalCustomer
                title={isEdit ? 'Actualizar evaluación' : 'Agregar evaluación'}
                visible={openModal}
                itemToEdit={itemToEdit}
                close={closeModal}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
                actionForm={isEdit ? actionUpdate : actionCreate}
                clientAssets={clientAssets}
                fetching={fetching}
            />
            <ListItems
                title='¿Estás seguro de eliminar esta evaluación?'
                visible={openModalDelete}
                keyTitle='vacant_assessment, name'
                keyDescription='user'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
            />
        </>
    )
}

export default TabCustomer