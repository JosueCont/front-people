import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Dropdown,
    Menu,
    Button
} from 'antd';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    DownloadOutlined,
    EyeOutlined
} from '@ant-design/icons';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import ListItems from '../../../../common/ListItems';
import moment from 'moment';
import ModalFile from './ModalFile';
import { popupPDF, downloadCustomFile } from '../../../../utils/functions';

const TableFile = ({
    infoFiles = [],
    loading = false,
    titleCreate = 'Agregar archivo',
    titleUpdate = 'Actualizar archivo',
    titleDelete = '¿Estás seguro de eliminar este archivo?',
    actionUpdate = () =>{},
    actionCreate = () =>{},
    actionDelete = () =>{}
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);
    
    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])

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
                    onClick={() => openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item
                    key='3'
                    icon={<EyeOutlined/>}
                    onClick={()=> popupPDF({url: item.file})}
                >
                    Visualizar
                </Menu.Item>
                <Menu.Item
                    key='4'
                    icon={<DownloadOutlined/>}
                    onClick={()=> downloadCustomFile({
                        url: item.file,
                        name: item.file?.split('/')?.at(-1)
                    })}
                >
                    Descargar
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Archivo',
            render: (item) =>{
                return(
                    <>{item.file ? item.file?.split('/')?.at(-1) : null}</>
                )
            }
        },
        {
            title: 'Fecha de carga',
            render: (item) =>{
                return(
                    <>{moment(item.fecha, 'DD-MM-YYYY').format('DD-MM-YYYY')}</>
                )
            }
        },
        {
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
                dataSource={infoFiles}
                locale={{ emptyText: loading
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalFile
                title={isEdit ? titleUpdate : titleCreate}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={(values) => isEdit ? actionUpdate(itemToEdit, values) : actionCreate(values)}
                textSave={isEdit ? 'Actualizar' : 'Guardar'}
            />
            <ListItems
                title={titleDelete}
                visible={openModalDelete}
                keyTitle='name'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={() => actionDelete(itemsToDelete)}
            />
        </>
    )
}

export default TableFile