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
    EditOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { getStrategies } from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import { optionsStatusVacant } from '../../../utils/constant';

const TableStrategies = ({
    list_strategies,
    load_strategies,
    currentNode,
    jobbank_page,
    getStrategies,
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
            await WebApiJobBank.deleteStrategy({ids});
            getStrategies(currentNode.id, currentFilters, currentPage);
            let msg = ids.length > 1 ? 'Estrategias eliminadas' : 'Estrategia eliminada';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = ids.length > 1 ? 'Estrategias no eliminadas' : 'Estrategia no eliminada';
            message.error(msg);
        }
    }

    const openModalManyDelete = () =>{
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos estrategias')
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

    const getStatus = (item) =>{
        if(!item.vacant?.status) return null;
        const find_ = record => record.value == item.vacant?.status;
        let result = optionsStatusVacant.find(find_);
        if(!result) return null;
        return result.label;
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows)
        }
    }

    const savePage = (query) => router.replace({
        pathname: '/jobbank/strategies',
        query
    })

    const onChangePage = ({current}) =>{
        let newQuery = {...router.query, page: current};
        if(current > 1){
            savePage(newQuery)
            return;
        }
        if(newQuery.page) delete newQuery.page;
        savePage(newQuery)
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
                        pathname: `/jobbank/strategies/edit`,
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
                    icon={<SettingOutlined />}
                    onClick={()=> router.push({
                        pathname: '/jobbank/publications/add',
                        query: {...router.query, strategy: item.id }
                    })}
                >
                    Configurar publicación
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Cliente',
            dataIndex: ['vacant','customer','name'],
            key: ['vacant','customer','name'],
            ellipsis: true
        },
        {
            title: 'Vacante',
            dataIndex: ['vacant','job_position'],
            key: ['vacant','job_position'],
            ellipsis: true
        },
        {
            title: 'Estatus vacante',
            render: (item) =>{
                return(
                    <span>{getStatus(item)}</span>
                )
            }
        },
        {
            title: 'Producto',
            dataIndex: 'product',
            key: 'product',
            ellipsis: true
        },
        // {
        //     title: 'Asignación',
        //     dataIndex: 'assignment_date',
        //     key: 'assignment_date'
        // },
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
            width: 60, 
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
                    current: jobbank_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ListItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estas estrategias?'
                    : '¿Estás seguro de eliminar esta estrategia?'
                }
                visible={openModalDelete}
                keyTitle='vacant, job_position'
                keyDescription='product'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_strategies: state.jobBankStore.list_strategies,
        load_strategies: state.jobBankStore.load_strategies,
        jobbank_page: state.jobBankStore.jobbank_page,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getStrategies }
)(TableStrategies);