import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch,
    Space,
    Tag
} from 'antd';
import { useRouter } from 'next/router';
import ModalClients from './ModalClients';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    FileTextOutlined,
    PlusOutlined,
    LinkOutlined
} from "@ant-design/icons";
import { connect } from 'react-redux';
import {
    getClients,
    setJobbankPage
} from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import DeleteItems from '../../../common/DeleteItems';
import Clipboard from '../../../components/Clipboard';

const TableClients = ({
    list_clients,
    load_clients,
    setJobbankPage,
    jobbank_page,
    currentNode,
    getClients,
    jobbank_filters
}) => {

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateClient(itemToEdit.id, values);
            validateGetClients();
            message.success('Información actualizada');
            return true;
        } catch (e) {
            console.log(e)
            if(e.response?.data['rfc']){
                message.error('RFC ya registrado');
                return 'RFC_EXIST';
            } else message.error('Información no actualizada');
            return false;
        }
    }

    const actionActive = async (checked, item) =>{
        try {
            await WebApiJobBank.activeClient(item.id, {is_active: checked});
            validateGetClients();
            if(checked) message.success('Cliente activado');
            if(!checked) message.success ('Cliente desactivado');
        } catch (e) {
            console.log(e)
            validateGetClients();
            if(checked) message.error('Cliente no activado');
            if(!checked) message.error('Cliente no desactivado');
        }
    }

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item=> item.id);
        closeModalDelete();
        try {
            await WebApiJobBank.deleteClient({ids});
            validateGetClients();
            if(ids.length > 1) message.success('Clientes eliminados');
            else message.success('Cliente eliminado');
        } catch (e) {
            console.log(e)
            if(ids.length > 1) message.error('Clientes no eliminados');
            else message.error('Cliente no eliminado');
        }
    }

    const closeModalEdit = () =>{
        setOpenModal(false)
        setItemToEdit({})
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
        setJobbankPage(current)
        validateGetClients(current)
    }

    const validateGetClients = (current) =>{
        let page = current ?? jobbank_page;
        if (page > 1) getClientsWithFilters(page);
        else getClients(currentNode?.id, jobbank_filters);
    }

    const getClientsWithFilters = (page) =>{
        let offset = (page - 1) * 10;
        let query = `&limit=10&offset=${offset}${jobbank_filters}`;
        getClients(currentNode?.id, query, page)
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
                <Menu.Item key='1'>
                    <Clipboard
                        text={`${window.location.origin}/jobbank/${currentNode.permanent_code}/client`}
                        title='Autoregistro'
                        border={false}
                        tooltipTitle='Copiar link de autoregistro'
                    />
                </Menu.Item>
                <Menu.Item
                    key='2'
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
                    key='1'
                    icon={<EditOutlined/>}
                    // onClick={()=> openModalEdit(item)}
                    onClick={()=> router.push({
                        pathname: '/jobbank/clients/edit',
                        query: { id: item.id }
                    })}
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
                <Menu.Divider/>
                <Menu.Item
                    key='3'
                    icon={<PlusOutlined />}
                    onClick={()=> router.push({
                        pathname: '/jobbank/vacancies/add',
                        query: { customer: item.id }
                    })}
                >
                    Registrar vacante
                </Menu.Item>
                <Menu.Item
                    key='4'
                    icon={<PlusOutlined />}
                    onClick={()=> router.push({
                        pathname: '/jobbank/profiles/add',
                        query: { customer: item.id }
                    })}
                >
                    Registrar perfil
                </Menu.Item>
                <Menu.Item
                    key='5'
                    icon={<PlusOutlined />}
                    onClick={()=> router.push({
                        pathname: '/jobbank/strategies/add',
                        query: { customer: item.id }
                    })}
                >
                    Registrar estrategia
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
            title: 'Contacto',
            dataIndex: 'job_contact',
            key: 'job_contact'
        },
        {
            title: 'Correo',
            dataIndex: 'email_contact',
            key: 'email_contact'
        },
        {
            title: 'Teléfono',
            dataIndex: 'phone_contact',
            key: 'phone_contact'
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
                loading={load_clients}
                rowSelection={rowSelection}
                onChange={onChangePage}
                locale={{
                    emptyText: load_clients
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_clients.count,
                    current: jobbank_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ModalClients
                title={'Editar cliente'}
                visible={openModal}
                actionForm={actionUpdate}
                close={closeModalEdit}
                itemToEdit={itemToEdit}
                textSave='Actualizar'
            />
            <DeleteItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estos clientes?'
                    : '¿Estás seguro de eliminar este cliente?'
                }
                visible={openModalDelete}
                keyTitle='name'
                keyDescription='business_name'
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
        load_clients: state.jobBankStore.load_clients,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        jobbank_page: state.jobBankStore.jobbank_page,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        getClients,
        setJobbankPage
    }
)(TableClients);