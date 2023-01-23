import React, { useState } from 'react';
import { Table, Select, Dropdown, Button, Menu, message } from 'antd';
import { useRouter } from 'next/router';
import moment from 'moment';
import { connect } from 'react-redux';
import { getInterviews } from '../../../redux/jobBankDuck';
import { getFullName } from '../../../utils/functions';
import { optionsStatusInterviews } from '../../../utils/constant';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    CalendarOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import ListItems from '../../../common/ListItems';

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
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionDelete = async () =>{
        let ids = itemsToDelete.map(item => item.id);
        try {
            getInterviews(currentNode.id, jobbank_filters, jobbank_page);
            let msg = ids.length > 1 ? 'Entrevistas eliminadas' : 'Entrevista eliminada';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = ids.length > 1 ? 'Entrevistas no eliminadas' : 'Entrevista no eliminada';
            message.error(msg);
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
                    onClick={()=> router.push({
                        pathname: `/jobbank/interviews/edit`,
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
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Reclutador',
            ellipsis: true,
            render: (item) =>{
                return(
                    <>{getFullName(item.recruiter)}</>
                )
            }
        },
        {
            title: 'Candidato',
            ellipsis: true,
            render: (item) =>{
                return(
                    <>{item.candidate?.fisrt_name} {item.candidate?.last_name}</>
                )
            }
        },
        {
            title: 'Vacante',
            ellipsis: true,
            dataIndex: ['vacant','job_position'],
            key: ['vacant', 'job_position']
        },
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Hora',
            render: (item) =>{
                return(
                    <>{item.date ? moment().format('hh:mm a') : null}</>
                )
            }
        },
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <Select
                        size='small'
                        style={{width: 150}}
                        defaultValue={item.status}
                        value={item.status}
                        placeholder='Estatus'
                        options={optionsStatusInterviews}
                        // onChange={(e) => onChangeStatus(e, item)}
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
                rowSelection={rowSelection}
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
                    ? '¿Estás seguro de eliminar estas entrevistas?'
                    : '¿Estás seguro de eliminar esta entrevista?'
                }
                visible={openModalDelete}
                keyTitle='candidate, fisrt_name'
                keyDescription='vacant, job_position'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
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