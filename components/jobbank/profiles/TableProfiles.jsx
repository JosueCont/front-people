import React, { useState } from 'react';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch
} from 'antd';
import { connect } from 'react-redux';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    CopyOutlined
} from '@ant-design/icons';
import { getProfilesList } from '../../../redux/jobBankDuck';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import WebApiJobBank from '../../../api/WebApiJobBank';

const TableProfiles = ({
    currentNode,
    jobbank_page,
    list_profiles,
    load_profiles,
    load_clients_options,
    list_clients_options,
    getProfilesList,
    currentPage,
    currentFilters
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item => item.id);
        try {
            await WebApiJobBank.deleteProfile({ids});
            getProfilesList(currentNode.id, currentFilters, currentPage);
            let msg = ids.length > 1 ? 'Templates eliminados' : 'Template eliminado';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = ids.length > 1 ? 'Templates no eliminados' : 'Template no eliminado';
            message.error(msg);
        }
    }

    const actionDuplicate = async (item) =>{
        const key = 'updatable';
        message.loading({content: 'Duplicando template...', key});
        try {
            await WebApiJobBank.duplicateProfile(item.id);
            setTimeout(()=>{
                message.success({content: 'Template duplicado', key});
                getProfilesList(currentNode.id, currentFilters, currentPage);
            },1000);
        } catch (e) {
            console.log(e);
            setTimeout(()=>{
                message.error({content: 'Template no duplicado', key});
            },1000)
        }
    }

    const getClient = (item) =>{
        if(!item.customer) return null;
        const client = record => record.id === item.customer;
        let _client = list_clients_options.find(client);
        if(!_client) return null;
        return _client.name;
    }

    const openModalManyDelete = () =>{
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos templates')
        }
    }

    const openModalRemove = (item) =>{
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsKeys([])
        setItemsToDelete([])
    }

    const savePage = (query) => router.replace({
        pathname: '/jobbank/profiles',
        query
    })

    const onChangePage = ({current}) =>{
        let newQuery = {...router.query, page: current}
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
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> router.push({
                        pathname: `/jobbank/profiles/edit`,
                        query:{...router.query, id: item.id }
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
                <Menu.Item
                    key='3'
                    icon={<CopyOutlined />}
                    onClick={()=> actionDuplicate(item)}
                >
                    Duplicar
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex:'name',
            key: 'name'
        },
        {
            title: 'Cliente',
            render: (item) =>{
                return (
                    <span>{getClient(item)}</span>
                )
            }
        },
        {
            title: ()=>{
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
                size='small'
                rowKey='id'
                columns={columns}
                dataSource={list_profiles.results}
                loading={load_profiles}
                rowSelection={rowSelection}
                onChange={onChangePage}
                locale={{
                    emptyText: load_profiles
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_profiles.count,
                    current: jobbank_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ListItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estos templates?'
                    : '¿Estás seguro de eliminar este template?'
                }
                visible={openModalDelete}
                keyTitle='name'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_profiles: state.jobBankStore.list_profiles,
        load_profiles: state.jobBankStore.load_profiles,
        list_clients_options: state.jobBankStore.list_clients_options,
        load_clients_options: state.jobBankStore.load_clients_options,
        jobbank_page: state.jobBankStore.jobbank_page,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getProfilesList }
)(TableProfiles);