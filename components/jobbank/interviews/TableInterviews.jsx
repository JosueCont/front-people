import React, { useState, useContext } from 'react';
import { Table, Select, Dropdown, Button, Menu, message } from 'antd';
import { useRouter } from 'next/router';
import moment from 'moment';
import { connect } from 'react-redux';
import { getInterviews } from '../../../redux/jobBankDuck';
import { getFullName } from '../../../utils/functions';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    CalendarOutlined,
    UserAddOutlined,
    EyeOutlined
} from '@ant-design/icons';
import ListItems from '../../../common/ListItems';
import EventDetails from './EventDetails';
import EventForm from './EventForm';
import { InterviewContext } from '../context/InterviewContext';

const TableInterviews = ({
    currentNode,
    list_interviews,
    load_interviews,
    jobbank_page,
    jobbank_filters,
    getInterviews
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [itemToDetail, setItemToDetail] = useState({});
    const [itemToEdit, setItemToEdit] = useState({});
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const { actionDelete, actionUpdate, fetchAction } = useContext(InterviewContext);

    const openModalRemove = (item) =>{
        let selected = item ?? itemToDetail;
        setItemsToDelete([selected])
        setOpenModalDelete(true)
        closeModalDetail()
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setItemsKeys([])
        setItemsToDelete([])
    }

    const showModalDetail = (item) =>{
        setOpenModalDetail(true)
        setItemToDetail(item)
    }

    const closeModalDetail = () =>{
        setOpenModalDetail(false)
        setItemToDetail({})
    }

    const showModalEdit = (item) =>{
        let selected = item ?? itemToDetail;
        setOpenModalEdit(true)
        setItemToEdit(selected)
        closeModalDetail()
    }

    const closeModalEdit = () =>{
        setOpenModalEdit(false)
        setItemToEdit({})
    }

    const openModalManyDelete = () =>{
        if(itemsToDelete.length > 1){
            setOpenModalDelete(true)
        }else{
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos entrevistas')
        }
    }

    const savePage = (query) => router.replace({
        pathname: '/jobbank/interviews',
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
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> fetchAction(()=> showModalEdit(item))}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined/>}
                    onClick={()=> fetchAction(()=> openModalRemove(item))}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Reclutador',
            ellipsis: true,
            dataIndex: ['process_selection','vacant','strategy','recruiter','full_name'],
            key: ['process_selection','vacant','strategy','recruiter','full_name']
        },
        {
            title: 'Cliente',
            ellipsis: true,
            dataIndex: ['process_selection','vacant','customer','name'],
            key: ['process_selection','vacant','customer','name']
        },
        {
            title: 'Vacante',
            ellipsis: true,
            dataIndex: ['process_selection','vacant','job_position'],
            key: ['process_selection','vacant', 'job_position']
        },
        {
            title: 'Candidato',
            ellipsis: true,
            render: (item) =>{
                let obj = item?.process_selection?.candidate;
                return(
                    <>{obj?.fisrt_name} {obj?.last_name}</>
                )
            }
        },
        {
            title: 'Detalle',
            render: (item) =>{
                return(
                    <EyeOutlined onClick={()=> showModalDetail(item)}/>
                )
            }
        },
        {
            title: 'Acciones',
            render:(item) =>{
                return(
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
                loading={load_interviews}
                dataSource={list_interviews.results}
                onChange={onChangePage}
                // rowSelection={rowSelection}
                locale={{
                    emptyText: load_interviews
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_interviews.count,
                    current: jobbank_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ListItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estos eventos?'
                    : '¿Estás seguro de eliminar este evento?'
                }
                visible={openModalDelete}
                keyTitle='process_selection, candidate, fisrt_name'
                keyDescription='process_selection, vacant, job_position'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={()=> actionDelete(itemsToDelete.at(-1).id)}
            />
            <EventDetails
                visible={openModalDetail}
                close={closeModalDetail}
                itemToDetail={itemToDetail}
                showModalForm={()=> fetchAction(showModalEdit)}
                showModalDelete={()=> fetchAction(openModalRemove)}
            />
            <EventForm
                visible={openModalEdit}
                itemToEdit={itemToEdit}
                close={closeModalEdit}
                actionForm={e=> actionUpdate(itemToEdit.id, e)}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_interviews: state.jobBankStore.list_interviews,
        load_interviews: state.jobBankStore.load_interviews,
        jobbank_page: state.jobBankStore.jobbank_page,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getInterviews }
)(TableInterviews);