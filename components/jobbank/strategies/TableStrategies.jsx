import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch
} from 'antd';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { setPage, getStrategies } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';

const TableStrategies = ({
    list_strategies,
    load_strategies,
    currentNode,
    page_jobbank,
    setPage,
    getStrategies
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const openModalManyDelete = () =>{
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos vacantes')
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

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows)
        }
    }

    const onChangePage = ({current}) =>{
        setPage(current)
        // if (current == 1) getClients(currentNode?.id);
        // if (current > 1) {
        //     const offset = (current - 1) * 10;
        //     const queryParam = `&limit=10&offset=${offset}`;
        //     getClients(currentNode?.id, queryParam, current)
        // } 
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
                        pathname: `/jobbank/strategies/edit`,
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
            title: 'Producto',
            dataIndex: 'product',
            key: 'product'
        },
        {
            title: 'Asignación',
            dataIndex: 'assignment_date',
            key: 'assignment_date'
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
        <Table
            size='small'
            rowKey='id'
            columns={columns}
            dataSource={list_strategies.results}
            loading={load_strategies}
            rowSelection={rowSelection}
            onChange={onChangePage}
            locale={{
                emptyText: load_strategies
                    ? 'Cargando...'
                    : 'No se encontraron resultados.',
            }}
            pagination={{
                total: list_strategies.count,
                current: page_jobbank,
                hideOnSinglePage: true,
                showSizeChanger: false
            }}
        />
    )
}

const mapState = (state) =>{
    return {
        list_strategies: state.jobBankStore.list_strategies,
        load_strategies: state.jobBankStore.load_strategies,
        page_jobbank: state.jobBankStore.page_jobbank,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        setPage,
        getStrategies
    }
)(TableStrategies);