import React, { useState, useEffect, useMemo } from 'react';
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
import { useRouter } from 'next/router';
import ModalPositions from './ModalPositions';
import ListItems from '../../../common/ListItems';
import moment from 'moment';

const TabPositions = ({
    action,
    setInfoPositions,
    infoPositions
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoPosition(router.query.id);
        }
    },[router.query?.id])

    const getInfoPosition = async (id) =>{
        try {
            setLoading(true);
            let response = await WebApiJobBank.getCandidateLastJob(id, '&paginate=0');
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
            message.success('Puesto registrado');
            getInfoPosition(router.query.id);
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Puesto no registrado');
        }
    }

    const actionUpdate = async (values) =>{
        try {
            setLoading(true)
            let body = {...values, candidate: router.query.id};
            await WebApiJobBank.updateCandidateLastJob(itemToEdit.id, body);
            message.success('Puesto actualizado');
            getInfoPosition(router.query.id);
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Puesto no actualizado');
        }
    }

    const actionDelete = async () =>{
        try {
            setLoading(true)
            let id = itemsToDelete.at(-1).id;
            await WebApiJobBank.deleteCandidateLastJob(id);
            message.success('Puesto eliminado');
            getInfoPosition(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Puesto no eliminado');
            setLoading(false)
        }
    }

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])
    
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
            title: 'Empresa',
            dataIndex: 'company',
            key: 'company'
        },
        {
            title: 'Sector',
            dataIndex: ['sector', 'name'],
            key: ['sector', 'name']
        },
        {
            title: 'Puesto',
            dataIndex: 'position_name',
            key: 'position_name'
        },
        {
            title: 'Fecha inicio',
            render: (item) =>{
                return(
                    <span>{item.start_date ? moment(item.start_date).format('DD-MM-YYYY') : ''}</span>
                )
            }
        },
        {
            title: 'Fecha finalización',
            render: (item) =>{
                return(
                    <span>{item.end_date ? moment(item.end_date).format('DD-MM-YYYY') : ''}</span>
                )
            }
        },
        {
            // title: ()=>{
            //     return(
            //         <Dropdown overlay={menuTable}>
            //             <Button size='small'>
            //                 <EllipsisOutlined />
            //             </Button>
            //         </Dropdown>
            //     )
            // },
            title: ()=> (
                <Button size='small' onClick={()=> setOpenModal(true)}>
                    Agregar
                </Button>
            ),
            width: 85,
            align: 'center',
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
                dataSource={infoPositions}
                locale={{ emptyText: loading
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalPositions
                title={isEdit ? 'Editar puesto' : 'Agregar puesto'}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={isEdit ? actionUpdate : actionCreate}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
            />
           <ListItems
                title='¿Estás seguro de eliminar este puesto?'
                visible={openModalDelete}
                keyTitle='company'
                keyDescription='position_name'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
            />
        </>
    )
}

export default TabPositions