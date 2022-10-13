import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch
} from 'antd';
import ModalClients from './ModalClients';
import DeleteClients from './DeleteClients';
import {
    ClearOutlined,
    SearchOutlined,
    FileTextOutlined,
    PlusCircleOutlined,
    CloseOutlined,
    EllipsisOutlined,
    DeleteOutlined,
    SyncOutlined,
    EditOutlined,
    EyeOutlined,
    EyeInvisibleOutlined
} from "@ant-design/icons";
import { connect } from 'react-redux';
import {
    getClients,
    setPage
} from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';

const TableClients = ({
    list_clients,
    load_jobbank,
    setPage,
    page_jobbank,
    currentNode,
    getClients
}) => {

    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateClient(itemToEdit.id, values);
            getClients(currentNode.id)
            message.success('Información actualizada');
        } catch (e) {
            message.error('Información no actualizada');
            console.log(e)
        }
    }

    const actionActive = async (checked, item) =>{
        try {
            await WebApiJobBank.activeClient(item.id, {is_active: checked});
            getClients(currentNode.id)
            if(checked) message.success('Cliente activado');
            if(!checked) message.success ('Cliente desactivado');
        } catch (e) {
            console.log(e)
            getClients(currentNode.id)
            if(checked) message.error('Cliente no activado');
            if(!checked) message.error('Cliente no desactivado');
        }
    }

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item=> item.id);
        closeModalDelete();
        try {
            getClients(currentNode.id);
            console.log('eliminar is_deleted', ids)
            if(ids.length > 1) message.success('Clientes eliminados');
            else message.success('Cliente eliminado');
        } catch (e) {
            console.log(e)
            if(ids.length > 1) message.error('Clientes no eliminados');
            else message.error('Cliente no eliminado');
        }
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsKeys([])
        setItemsToDelete([])
    }

    const openModalManyDelete = () =>{
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos clientes')
        }
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const openModalEdit = (item)=>{
        setItemToEdit(item)
        setOpenModal(true)
    }

    const onChangePage = ({current}) =>{
        setPage(current)
        if (current == 1) getClients(currentNode?.id);
        if (current > 1) {
            const offset = (current - 1) * 10;
            const queryParam = `&limit=10&offset=${offset}`;
            getClients(currentNode?.id, queryParam, current)
        } 
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows)
        }
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key={1}
                    icon={<DeleteOutlined/>}
                    onClick={()=>openModalManyDelete()}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key={1}
                    icon={<EditOutlined/>}
                    onClick={()=> openModalEdit(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key={2}
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
            render: ({name})=>{
                return(
                    <span>{name}</span>
                )
            }
        },
        {
            title: 'Contacto',
            render: ({job_contact}) =>{
                return(
                    <span>{job_contact}</span>
                )
            }
        },
        {
            title: 'Correo',
            render: ({email_contact}) =>{
                return (
                    <span>{email_contact}</span>
                )
            }
        },
        {
            title: 'Teléfono',
            render: ({phone_contact})=>{
                return (
                    <span>{phone_contact}</span>
                )
            }
        },
        {
            title: 'Activo',
            render: (item) =>{
                return(
                    <Switch
                        size={'small'}
                        defaultChecked={item.is_active}
                        onChange={(e)=> actionActive(e, item)}
                    />
                )
            }
        },
        {
            title: ()=> {
                return(
                    <Dropdown overlay={menuTable}>
                        <Button size={'small'}>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            },
            render: (item) =>{
                return (
                    <Dropdown overlay={()=> menuItem(item)}>
                        <Button size={'small'}>
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
                size={'small'}
                rowKey={'id'}
                columns={columns}
                dataSource={list_clients.results}
                loading={load_jobbank}
                rowSelection={rowSelection}
                onChange={onChangePage}
                locale={{
                    emptyText: load_jobbank
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_clients.count,
                    current: page_jobbank,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalClients
                title={'Editar cliente'}
                visible={openModal}
                actionForm={actionUpdate}
                close={()=> setOpenModal(false)}
                itemToEdit={itemToEdit}
            />
            <DeleteClients
                visible={openModalDelete}
                close={closeModalDelete}
                itemsToDelete={itemsToDelete}
                actionDelete={actionDelete}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_clients: state.jobBankStore.list_clients,
        load_jobbank: state.jobBankStore.load_jobbank,
        page_jobbank: state.jobBankStore.page_jobbank,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        getClients,
        setPage
    }
)(TableClients);