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
} from '@ant-design/icons';
import {
    setJobbankPage,
    getProfilesList
} from '../../../redux/jobBankDuck';
import { useRouter } from 'next/router';
import DeleteItems from '../../../common/DeleteItems';
import WebApiJobBank from '../../../api/WebApiJobBank';

const TableProfiles = ({
    currentNode,
    jobbank_page,
    list_profiles,
    load_profiles,
    load_clients_options,
    list_clients_options,
    setJobbankPage,
    getProfilesList
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item => item.id);
        closeModalDelete();
        try {
            await WebApiJobBank.deleteProfile({ids});
            getProfilesList(currentNode.id);
            if(ids.length > 1) message.success('Perfiles eliminados');
            else message.success('Perfil eliminado');
        } catch (e) {
            console.log(e)
            if(ids.length > 1) message.error('Perfiles no eliminados');
            else message.error('Perfil no eliminado');
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
            message.error('Selecciona al menos dos perfiles')
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

    const onChangePage = ({current}) =>{
        setJobbankPage(current)
        if (current == 1) getProfilesList(currentNode?.id);
        if (current > 1) {
            const offset = (current - 1) * 10;
            const queryParam = `&limit=10&offset=${offset}`;
            getProfilesList(currentNode?.id, queryParam, current)
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
                    onClick={()=> router.push({
                        pathname: `/jobbank/profiles/edit`,
                        query:{ id: item.id }
                    })}
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
            <DeleteItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estos perfiles?'
                    : '¿Estás seguro de eliminar este perfil?'
                }
                visible={openModalDelete}
                keyTitle='name'
                close={closeModalDelete}
                itemsToDelete={itemsToDelete}
                actionDelete={actionDelete}
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
    mapState, {
        setJobbankPage,
        getProfilesList
    }
)(TableProfiles);