import React, { useState, useEffect } from 'react';
import {
    Table,
    Dropdown,
    Menu,
    message,
    Button
} from 'antd';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined
} from '@ant-design/icons';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import ModalPositions from './ModalPositions';
import DeleteItems from '../../../common/DeleteItems';

const TabPositions = ({ sizeCol = 8, action }) => {

    const {
        list_sectors,
        load_sectors
    } = useSelector(state => state.jobBankStore);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});
    const [infoPositions, setInfoPositions] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoPosition(router.query.id);
        }
    },[router])

    const getInfoPosition = async (id) =>{
        try {
            setLoading(true);
            let response = await WebApiJobBank.getCandidateLastJob(id);
            setInfoPositions(response.data);
            setLoading(false);
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionCreate = async (values) =>{
        try {
            setLoading(true);
            let body = {...values, candidate: router.query.id};
            await WebApiJobBank.createCandidateLastJob(body);
            message.success('Posición registrada');
            getInfoPosition(router.query.id);
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Posición no registrada');
        }
    }

    const actionUpdate = async (values) =>{
        try {
            setLoading(true)
            let body = {...values, candidate: router.query.id};
            await WebApiJobBank.updateCandidateLastJob(itemToEdit.id, body);
            message.success('Posición actualizada');
            getInfoPosition(router.query.id);
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Posición no actualizada');
        }
    }

    const actionDelete = async () =>{
        try {
            setLoading(true)
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteCandidateLastJob(id);
            message.success('Posición eliminada');
            getInfoPosition(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Posición no eliminada');
            setLoading(false)
        }
    }

    const validateAction = () => Object.keys(itemToEdit).length > 0;
    
    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<PlusOutlined/>}
                    onClick={()=> setOpenModal(true)}
                >
                    Agregar
                </Menu.Item>
            </Menu>
        );
    };

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
        );
    };

    const columns = [
        {
            title: 'Posición',
            dataIndex: 'position_name',
            key: 'position_name'
        },
        {
            title: 'Empresa',
            dataIndex: 'company',
            key: 'company'
        },
        {
            title: ()=>{
                return(
                    <Dropdown overlay={menuTable}>
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            },
            render: (item) =>{
                return(
                    <Dropdown overlay={()=> menuItem(item)}>
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
            <Table
                rowKey='id'
                className='table-custom'
                size='small'
                columns={columns}
                loading={loading}
                dataSource={infoPositions.results}
                locale={{ emptyText: loading
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    total: infoPositions.count,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            {openModal && (
                <ModalPositions
                    title={validateAction() ? 'Editar posición' : 'Agregar posición'}
                    visible={openModal}
                    close={closeModal}
                    itemToEdit={itemToEdit}
                    actionForm={validateAction() ? actionUpdate : actionCreate}
                    textSave={validateAction() ? 'Actualizar' : 'Guardar'}
                />
           )}
           {openModalDelete && (
                <DeleteItems
                    title='¿Estás seguro de eliminar esta posición?'
                    visible={openModalDelete}
                    keyTitle='position_name'
                    close={closeModalDelete}
                    itemsToDelete={itemsToDelete}
                    actionDelete={actionDelete}
                />
           )}
        </>
    )
}

export default TabPositions