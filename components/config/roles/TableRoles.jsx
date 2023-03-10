import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { getAdminRoles } from '../../../redux/catalogCompany';
import {
    EllipsisOutlined,
    DeleteOutlined,
    EditOutlined,
    DownloadOutlined,
    LinkOutlined
} from '@ant-design/icons';
import {
    Table,
    Button,
    Menu,
    Dropdown,
    message,
    Switch
} from 'antd';
import { useRouter } from 'next/router';
import WebApiPeople from '../../../api/WebApiPeople';
import ListItems from '../../../common/ListItems';

const TableRoles = ({
    currentNode,
    list_admin_roles,
    load_admin_roles,
    config_page,
    config_filters,
    getAdminRoles
}) => {

    const router = useRouter();
    const [withAction, setWithAction] = useState(true);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const actionStatus = async (is_active, item) =>{
        try {
            await WebApiPeople.updateAdminRole(item.id, {is_active});
            getAdminRoles(currentNode.id, config_filters, config_page);
            let msg = is_active ? 'Rol activado' : 'Rol desactivado';
            message.success(msg);
        } catch (e) {
            console.log(e)
            let msg = is_active ? 'Rol no activado' : 'Rol no desactivado';
            message.error(msg)
        }
    }

    const actionDelete = async () =>{
        try {
            let id = itemsToDelete.at(-1)?.id;
            await WebApiPeople.deleteAdminRole(id);
            getAdminRoles(currentNode.id, config_filters, config_page);
            message.success('Rol eliminado')
        } catch (e) {
            console.log(e)
            message.error('Rol no eliminado')
        }
    }

    const openModalRemove = (item) =>{
        let with_action = item?.people_with_profile?.length <=0;
        setWithAction(with_action)
        setWithAction(true)
        setItemsToDelete([item])
        setOpenModalDelete(true)
    }

    const closeModalDelete = () =>{
        setOpenModalDelete(false)
        setWithAction(true)
        setItemsToDelete([])
    }

    const onChangePage = ({current}) =>{
        let filters = {...router.query, page: current};
        router.replace({
            pathname: '/config/roles',
            query: filters
        })
    }

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key='1'
                    icon={<EditOutlined/>}
                    onClick={()=> router.push({
                        pathname: `/config/roles/edit`,
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
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Rol',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'No. permisos',
            render: (item) =>{
                return <>{item?.module_perm?.length ?? 0}</>
            }
        },
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <Switch
                        size='small'
                        defaultChecked={item.is_active}
                        checked={item.is_active}
                        checkedChildren="Activo"
                        unCheckedChildren="Inactivo"
                        onChange={(e)=> actionStatus(e, item)}
                    />
                )
            }
        },
        {
            title: 'Acciones',
            render: (item) =>{
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
                dataSource={list_admin_roles?.results}
                loading={load_admin_roles}
                onChange={onChangePage}
                locale={{
                    emptyText: load_admin_roles
                        ? 'Cargando...'
                        : 'No se encontraron resultados.',
                }}
                pagination={{
                    total: list_admin_roles?.count,
                    current: config_page,
                    hideOnSinglePage: true,
                    showSizeChanger: false
                }}
            />
            <ListItems
                title={withAction
                    ? '¿Estás seguro de eliminar este rol?'
                    : `Este rol no se puede eliminar, ya que se encuentra asignado.`
                }
                visible={openModalDelete}
                keyTitle='name'
                // keyDescription='email'
                close={closeModalDelete}
                itemsToList={itemsToDelete}
                actionConfirm={actionDelete}
                textCancel={withAction ? 'Cancelar' : 'Cerrar'}
                useWithAction={withAction}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_admin_roles: state.catalogStore.list_admin_roles,
        load_admin_roles: state.catalogStore.load_admin_roles,
        config_page: state.catalogStore.config_page,
        config_filters: state.catalogStore.config_filters,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getAdminRoles }
)(TableRoles);