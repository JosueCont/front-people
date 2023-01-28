import React, { useState } from 'react';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch,
    Select
} from 'antd';
import { connect } from 'react-redux';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { getListSelection } from '../../../redux/jobBankDuck';
import { optionsStatusSelection } from '../../../utils/constant';
import ModalStatus from './ModalStatus';

const TableSelection = ({
    currentUser,
    currentNode,
    jobbank_page,
    getListSelection,
    list_selection,
    load_selection,
    jobbank_filters
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item => item.id);
        try {
            // await WebApiJobBank.deleteSelection({ids});
            getListSelection(currentNode.id, jobbank_filters, jobbank_page);
            let msg = ids.length > 1 ? 'Procesos eliminados' : 'Proceso eliminado';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = ids.length > 1 ? 'Procesos no eliminados' : 'Proceso no eliminado';
            message.error(msg);
        }
    }

    const actionUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateSelection(itemToEdit.id, {
                ...values,
                person: currentUser.id,
                previus_state: itemToEdit.previus_state,
                candidate: itemToEdit.candidate?.id,
                vacant: itemToEdit.vacant?.id
            });
            getListSelection(currentNode.id, jobbank_filters, jobbank_page);
            message.success('Estatus actualizado');
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado');
        }
    }

    const openModalManyDelete = () =>{
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos procesos')
        }
    }

    const onChangeStatus = (value, item) =>{
        setOpenModal(true)
        setItemToEdit({...item,
            previus_state: item.status_process,
            status_process: value
        })
    }

    const onCloseModal = () =>{
        setOpenModal(false)
        setItemToEdit({})
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
        pathname: '/jobbank/selection',
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

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<DeleteOutlined/>}
                    onClick={()=>openModalManyDelete()}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const menuItem = (item) => {
        console.log('item', item)
        return (
            <Menu>
                {/* <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> openModalEdit(item)} 
                >
                    Editar
                </Menu.Item> */}
                <Menu.Item
                    key='4'
                    icon={<EditOutlined/>}
                    onClick={()=> router.push({
                        pathname: `/jobbank/selection/details`,
                        query:{...router.query, id: item.id, vacant: item.vacant.id }
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
                {item.status == 2 && (
                    <Menu.Item
                        key='3'
                        icon={<CalendarOutlined />}
                    >
                        Agendar entrevista
                    </Menu.Item>
                )}
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: ['candidate', 'fisrt_name'],
            key: ['candidate', 'fisrt_name'],
            ellipsis: true
        },
        {
            title: 'Apellidos',
            dataIndex: ['candidate', 'last_name'],
            key: ['candidate', 'last_name'],
            ellipsis: true
        },
        {
            title:'Correo',
            dataIndex: ['candidate', 'email'],
            key: ['candidate', 'email'],
            ellipsis: true
        },
        {
            title: 'Teléfono',
            dataIndex: ['candidate', 'cell_phone'],
            key: ['candidate', 'cell_phone']
        },
        {
            title: 'Vacante',
            dataIndex: ['vacant', 'job_position'],
            key: ['vacant', 'job_position'],
            ellipsis: true,
        },
        {
            title: 'Estatus',
            width: 170,
            render: (item) =>{
                return(
                    <Select
                        size='small'
                        style={{width: 150}}
                        defaultValue={item.status_process}
                        value={item.status_process}
                        placeholder='Estatus'
                        options={optionsStatusSelection}
                        onChange={(e) => onChangeStatus(e, item)}
                    />
                )
            }
        },
        {
            title: ()=>{
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
                dataSource={list_selection?.results}
                loading={load_selection}
                rowSelection={rowSelection}
                onChange={onChangePage}
                locale={{
                    emptyText: load_selection
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_selection.count,
                    current: jobbank_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ListItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estos procesos?'
                    : '¿Estás seguro de eliminar este proceso?'
                }
                visible={openModalDelete}
                keyTitle='candidate, fisrt_name'
                keyDescription='vacant, job_position'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
            />
            <ModalStatus
                title='Actualizar estatus'
                actionForm={actionUpdate}
                visible={openModal}
                close={onCloseModal}
                itemToEdit={itemToEdit}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_selection: state.jobBankStore.list_selection,
        load_selection: state.jobBankStore.load_selection,
        jobbank_page: state.jobBankStore.jobbank_page,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        currentNode: state.userStore.current_node,
        currentUser: state.userStore.user
    }
}

export default connect(
    mapState, { getListSelection }
)(TableSelection);