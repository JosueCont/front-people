import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { intranetAccess } from '../../utils/constant';
import { useRouter } from 'next/router';
import {
    getFullName,
    getPhoto
} from '../../utils/functions';
import {
    Table,
    Avatar,
    Switch,
    Select,
    Menu,
    Dropdown,
    Button,
    message
} from 'antd';
import {
    SyncOutlined,
    SearchOutlined,
    PlusOutlined,
    DownloadOutlined,
    UploadOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    LinkOutlined,
    EditOutlined,
    DeleteOutlined,
    UserAddOutlined,
    UserSwitchOutlined,
    KeyOutlined,
    SendOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UsergroupAddOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { BsHandIndex } from 'react-icons/bs';
import ListItems from '../../common/ListItems';
import WebApiPeople from '../../api/WebApiPeople';
import { getListPersons } from '../../redux/UserDuck';

import ModalSupervisor from './Options/ModalSupervisor';

const TableCollaborator = ({
    currentNode,
    generalConfig,
    permissions,
    list_persons,
    fetch_persons,
    applications,
    currentUser,
    getListPersons
}) => {

    const router = useRouter();
    const [openDelete, setOpenDelete] = useState(false);

    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsSelected, setItemsSelected] = useState([]);

    const [openSupervisor, setOpenSupervisor] = useState(false);
    const [typeAssign, setTypeAssign] = useState(1);

    const actionDelete = async () => {
        let ids = itemsSelected?.map(item => item.id);
        try {
            await WebApiPeople.deletePerson({ persons_id: ids?.join(',') });
            let msg = ids?.length > 1
                ? 'Personas eliminadas'
                : 'Persona eliminada';
            message.success(msg)
            getListPersons(currentNode?.id, { ...router.query })
        } catch (e) {
            console.log(e)
            let msg = ids?.length > 1
                ? 'Personas no eliminadas'
                : 'Persona no eliminada';
            message.error(msg)
        }
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

    const showSupervisor = (item, type) => {
        setTypeAssign(type)
        setItemsSelected([item])
        setOpenSupervisor(true)
    }

    const closeSupervisor = () => {
        setItemsKeys([])
        setItemsSelected([])
        setOpenSupervisor(false)
        setTypeAssign(1)
    }

    const showManySupervisor = (type) =>{
        if(itemsSelected.length > 0){
            setOpenSupervisor(true)
            setTypeAssign(type)
            return;
        }
        setOpenSupervisor(false)
        setTypeAssign(1)
        message.error('Selecciona al menos un colaborador')
    }

    const showManyDelete = () =>{
        if(itemsSelected?.length > 1){
            setOpenDelete(true)
            return;
        }
        setOpenDelete(false)
        message.error('Selecciona al menos dos colaboradores')
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
                key="1"
                icon={<DeleteOutlined />}
                onClick={()=> showManyDelete()}
            >
                Eliminar
            </Menu.Item>
            <Menu.Item
                key="2"
                icon={<UserSwitchOutlined />}
                onClick={()=> showManySupervisor(1)}
            >
                Asignar jefe inmediato
            </Menu.Item>
            <Menu.Item
                key="3"
                icon={<UsergroupAddOutlined />}
                onClick={()=> showManySupervisor(2)}
            >
                Asignar suplente de jefe inmediato
            </Menu.Item>
        </Menu>
    )

    const MenuItem = ({ item }) => (
        <Menu>
            {permissions.person?.edit && (
                <Menu.Item
                    key="1"
                    icon={<EditOutlined />}
                    onClick={() => router.push({
                        pathname: `/home/persons/${item.id}`,
                        query: router.query
                    })}
                >
                    Editar
                </Menu.Item>
            )}
            {permissions.person?.delete && item.id !== currentUser?.id && (
                <Menu.Item
                    key="2"
                    icon={<DeleteOutlined />}
                    onClick={() => showDelete(item)}
                >
                    Eliminar
                </Menu.Item>
            )}
            <Menu.Item
                key="3"
                icon={<UserSwitchOutlined />}
                onClick={() => showSupervisor(item, 1)}
            >
                Asignar jefe inmediato
            </Menu.Item>
            {item.immediate_supervisor && (
                <Menu.Item
                    key="4"
                    icon={<UsergroupAddOutlined />}
                    onClick={() => showSupervisor(item, 2)}
                >
                    Asignar suplente de jefe inmediato
                </Menu.Item>
            )}
            <Menu.Item
                key="5"
                icon={<KeyOutlined />}
            >
                Reestablecer contraseña
            </Menu.Item>
            <Menu.Item
                icon={<DownloadOutlined />}
                key="6"
            >
                Descargar carta de renuncia
            </Menu.Item>
            <Menu.Divider />
            {applications?.kuiz?.active && (
                <>
                    <Menu.Item
                        key="7"
                        icon={<EyeOutlined />}
                        onClick={() => router.push({
                            pathname: `/assessment/persons/${item.id}`,
                            query: router.query
                        })}>
                        Ver asignaciones
                    </Menu.Item>

                    {permissions.person?.create && (
                        <Menu.Item
                            key="8"
                            icon={<BsHandIndex />}
                        >
                            Asignar evaluaciones
                        </Menu.Item>
                    )}
                    <Menu.Item
                        key="9"
                        icon={<LinkOutlined />}
                    >
                        Copiar permalink de evaluaciones
                    </Menu.Item>
                    <Menu.Divider />
                </>
            )}
            <Menu.Item key="10"
                icon={<SendOutlined />}
            >
                Enviar a UI Store
            </Menu.Item>
            <Menu.Item
                key="11"
                icon={<SyncOutlined />}
            >
                Sincronizar con YNL
            </Menu.Item>
        </Menu>
    )

    const columns = [
        {
            title: 'Foto',
            show: true,
            render: (item) => (
                <Avatar src={getPhoto(item, '/images/profile-sq.jpg')} />
            )
        },
        {
            title: 'No. empleado',
            dataIndex: 'code',
            key: 'code',
            show: true,
        },
        {
            title: 'Nombre',
            show: true,
            render: (item) => (
                <a onClick={() => router.push({
                    pathname: `/home/persons/${item.id}`,
                    query: router.query
                })}>
                    {getFullName(item)}
                </a>
            )
        },
        {
            title: 'Jefe inmediato',
            dataIndex: 'immediate_supervisor',
            show: true,
            render: (item) => item ? getFullName(item) : <></>
        },
        {
            title: 'Jefe suplente',
            dataIndex: 'substitute_immediate_supervisor',
            show: true,
            render: (item) => item ? getFullName(item) : <></>
        },
        {
            title: 'Estatus',
            show: true,
            render: (item) => (
                <Switch
                    size='small'
                    defaultChecked={item.is_active}
                    checked={item.is_active}
                    checkedChildren="Activo"
                    unCheckedChildren="Inactivo"
                // onChange={(e) => actionStatus(e, item)}
                />
            )
        },
        {
            title: 'Intranet',
            show: generalConfig?.intranet_enabled,
            render: (item) => (
                <Select
                    size='small'
                    style={{ width: 90 }}
                    defaultValue={item.intranet_access}
                    value={item.intranet_access}
                    placeholder='Acceso'
                    options={intranetAccess}
                // onChange={(e) => actionStatus(e, item)}
                />
            )
        },
        {
            title: () => permissions.person?.delete ? (
                <Dropdown overlay={<MenuTable />}>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            ) : <></>,
            render: (item) => (permissions.person?.edit || permissions.person?.delete) ? (
                <Dropdown
                    disabled={itemsKeys?.includes(item?.id)}
                    overlay={<MenuItem item={item} />}
                >
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            ) : <></>,
            show: true
        }
    ].filter(col => col.show);

    return (
        <>
            <Table
                rowKey='id'
                size='small'
                dataSource={list_persons}
                columns={columns}
                loading={fetch_persons}
                rowSelection={rowSelection}
                pagination={{
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                }}
            />
            <ListItems
                title={itemsSelected?.length > 1
                    ? '¿Estás seguro eliminar estas personas?'
                    : '¿Estás seguro de eliminar esta persona?'
                }
                visible={openDelete}
                close={closeDelete}
                itemsToList={itemsSelected}
                actionConfirm={actionDelete}
                keyTitle={['first_name', 'flast_name', 'mlast_name']}
                keyDescription='email'
            />
            <ModalSupervisor
                visible={openSupervisor}
                close={closeSupervisor}
                itemsSelected={itemsSelected}
                typeAssign={typeAssign}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        generalConfig: state.userStore.general_config,
        permissions: state.userStore.permissions,
        list_persons: state.userStore.list_persons,
        fetch_persons: state.userStore.fetch_persons,
        applications: state.userStore.applications,
        currentUser: state.userStore.user,
    }
}

export default connect(
    mapState, {
    getListPersons
}
)(TableCollaborator)