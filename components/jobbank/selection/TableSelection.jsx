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
    LinkOutlined,
    CalendarOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import ListItems from '../../../common/ListItems';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { getListSelection } from '../../../redux/jobBankDuck';
import { optionsStatusSelection } from '../../../utils/constant';
import ModalStatus from './ModalStatus';
import { getPercentGenJB, copyContent, downloadCustomFile } from '../../../utils/functions';

const TableSelection = ({
    currentUser,
    currentNode,
    jobbank_page,
    getListSelection,
    list_selection,
    load_selection,
    jobbank_filters,
    jobbank_page_size
}) => {

    const router = useRouter();
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionDelete = async () => {
        let ids = itemsToDelete.map(item => item.id);
        try {
            // await WebApiJobBank.deleteSelection({ids});
            getListSelection(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size);
            let msg = ids.length > 1 ? 'Procesos eliminados' : 'Proceso eliminado';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = ids.length > 1 ? 'Procesos no eliminados' : 'Proceso no eliminado';
            message.error(msg);
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiJobBank.updateSelection(itemToEdit.id, {
                ...values,
                person: currentUser.id,
                previus_state: itemToEdit.previus_state,
                candidate: itemToEdit.candidate?.id,
                vacant: itemToEdit.vacant?.id
            });
            getListSelection(currentNode.id, jobbank_filters, jobbank_page, jobbank_page_size);
            message.success('Estatus actualizado');
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado');
        }
    }

    const openModalManyDelete = () => {
        if (itemsToDelete.length > 1) {
            setOpenModalDelete(true)
        } else {
            setOpenModalDelete(false)
            message.error('Selecciona al menos dos procesos')
        }
    }

    const onChangeStatus = (value, item) => {
        setOpenModal(true)
        setItemToEdit({
            ...item,
            previus_state: item.status_process,
            status_process: value
        })
    }

    const onCloseModal = () => {
        setOpenModal(false)
        setItemToEdit({})
    }

    const openModalRemove = (item) => {
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () => {
        setOpenModalDelete(false)
        setItemsKeys([])
        setItemsToDelete([])
    }

    const optionsStatus = (status) => {
        const map_ = item => ({ ...item, disabled: item.value < status });
        return optionsStatusSelection.map(map_)
    }

    const onChangePage = ({ current, pageSize }) => {
        let filters = { ...router.query, page: current, size: pageSize };
        router.replace({
            pathname: '/jobbank/selection',
            query: filters
        })
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsToDelete(selectedRows)
        }
    }

    const copyPermalink = (item) => {
        copyContent({
            text: `${window.location.origin}/validation?user=${item.candidate?.user_person}&app=kuiz&type=user`,
            onSucces: () => message.success('Permalink copiado'),
            onError: () => message.error('Permalink no copiado')
        })
    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<DeleteOutlined />}
                    onClick={() => openModalManyDelete()}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const menuItem = (item) => {
        let valid = item.candidate?.user_person
            && item.candidate?.person_assessment_list?.length > 0;
        return (
            <Menu>
                <Menu.Item
                    key='4'
                    icon={<EditOutlined />}
                    onClick={() => router.push({
                        pathname: '/jobbank/selection/edit',
                        query: { ...router.query, id: item.id, vacant: item.vacant?.id }
                    })}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined />}
                    onClick={() => openModalRemove(item)}
                >
                    Eliminar
                </Menu.Item>
                {valid && (
                    <Menu.Item
                        key='3'
                        icon={<LinkOutlined />}
                        onClick={() => copyPermalink(item)}
                    >
                        Permalink de evaluaciones
                    </Menu.Item>
                )}
                {item.candidate?.cv && (
                    <Menu.Item
                        key='1'
                        icon={<DownloadOutlined />}
                        onClick={() => downloadCustomFile({
                            name: item.candidate?.cv?.split('/')?.at(-1),
                            url: item.candidate.cv
                        })}
                    >
                        Descargar CV
                    </Menu.Item>
                )}
                {/* {item.status_process == 2 && (
                    <Menu.Item
                        key='3'
                        icon={<CalendarOutlined />}
                    >
                        Agendar entrevista
                    </Menu.Item>
                )} */}
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: ['candidate', 'first_name'],
            key: ['candidate', 'first_name'],
            ellipsis: true
        },
        {
            title: 'Apellidos',
            dataIndex: ['candidate', 'last_name'],
            key: ['candidate', 'last_name'],
            ellipsis: true
        },
        {
            title: 'Correo',
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
            title: 'Evaluaciones',
            render: (item) => {
                let valid = item.candidate?.user_person
                    && item.candidate?.person_assessment_list?.length > 0;
                return valid ? (
                    <span
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => router.push({
                            pathname: '/jobbank/candidates/assign',
                            query: { ...router.query, person: item.candidate?.user_person, back: 'selection' }
                        })}
                    >
                        {getPercentGenJB(item.candidate?.person_assessment_list)}%
                    </span>
                ) : <></>;
            }
        },
        {
            title: 'Estatus',
            width: 170,
            render: (item) => {
                return (
                    <Select
                        size='small'
                        style={{ width: 150 }}
                        defaultValue={item.status_process}
                        value={item.status_process}
                        placeholder='Estatus'
                        options={optionsStatus(item.status_process)}
                        onChange={(e) => onChangeStatus(e, item)}
                    />
                )
            }
        },
        {
            title: () => {
                return (
                    <Dropdown overlay={menuTable}>
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            },
            render: (item) => {
                return (
                    <Dropdown overlay={() => menuItem(item)}>
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
                    pageSize: jobbank_page_size,
                    hideOnSinglePage: list_selection?.count < 10,
                    showSizeChanger: list_selection?.count > 10
                }}
            />
            <ListItems
                title={itemsToDelete.length > 1
                    ? '¿Estás seguro de eliminar estos procesos?'
                    : '¿Estás seguro de eliminar este proceso?'
                }
                visible={openModalDelete}
                keyTitle='candidate, first_name'
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

const mapState = (state) => {
    return {
        list_selection: state.jobBankStore.list_selection,
        load_selection: state.jobBankStore.load_selection,
        jobbank_page: state.jobBankStore.jobbank_page,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        jobbank_page_size: state.jobBankStore.jobbank_page_size,
        currentNode: state.userStore.current_node,
        currentUser: state.userStore.user
    }
}

export default connect(
    mapState, { getListSelection }
)(TableSelection);