import React, { useState, useEffect } from 'react';
import { Alert, Button, Table, message, Menu, Dropdown } from 'antd';
import { valueToFilter} from '../../../utils/functions';
import {
    CloseOutlined,
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined
} from '@ant-design/icons';
import ModalContact from './ModalContact';
import DeleteItems from '../../../common/DeleteItems';

const TabContact = ({
    contactList,
    setContactList,
    formClients
}) => {

    const [itemToEdit, setItemToEdit] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemsToDelete, setItemsToDelete] = useState([]);

    const actionCreate = (values) =>{
        // const some_ = item => valueToFilter(item.name) == valueToFilter(values.name);
        // let exist = contactList.some(some_);
        // if(exist){
        //     message.error('Este nombre ya existe');
        //     return;
        // }
        let newList = [...contactList, values];
        setContactList(newList);
    }

    const actionUpdate = (values) =>{
        // const filter_ = (item, idx) => valueToFilter(item.name) == valueToFilter(values.name);
        // let results = contactList.filter(filter_);
        // if(results.length > 1){
        //     message.error('Este nombre ya existe');
        //     return;
        // }
        const updItem = (item, idx) =>
            itemToEdit.index == idx
                ? {...item, ...values}
                : item;
        let newList = contactList.map(updItem);
        setContactList(newList);
    }

    const actionDelete = () =>{
        let index = itemsToDelete?.at(-1)?.index;
        let newList = [...contactList];
        newList.splice(index, 1);
        setContactList(newList);
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

    const closeModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsToDelete([])
    }

    const validateAction = () => Object.keys(itemToEdit).length > 0;

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
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Puesto',
            dataIndex: 'job_position',
            key: 'job_position'
        },
        {
            title: 'Correo',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Teléfono',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: ()=> (
                <Button size='small' onClick={()=> setOpenModal(true)}>
                    Agregar
                </Button>
            ),
            width: 85,
            align: 'center',
            render: (item, record, index)=> (
                <Dropdown overlay={()=> menuItem({...item, index})}>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            )
        }
    ]

    return (
        <>
            <Alert
                message={`Al modificar, eliminar o agregar nuevo contacto
                es necesario "Guardar/Actualizar" para almacenar los cambios realizados, de lo
                contrario estos se perderán.`}
                type="warning"
                showIcon
                style={{marginBottom: 16}}
            />
            <Table
                className='table-custom'
                size='small'
                rowKey={(item, idx)=> idx}
                columns={columns}
                dataSource={contactList}
                locale={{ emptyText: contactList.length > 0
                    ? 'Cargando...'
                    : 'No se encontraron resultados'
                }}
                pagination={{
                    total: contactList.length,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalContact
                title={validateAction() && openModal ? 'Editar contacto' : 'Agregar contacto'}
                visible={openModal}
                close={closeModal}
                itemToEdit={itemToEdit}
                actionForm={validateAction() && openModal ? actionUpdate : actionCreate}
                textSave={validateAction() && openModal ? 'Actualizar' : 'Guardar'}
            />
            <DeleteItems
                title='¿Estás seguro de eliminar este contacto?'
                visible={openModalDelete}
                keyTitle='name'
                close={closeModalDelete}
                itemsToDelete={itemsToDelete}
                actionDelete={actionDelete}
                timeLoad={1000}
            />
        </>
    )
}

export default TabContact