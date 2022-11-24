import React, { useState, useEffect } from 'react';
import {
    Table,
    Dropdown,
    Button,
    Menu
} from 'antd';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import ModalCatalogs from './ModalCatalogs';
import DeleteItems from '../../../common/DeleteItems';

const TableCatalogs = ({
    titleEdit = '',
    titleCreate = '',
    titleDelete = '',
    actionCreate = ()=>{},
    actionUpdate = ()=>{},
    actionDelete =()=>{},
    catalogResults = [],
    catalogLoading = false,
    setItemToEdit,
    itemToEdit,
    setItemsToDelete,
    itemsToDelete,
    openModal,
    setOpenModal,
    //No requeridos
    useModal = true,
    extraFields = <></>,
    extraOptions = ()=> <></>
}) => {
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const validateAction = () => Object.keys(itemToEdit).length > 0;

    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

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
                {extraOptions(item)}
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
            title: 'Acciones',
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
                size='small'
                rowKey='id'
                columns={columns}
                dataSource={catalogResults}
                loading={catalogLoading}
                locale={{ emptyText: catalogLoading
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            {openModal && useModal && (
                <ModalCatalogs
                    title={validateAction() ? titleEdit : titleCreate}
                    visible={openModal}
                    close={closeModal}
                    itemToEdit={itemToEdit}
                    actionForm={validateAction() ? actionUpdate : actionCreate}
                    textSave={validateAction() ? 'Actualizar' : 'Guardar'}
                >{extraFields}</ModalCatalogs>
            )}
            {openModalDelete && (
                <DeleteItems
                    title={titleDelete}
                    visible={openModalDelete}
                    keyTitle='name'
                    close={closeModalDelete}
                    itemsToDelete={itemsToDelete}
                    actionDelete={actionDelete}
                />
            )}  
        </>
    )
}

export default TableCatalogs;