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
import DeleteItems from '../../../common/DeleteItems';
import { getFiltersJB } from '../../../utils/functions';

const TableStrategies = ({
    list_strategies,
    load_strategies,
    currentNode,
    jobbank_page,
    getStrategies,
    load_clients_options,
    list_clients_options
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item => item.id);
        try {
            await WebApiJobBank.deleteStrategy({ids});
            getStrategiesWithFilters();
            if(ids.length > 1) message.success('Estrategias eliminadas');
            else message.success('Estrategia eliminada');
        } catch (e) {
            console.log(e)
            if(ids.length > 1) message.error('Estrategias no eliminadas');
            else message.error('Estrategia no eliminada');
        }
    }

    const getStrategiesWithFilters = () =>{
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let filters = getFiltersJB(router.query);
        getStrategies(currentNode.id, filters, page);
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

    const getClient = (item) =>{
        if(!item.customer) return null;
        const client = record => record.id === item.customer;
        let client_ = list_clients_options.find(client);
        if(!client_) return null;
        return client_.name;
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
        if(current > 1) savePage({...router.query, page: current});
        else{
            let newQuery = {...router.query};
            if(newQuery.page) delete newQuery.page;
            savePage(newQuery)
        };
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
            title: 'Producto',
            dataIndex: 'product',
            key: 'product'
        },
        {
            title: 'Cliente',
            render: (item) =>{
                return(
                    <span>{getClient(item)}</span>
                )
            }
        },
        {
            title: 'Vacante',
            dataIndex: ['vacant','job_position'],
            key: ['vacant','job_position']
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
            <DeleteItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estas estrategias?'
                    : '¿Estás seguro de eliminar esta estrategia?'
                }
                visible={openModalDelete}
                keyTitle='vacant, job_position'
                keyDescription='product'
                close={closeModalDelete}
                itemsToDelete={itemsToDelete}
                actionDelete={actionDelete}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_strategies: state.jobBankStore.list_strategies,
        load_strategies: state.jobBankStore.load_strategies,
        load_clients_options: state.jobBankStore.load_clients_options,
        list_clients_options: state.jobBankStore.list_clients_options,
        jobbank_page: state.jobBankStore.jobbank_page,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getStrategies }
)(TableStrategies);