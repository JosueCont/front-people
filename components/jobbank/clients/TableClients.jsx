import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch,
    Space,
    Tag,
    Tooltip,
    Modal
} from 'antd';
import { useRouter } from 'next/router';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    FileTextOutlined,
    PlusOutlined,
    LinkOutlined,
    UserOutlined,
    SettingOutlined
} from "@ant-design/icons";
import { connect } from 'react-redux';
import { getClients } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import DeleteItems from '../../../common/DeleteItems';
import Clipboard from '../../../components/Clipboard';
import ViewContacts from './ViewContacts';
import { getFiltersJB } from '../../../utils/functions';

const TableClients = ({
    list_clients,
    load_clients,
    jobbank_page,
    currentNode,
    getClients,
    currentFilters,
    currentPage
}) => {

    const router = useRouter();
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalList, setOpenModalList] = useState(false);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [viewAsList, setViewAsList] = useState(false);

    const actionStatus = async (checked, item) =>{
        try {
            await WebApiJobBank.updateClientStatus(item.id, {is_active: checked});
            getClients(currentNode.id, currentFilters, currentPage);
            let msg = checked ? 'Cliente activado' : 'Cliente desactivado';
            message.success(msg)
        } catch (e) {
            console.log(e)
            let msg = checked ? 'Cliente no activado' : 'Cliente no desactivado';
            message.error(msg)
        }
    }

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item=> item.id);
        try {
            await WebApiJobBank.deleteClient({ids});
            getClients(currentNode.id, currentFilters, currentPage);
            let msg = ids.length > 1 ? 'Clientes eliminados' : 'Cliente eliminado';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msgTxt = e.response?.data?.message;
            let msg = msgTxt ?? ids.length > 1
                ? 'Clientes no eliminados'
                : 'Cliente no eliminado';
            message.error(msg);
        }
    }

    const closeModalList = () =>{
        setOpenModalList(false);
        setItemToEdit({});
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsKeys([])
        setItemsToDelete([])
    }

    const openModalManyDelete = () =>{
        const filter_ = item => item.has_estrategy;
        let notDelete = itemsToDelete.filter(filter_);
        if(notDelete.length > 0){
            setViewAsList(true)
            setOpenModalDelete(true)
            setItemsToDelete(notDelete)
            return;
        }
        setViewAsList(false);
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
            return;
        }
        setOpenModalDelete(false)
        message.error('Selecciona al menos dos clientes')
    }

    const openModalRemove = (item) =>{
        setViewAsList(item.has_estrategy)
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const showModalList = (item) =>{
        setOpenModalList(true);
        setItemToEdit(item)
    }

    const titleDelete = useMemo(()=>{
        if(viewAsList){
            return itemsToDelete.length > 1
            ? `Estos clientes no se pueden eliminar,
                ya que se encuentran asociados a una estrategia.`
            : `Este cliente no se puede eliminar, ya que
                se encuentra asociado a una estrategia`;
        }
        return itemsToDelete.length > 1
            ? '¿Estás seguro de eliminar estos clientes?'
            : '¿Estás seguro de eliminar este cliente?';
        
    },[viewAsList, itemsToDelete])

    const savePage = (query) => router.replace({
        pathname: '/jobbank/clients',
        query
    })

    const onChangePage = ({current}) =>{
        let newQuery = {...router.query, page: current};
        if(current > 1){
            savePage(newQuery);
            return;
        }
        if(newQuery.page) delete newQuery.page;
        savePage(newQuery)
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows)
        }
    }

    const ViewList = ({item}) => (
        <Space>
            {item.contact_list?.length > 0 ? (
                <Tooltip title='Ver contactos'>
                    <EyeOutlined
                        style={{cursor: 'pointer'}}
                        onClick={()=>showModalList(item)}
                    />
                </Tooltip>
            ):(
                <EyeInvisibleOutlined />
            )}
            <Tag
                icon={<UserOutlined style={{color:'#52c41a'}} />}
                color='green' style={{fontSize: '14px'}}
            >
                {item.contact_list ? item.contact_list?.length : 0}
            </Tag>
        </Space>
    )

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
                    onClick={()=> router.push({
                        pathname: '/jobbank/clients/edit',
                        query: {...router.query, id: item.id }
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
                {item.is_active && (
                    <>
                        <Menu.Divider/>
                        <Menu.Item
                            key='3'
                            icon={<PlusOutlined />}
                            onClick={()=> router.push({
                                pathname: '/jobbank/vacancies/add',
                                query: {...router.query, client: item.id }
                            })}
                        >
                            Registrar vacante
                        </Menu.Item>
                        <Menu.Item
                            key='4'
                            icon={<PlusOutlined />}
                            onClick={()=> router.push({
                                pathname: '/jobbank/profiles/add',
                                query: {...router.query, client: item.id }
                            })}
                        >
                            Registrar template
                        </Menu.Item>
                        <Menu.Item
                            key='5'
                            icon={<PlusOutlined />}
                            onClick={()=> router.push({
                                pathname: '/jobbank/strategies/add',
                                query: {...router.query, client: item.id }
                            })}
                        >
                            Registrar estrategia
                        </Menu.Item>
                        <Menu.Item
                            key='3'
                            icon={<SettingOutlined />}
                            onClick={()=> router.push({
                                pathname: '/jobbank/publications/add',
                                query: {...router.query, client: item.id }
                            })}
                        >
                            Configurar publicación
                        </Menu.Item>
                    </>
                )}
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
            title: 'RFC',
            dataIndex: 'rfc',
            key: 'rfc'
        },
        {
            title: 'Contactos',
            render: (item) => <ViewList item={item}/>
        },
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <Switch
                        size='small'
                        defaultChecked={item.is_active}
                        checked={item.is_active}
                        checkedChildren="Activo"
                        unCheckedChildren="Inactivo"
                        onChange={(e)=> actionStatus(e, item)}
                    />
                )
            }
        },
        {
            title: ()=> {
                return(
                    <Dropdown overlay={menuTable}>
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            },
            render: (item) =>{
                return (
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
            <DeleteItems
                title={titleDelete}
                visible={openModalDelete}
                keyTitle='name'
                keyDescription='rfc'
                close={closeModalDelete}
                itemsToDelete={itemsToDelete}
                actionDelete={actionDelete}
                textCancel={viewAsList ? 'Cerrar' : 'Cancelar'}
                viewAsList={viewAsList}
            />
           <ViewContacts
                visible={openModalList}
                itemContact={itemToEdit}
                close={closeModalList}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_clients: state.jobBankStore.list_clients,
        load_clients: state.jobBankStore.load_clients,
        jobbank_page: state.jobBankStore.jobbank_page,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getClients }
)(TableClients);