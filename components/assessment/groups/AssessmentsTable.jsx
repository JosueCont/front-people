import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Table,
    Tooltip,
    Space,
    Tag,
    Dropdown,
    Menu,
    Button,
    message
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    EllipsisOutlined,
    UserOutlined,
    FileTextOutlined,
    EyeInvisibleOutlined
} from '@ant-design/icons';
import ViewSurveys from './ViewSurveys';
import AssessmentsGroup from './AssessmentsGroup';
import WebApiAssessment from '../../../api/WebApiAssessment';
import ListItems from '../../../common/ListItems';

const AssessmentsTable = ({
    listGroups = [],
    loading = false,
    getListGroups = () => { }
}) => {

    const permissions = useSelector(state => state.userStore.permissions.person)
    const { current_node } = useSelector(state => state.userStore)

    const [openList, setOpenList] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [itemGroup, setItemGroup] = useState({});

    const [openDelete, setOpenDelete] = useState(false);
    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsSelected, setItemsSelected] = useState([]);

    const actionUpdate = async (values) => {
        try {
            let body = { ...values, node: current_node?.id }
            await WebApiAssessment.updateGroupAssessments(body, itemGroup?.id)
            getListGroups(current_node?.id)
            message.success('Grupo actualizado')
        } catch (e) {
            console.log(e)
            // Se devuelve un error para no cerrar el modal
            let txt = e.response?.data?.message;
            if (e.response.status === 400) return txt;
            let msg = txt ? txt : 'Grupo no actualizado';
            message.error(msg)
            return 'ERROR';
        }
    }

    const actionDelete = async () => {
        let groups_id = itemsSelected?.map(item => item.group_kuiz_id);
        try {
            await WebApiAssessment.deleteGroupAssessments({ groups_id });
            getListGroups(current_node?.id)
            let msg = groups_id?.length > 1
                ? 'Grupos eliminados' : 'Grupo eliminado';
            message.success(msg)
        } catch (e) {
            console.log(e)
            let msg = groups_id?.length > 1
                ? 'Grupos no eliminados' : 'Grupo no eliminado';
            message.error(msg)
        }
    };

    const showList = (item) => {
        setItemGroup(item)
        setOpenList(true)
    }

    const closeList = () => {
        setItemGroup({})
        setOpenList(false)
    }

    const showEdit = (item) => {
        setItemGroup(item)
        setOpenEdit(true)
    }

    const closeEdit = () => {
        setItemGroup({})
        setOpenEdit(false)
    }

    const showManyDelete = () => {
        if (itemsSelected.length > 1) {
            setOpenDelete(true)
            return;
        }
        setOpenDelete(false)
        message.error('Selecciona al menos dos grupos')
    }

    const showDelete = (item) => {
        setItemsSelected([item])
        setOpenDelete(true)
    }

    const closeDelete = () => {
        setItemsKeys([])
        setItemsSelected([])
        setOpenDelete(false)
    }

    const rowSelection = {
        selectedRowKeys: itemsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setItemsKeys(selectedRowKeys)
            setItemsSelected(selectedRows)
        }
    }

    const MenuTable = () => (
        <Menu>
            <Menu.Item
                key='1'
                icon={<DeleteOutlined />}
                onClick={() => showManyDelete()}
            >
                Eliminar
            </Menu.Item>
        </Menu>
    )

    const MenuItem = ({ item }) => (
        <Menu>
            {permissions?.edit && (
                <Menu.Item
                    key='1'
                    icon={<EditOutlined />}
                    onClick={() => showEdit(item)}
                >
                    Editar
                </Menu.Item>
            )}
            {permissions?.delete && (
                <Menu.Item
                    key='2'
                    icon={<DeleteOutlined />}
                    onClick={() => showDelete(item)}
                >
                    Eliminar
                </Menu.Item>
            )}
        </Menu>
    )

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Evaluaciones',
            render: (item) => (
                <Space>
                    {item.assessments?.length > 0 ? (
                        <Tooltip title='Ver evaluaciones'>
                            <EyeOutlined
                                onClick={() => showList(item)}
                            />
                        </Tooltip>
                    ) : <EyeInvisibleOutlined />}
                    <Tag
                        icon={<FileTextOutlined style={{ color: '#52c41a' }} />}
                        color={'green'}
                        style={{ fontSize: '14px' }}
                    >
                        {item.assessments ? item.assessments?.length : 0}
                    </Tag>
                </Space>
            )
        },
        {
            title: () => {
                return (
                    <>
                        {permissions?.delete && (
                            <Dropdown overlay={<MenuTable />}>
                                <Button size="small">
                                    <EllipsisOutlined />
                                </Button>
                            </Dropdown>
                        )}
                    </>
                )
            },
            render: (item) => {
                return (
                    <>
                        {(permissions?.edit || permissions?.delete) && (
                            <Dropdown overlay={<MenuItem item={item} />}>
                                <Button size="small">
                                    <EllipsisOutlined />
                                </Button>
                            </Dropdown>
                        )}
                    </>
                )
            }
        },
    ]

    return (
        <>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                dataSource={listGroups}
                loading={loading}
                rowSelection={rowSelection}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
                locale={{
                    emptyText: loading ?
                        "Cargando..." :
                        "No se encontraron resultados."
                }}
            />
            <ViewSurveys
                title='Lista de evaluaciones'
                close={closeList}
                itemGroup={itemGroup}
                visible={openList}
            />
            <AssessmentsGroup
                title='Editar grupo'
                close={closeEdit}
                visible={openEdit}
                itemGroup={itemGroup}
                actionForm={actionUpdate}
            />
            <ListItems
                title={itemsSelected?.length > 1
                    ? '¿Estas seguro de eliminar estos grupos?'
                    : '¿Estas seguro de eliminar este grupo?'
                }
                visible={openDelete}
                keyTitle='name'
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
            />
        </>
    )
}

export default AssessmentsTable