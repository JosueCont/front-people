import React, { useState, useMemo } from 'react';
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
    jobbank_filters,
    jobbank_page_size
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [useToCopy, setUseToCopy] = useState(false);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item => item.id);
        try {
            await WebApiJobBank.deleteProfile({ids});
            getProfilesList(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size);
            let msg = ids.length > 1 ? 'Templates eliminados' : 'Template eliminado';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = ids.length > 1 ? 'Templates no eliminados' : 'Template no eliminado';
            message.error(msg);
        }
    }

    const actionDuplicate = async () =>{
        try {
            let id = itemsToDelete?.at(-1)?.id;
            await WebApiJobBank.duplicateProfile(id);
            message.success('Template duplicado');
            getProfilesList(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size);
        } catch (e) {
            console.log(e);
            message.error('Template no duplicado');
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
        let customer = getClient(item);
        setItemsToDelete([{...item, customer}])
        setOpenModalDelete(true)
    }

    const openModalDuplicate = (item) =>{
        let customer = getClient(item);
        setUseToCopy(true)
        setItemsToDelete([{...item, customer}])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsKeys([])
        setItemsToDelete([])
        setUseToCopy(false)
    }


    const titleDelete = useMemo(()=>{
        if(useToCopy) return '¿Estás seguro de duplicar este template?';
        return itemsToDelete.length > 1
        ? '¿Estás seguro de eliminar estos templates?'
        : '¿Estás seguro de eliminar este template?';
    },[useToCopy, itemsToDelete])

    const onChangePage = ({current, pageSize}) =>{
        let filters = {...router.query, page: current, size: pageSize};
        router.replace({
            pathname: '/jobbank/profiles',
            query: filters
        }, undefined, {shallow: true})
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            const map_ = item => ({...item, customer: getClient(item)});
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows.map(map_));
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
                    onClick={()=> openModalDuplicate(item)}
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
            width: 60,
            title: ()=>{
                return(
                    <Dropdown placement='bottomRight' overlay={menuTable}>
                        <Button size={'small'}>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            },
            render: (item) =>{
                return (
                    <Dropdown placement='bottomRight' overlay={()=> menuItem(item)}>
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
                    pageSize: jobbank_page_size,
                    current: jobbank_page,
                    hideOnSinglePage: list_profiles?.count < 10,
                    showSizeChanger: list_profiles?.count > 10
                }}
            />
            <ListItems
                title={titleDelete}
                visible={openModalDelete}
                keyTitle='name'
                keyDescription='customer'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={useToCopy ? actionDuplicate : actionDelete}
                textConfirm={useToCopy ? 'Duplicar' : 'Eliminar'}
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
        jobbank_filters: state.jobBankStore.jobbank_filters,
        currentNode: state.userStore.current_node,
        jobbank_page_size: state.jobBankStore.jobbank_page_size
    }
}

export default connect(
    mapState, { getProfilesList }
)(TableProfiles);