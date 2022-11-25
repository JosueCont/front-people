import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch,
    Space,
    Tag,
    Tooltip
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
    UserOutlined
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
    getClients
}) => {

    const router = useRouter();
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalList, setOpenModalList] = useState(false);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemsToDelete, setItemsToDelete] = useState([]);

    const actionStatus = async (checked, item) =>{
        try {
            await WebApiJobBank.updateClientStatus(item.id, {is_active: checked});
            getClientsWithFilters();
            if(checked) message.success('Cliente activado');
            if(!checked) message.success ('Cliente desactivado');
        } catch (e) {
            console.log(e)
            if(checked) message.error('Cliente no activado');
            if(!checked) message.error('Cliente no desactivado');
        }
    }

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item=> item.id);
        try {
            await WebApiJobBank.deleteClient({ids});
            getClientsWithFilters();
            if(ids.length > 1) message.success('Clientes eliminados');
            else message.success('Cliente eliminado');
        } catch (e) {
            console.log(e)
            if(ids.length > 1) message.error('Clientes no eliminados');
            else message.error('Cliente no eliminado');
        }
    }

    const getClientsWithFilters = () =>{
        let page = parseInt(router.query?.page);
        let num = isNaN(page) ? 1 : page;
        let filters = getFiltersJB(router.query);
        getClients(currentNode.id, filters, num);
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
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos clientes')
        }
    }

    const openModalRemove = (item) =>{
        if(item.has_estrategy){
            let msg = `Este cliente no se puede eliminar,
            ya que se encuentra asociado a una estrategia.`;
            message.error({content: msg, duration: 4});
            return;
        }
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const showModalList = (item) =>{
        setOpenModalList(true);
        setItemToEdit(item)
    }

    const savePage = (query) => router.replace({
        pathname: '/jobbank/clients',
        query
    })

    const onChangePage = ({current}) =>{
        if(current > 1) savePage({...router.query, page: current});
        else{
            let newQuery = {...router.query};
            if(newQuery.page) delete newQuery.page;
            savePage(newQuery)
        }
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
                {item.contact_list ? item.contact_list.length : 0}
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