import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { intranetAccess } from '../../utils/constant';
import { useRouter } from 'next/router';
import {
    getFullName,
    getPhoto,
    downloadFile,
    copyContent
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
import WebApiPayroll from '../../api/WebApiPayroll';
import WebApiYnl from '../../api/WebApiYnl';
import WebApiAssessment from '../../api/WebApiAssessment';
import { getListPersons } from '../../redux/UserDuck';

import ModalSupervisor from './Options/ModalSupervisor';
import ModalPassword from './Options/ModalPassword';
import PersonsGroup from './groups/PersonsGroup';

import AssignAssessments from './assignments/AssignAssessmentsCopy';

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
    const [openList, setOpenList] = useState(false);
    const [actionList, setActionList] = useState('delete');

    const [itemsKeys, setItemsKeys] = useState([]);
    const [itemsSelected, setItemsSelected] = useState([]);

    const [openSupervisor, setOpenSupervisor] = useState(false);
    const [typeAssign, setTypeAssign] = useState(1);

    const [openPassword, setOpenPassword] = useState(false);
    const [itemPerson, setItemPerson] = useState({});

    const [openGroup, setOpenGroup] = useState(false);

    const [openAssign, setOpenAssign] = useState(false);

    // useEffect(() => {
    //     console.log('las aps------->', applications)
    // }, [applications])

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

    const actionSupervisor = async (values) => {
        try {
            let persons_id = itemsSelected?.map(item => item.id).join(',');
            let body = { ...values, persons_id, node: currentNode?.id };
            let response = await WebApiPeople.assignedMassiveImmediateSupervisor(body);
            let msg = response.status == 206
                ? response.data?.message
                : 'Jefe inmediatto asignado';
            message.success({ content: msg, duration: 4 });
            getListPersons(currentNode?.id, { ...router.query })
        } catch (e) {
            console.log(e)
            let txt = e.response?.data?.message;
            if (e.response?.status === 400) return txt;
            let msg = txt ? txt : 'Jefe inmediato no asignado';
            message.error(msg)
            return 'ERROR';
        }
    }

    const actionSubstitute = async (values) => {
        try {
            const filter_ = item => item.immediate_supervisor;
            let persons_id = itemsSelected?.filter(filter_).map(item => item.id).join(',');
            let body = { ...values, persons_id, node: currentNode?.id };
            let response = await WebApiPeople.assignedMassiveSubstituteImmediateSupervisor(body);
            let msg = response.status == 206
                ? response.data?.message
                : 'Suplente de jefe inmediato asignado';
            message.success({ content: msg, duration: 4 });
            getListPersons(currentNode?.id, { ...router.query })
        } catch (e) {
            console.log(e)
            let txt = e.response?.data?.message;
            if (e.response?.status === 400) return txt;
            let msg = txt ? txt : 'Suplente de jefe inmediato no asignado';
            message.error(msg)
            return 'ERROR';
        }
    }

    const actionPassword = async (values) => {
        try {
            let body = { khonnect_id: itemPerson?.khonnect_id, password: values?.passwordTwo };
            await WebApiPeople.validateChangePassword(body);
            message.success('Contraseña reestablecida')
        } catch (e) {
            console.log(e)
            message.error('Contraseña no reestablecida')
        }
    }

    const downloadResignationLetter = async (item) => {
        const key = 'updatable';
        try {
            message.loading({ content: 'Obteniendo información...', key })
            let response = await WebApiPayroll.downloadRenegationCart(item?.id);
            const params = { type: response.headers["content-type"], encoding: "UTF-8" };
            const blob = new Blob([response.data], params);
            setTimeout(() => {
                message.success({ content: 'Carta de renuncia encontrada', key })
            }, 1000)
            setTimeout(() => {
                downloadFile({ resp: blob, name: 'Carta de renuncia' })
            }, 2000)
        } catch (e) {
            console.log(e)
            let txt = e.response?.data?.message;
            let msg = txt ? txt : 'Carta de renuncia no encontrada';
            setTimeout(() => {
                message.error({ content: msg, key, duration: 4 })
            }, 2000)
        }
    }

    const actionSendUI = async () => {
        let persons_id = itemsSelected?.map(item => item.id);
        try {
            let body = { persons_id, node_id: currentNode?.id };
            let response = await WebApiPeople.CreateUIStoreUsers(body);
            let msg = persons_id.length > 1
                ? 'Personas enviadas'
                : 'Persona enviada';
            message.success(msg)
            // Pendiente la validacion para mostrar los errores
            // let success = response.data?.success;
            // let errors = response.data?.error_details || [];
            // if(errors.length <=0){
            //     message.success('Usuarios enviados')
            //     return;
            // }
        } catch (e) {
            console.log(e)
            let msg = persons_id.length > 1
                ? 'Personas no enviadas'
                : 'Persona no enviada';
            message.error(msg)
        }
    }

    const actionSendYNL = async () => {
        let ids = itemsSelected?.map(item => item.id);
        try {
            let body = { persons_id: ids?.join(','), node_id: currentNode?.id };
            let response = await WebApiYnl.synchronizePersonYNL(body);
            let msg = ids.length > 1
                ? 'Personas sincronizadas'
                : 'Persona sincronizada';
            message.success(msg)
        } catch (e) {
            console.log(e)
            let msg = ids.length > 1
                ? 'Personas no sincronizadas'
                : 'Persona no sincronizada';
            message.error(msg)
        }
    }

    const actionGroup = async (values) => {
        try {
            let body = { ...values, node: currentNode?.id };
            await WebApiAssessment.createGroupPersons(body);
            message.success('Grupo registrado')
        } catch (e) {
            console.log(e)
            message.error('Grupo no registrado')
        }
    }

    const actionAssign = async (values) =>{
        let persons = itemsSelected?.map(item => item.id);
        try {
            let body = {...values, persons, node: currentNode?.id};
            await WebApiAssessment.assignAssessments(body);
            let msg = persons?.length > 1
                ? 'Asignaciones realizadas'
                : 'Asignación realizada'; 
            message.success(msg)
        } catch (e) {
            console.log(e)
            let msg = persons?.length > 1
                ? 'Asignaciones no realizadas'
                : 'Asignación no realizada'; 
            message.error(msg)
        }
    }

    const showList = (item, type) => {
        setItemsSelected([item])
        setOpenList(true)
        setActionList(type)
    }

    const closeList = () => {
        setItemsKeys([])
        setItemsSelected([])
        setOpenList(false)
        setActionList('delete')
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

    const showPassword = (item) => {
        setItemPerson(item)
        setOpenPassword(true)
    }

    const closePassword = () => {
        setItemPerson({})
        setOpenPassword(false)
    }

    const closeGroup = () => {
        setItemsKeys([])
        setItemsSelected([])
        setOpenGroup(false)
    }

    const showAsssign = (item) =>{
        setItemsSelected([item])
        setOpenAssign(true)
    }

    const closeAssign = () =>{
        setItemsKeys([])
        setItemsSelected([])
        setOpenAssign(false)
    }

    const showManyGroup = () => {
        if (itemsSelected.length > 1) {
            setOpenGroup(true)
            return;
        }
        setOpenGroup(false)
        message.error('Selecciona al menos dos colaboradores')
    }

    const showManySupervisor = (type) => {
        if (itemsSelected.length > 0) {
            setOpenSupervisor(true)
            setTypeAssign(type)
            return;
        }
        setOpenSupervisor(false)
        setTypeAssign(1)
        message.error('Selecciona al menos un colaborador')
    }

    const showManyList = (type) => {
        if (itemsSelected?.length > 1) {
            setOpenList(true)
            setActionList(type)
            return;
        }
        setOpenList(false)
        setActionList('delete')
        message.error('Selecciona al menos dos colaboradores')
    }

    const showManyAssign = () =>{
        if (itemsSelected.length > 1) {
            setOpenAssign(true)
            return;
        }
        setOpenAssign(false)
        message.error('Selecciona al menos dos colaboradores')
    }

    const copyPermalink = (item) => {
        let url = `/validation?user=${item.id}&app=kuiz&type=user`;
        copyContent({
            text: `${window.location.origin}${url}`,
            onSucces: () => message.success('Permalink copiado'),
            onError: () => message.error('Permalink no copiado')
        })
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
                onClick={() => showManyList('delete')}
            >
                Eliminar
            </Menu.Item>
            {applications?.kuiz?.active && (
                <>
                    <Menu.Item
                        key="2"
                        icon={<UsergroupAddOutlined />}
                        onClick={() => showManyGroup()}
                    >
                        Crear grupo
                    </Menu.Item>
                    <Menu.Item
                        key="3"
                        icon={<UsergroupAddOutlined />}
                        onClick={()=> showManyAssign()}
                    >
                        Asignar evaluaciones
                    </Menu.Item>
                </>
            )}
            <Menu.Item
                key="4"
                icon={<UsergroupAddOutlined />}
                onClick={() => showManySupervisor(2)}
            >
                Asignar suplente de jefe inmediato
            </Menu.Item>
            <Menu.Item
                key="5"
                icon={<UsergroupAddOutlined />}
                onClick={() => showManySupervisor(2)}
            >
                Asignar suplente de jefe inmediato
            </Menu.Item>
            <Menu.Divider />
            {applications?.iuss?.active && (
                <Menu.Item
                    key="6"
                    icon={<SendOutlined />}
                    onClick={() => showManyList('sync_ui')}
                >
                    Enviar a UI Store
                </Menu.Item>
            )}
            {applications?.ynl?.active && (
                <Menu.Item
                    key="7"
                    icon={<SyncOutlined />}
                    onClick={() => showManyList('sync_ynl')}
                >
                    Sincronizar con YNL
                </Menu.Item>
            )}
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
                    onClick={() => showList(item, 'delete')}
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
            {currentUser?.is_admin && (
                <Menu.Item
                    key="5"
                    icon={<KeyOutlined />}
                    onClick={() => showPassword(item)}
                >
                    Reestablecer contraseña
                </Menu.Item>
            )}
            <Menu.Item
                key="6"
                icon={<DownloadOutlined />}
                onClick={() => downloadResignationLetter(item)}
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
                        })}
                    >
                        Ver asignaciones
                    </Menu.Item>

                    {permissions.person?.create && (
                        <Menu.Item
                            key="8"
                            icon={<BsHandIndex />}
                            onClick={()=> showAsssign(item)}
                        >
                            Asignar evaluaciones
                        </Menu.Item>
                    )}
                    <Menu.Item
                        key="9"
                        icon={<LinkOutlined />}
                        onClick={() => copyPermalink(item)}
                    >
                        Copiar permalink de evaluaciones
                    </Menu.Item>
                    <Menu.Divider />
                </>
            )}
            {applications?.iuss?.active && (
                <Menu.Item
                    key="10"
                    icon={<SendOutlined />}
                    onClick={() => showList(item, 'sync_ui')}
                >
                    Enviar a UI Store
                </Menu.Item>
            )}
            {applications?.ynl?.active && (
                <Menu.Item
                    key="11"
                    icon={<SyncOutlined />}
                    onClick={() => showList(item, 'sync_ynl')}
                >
                    Sincronizar con YNL
                </Menu.Item>
            )}
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
            render: (item) => (permissions.person?.edit || permissions.person?.delete) ? (
                <a onClick={() => router.push({
                    pathname: `/home/persons/${item.id}`,
                    query: router.query
                })}>
                    {getFullName(item)}
                </a>
            ) : getFullName(item)
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

    const modalTitle = {
        delete: itemsSelected?.length > 1
            ? '¿Estás seguro eliminar estas personas?'
            : '¿Estás seguro de eliminar esta persona?',
        sync_ui: itemsSelected?.length > 1
            ? 'Enviar a estas personas en UI Store?'
            : '¿Enviar a esta persona en UI Store?',
        sync_ynl: itemsSelected?.length > 1
            ? '¿Sincronizar a estas peronas con YNL?'
            : '¿Sincronizar a esta persona con YNL?'

    }

    const modalText = {
        delete: 'Eliminar',
        sync_ui: 'Crear',
        sync_ynl: 'Sincronizar'
    }

    const modalAction = {
        delete: actionDelete,
        sync_ui: actionSendUI,
        sync_ynl: actionSendYNL
    }

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
                title={modalTitle[actionList]}
                visible={openList}
                close={closeList}
                itemsToList={itemsSelected}
                actionConfirm={modalAction[actionList]}
                keyTitle={['first_name', 'flast_name', 'mlast_name']}
                keyDescription='email'
                textConfirm={modalText[actionList]}
            />
            <ModalSupervisor
                visible={openSupervisor}
                close={closeSupervisor}
                itemsSelected={itemsSelected}
                typeAssign={typeAssign}
                actionForm={typeAssign == 1
                    ? actionSupervisor
                    : actionSubstitute
                }
            />
            <ModalPassword
                visible={openPassword}
                close={closePassword}
                itemPerson={itemPerson}
                actionForm={actionPassword}
            />
            <PersonsGroup
                title='Crear nuevo grupo'
                visible={openGroup}
                close={closeGroup}
                actionForm={actionGroup}
                itemToEdit={{ name: null, persons: itemsSelected }}
            />
            <AssignAssessments
                title={(itemsSelected?.length > 1 || itemsSelected?.length <=0)
                    ? 'Asignar evaluaciones'
                    :  `Asignar evaluaciones a ${getFullName(itemsSelected?.at(-1))}`
                }
                visible={openAssign}
                close={closeAssign}
                actionForm={actionAssign}
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