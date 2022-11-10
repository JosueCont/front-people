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
import {
    setJobbankPage,
    getStrategies,
    setJobbankFilters
} from '../../../redux/jobBankDuck';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import DeleteItems from '../../../common/DeleteItems';

const TableStrategies = ({
    list_strategies,
    load_strategies,
    currentNode,
    jobbank_page,
    setJobbankPage,
    getStrategies,
    load_clients_options,
    list_clients_options,
    load_vacancies_options,
    list_vacancies_options,
    jobbank_filters,
    setJobbankFilters
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item => item.id);
        closeModalDelete()
        try {
            await WebApiJobBank.deleteStrategy({ids});
            getStrategies(currentNode.id);
            if(ids.length > 1) message.success('Estrategias eliminadas');
            else message.success('Estrategia eliminada');
        } catch (e) {
            console.log(e)
            if(ids.length > 1) message.error('Estrategias no eliminadas');
            else message.error('Estrategia no eliminada');
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

    const getClient = (item) =>{
        if(!item.customer) return null;
        const client = record => record.id === item.customer;
        let client_ = list_clients_options.find(client);
        if(!client_) return null;
        return client_.name;
    }

    const getVacant = (item) =>{
        if(!item.vacant) return null;
        const vacant = record => record.id === item.vacant;
        let vacant_ = list_vacancies_options.find(vacant);
        if(!vacant_) return null;
        return vacant_.job_position;
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows)
        }
    }

    const onChangePage = ({current}) =>{
        setJobbankPage(current)
        validateGetStrategies(current)
    }

    const validateGetStrategies = (current) =>{
        let page = current ?? jobbank_page;
        if(page > 1) getStrategiesWithFilters(page);
        else getStrategies(currentNode?.id, jobbank_filters);
    }

    const getStrategiesWithFilters = (page) =>{
        let offset = (page - 1) * 10;
        let query = `&limit=10&offset=${offset}${jobbank_filters}`;
        getStrategies(currentNode?.id, query, page);
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
            title: 'Cliente',
            render: (item) =>{
                return(
                    <span>{getClient(item)}</span>
                )
            }
        },
        {
            title: 'Vacante',
            render: (item) =>{
                return(
                    <span>{getVacant(item)}</span>
                )
            }
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
                keyTitle='product'
                keyDescription='assignment_date'
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
        load_vacancies_options: state.jobBankStore.load_vacancies_options,
        list_vacancies_options: state.jobBankStore.list_vacancies_options,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        jobbank_page: state.jobBankStore.jobbank_page,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        setJobbankPage,
        getStrategies,
        setJobbankFilters
    }
)(TableStrategies);