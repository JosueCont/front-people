import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { intranetAccess } from '../../utils/constant';
import { useRouter } from 'next/router';
import {
    getFullName,
    getPhoto,
    downloadFile,
    copyContent,
    downloadBLOB
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
    DownloadOutlined,
    EllipsisOutlined,
    EyeOutlined,
    LinkOutlined,
    EditOutlined,
    DeleteOutlined,
    UserSwitchOutlined,
    KeyOutlined,
    SendOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import {
    BsHandIndex
} from 'react-icons/bs';
import ListItems from '../../common/ListItems';
import WebApiPeople from '../../api/WebApiPeople';
import WebApiPayroll from '../../api/WebApiPayroll';
import WebApiYnl from '../../api/WebApiYnl';
import WebApiAssessment from '../../api/WebApiAssessment';
import { getCollaborators } from '../../redux/UserDuck';

import ModalSupervisor from './modals/ModalSupervisor';
import ModalPassword from './modals/ModalPassword';
import PersonsGroup from '../person/groups/PersonsGroup';
import ModalCompetences from '../person/ModalCompetences';
import ModalSendUI from './modals/ModalSendUI';

import AssignAssessments from '../person/assignments/AssignAssessmentsCopy';

const TablePeople = ({
    currentNode,
    generalConfig,
    permissions,
    list_collaborators,
    load_collaborators,
    applications,
    currentUser,
    getCollaborators,
    user_page,
    user_filters,
    user_page_size
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
    const [openStore, setOpenStore] = useState(false);

    const [itemReport, setItemReport] = useState([]);
    const [openReport, setOpenReport] = useState(false);

    const actionError = (e) => {
        let error = e.response?.data?.message;
        let msg = error ? error : 'Error al descargar el archivo';
        message.error(msg)
    }

    const actionStatus = async (status, item) => {
        try {
            let body = { status, id: item?.id }
            await WebApiPeople.changeStatusPerson(body);
            message.success('Estatus actualizado')
            getCollaborators(currentNode?.id, user_filters, user_page, user_page_size);
        } catch (e) {
            console.log(e)
            message.error('Estatus no actualizado')
        }
    }

    const actionIntranet = async (intranet_access, item) => {
        try {
            let body = { intranet_access, id: item?.id };
            await WebApiPeople.changeIntranetAccess(body);
            message.success('Permisos actualizados')
            getCollaborators(currentNode?.id, user_filters, user_page, user_page_size);
        } catch (e) {
            console.log(e)
            message.error('Permisos no actualizados')
        }
    }

    const actionDelete = async () => {
        let ids = itemsSelected?.map(item => item.id);
        try {
            await WebApiPeople.deletePerson({ persons_id: ids?.join(',') });
            let msg = ids?.length > 1
                ? 'Personas eliminadas'
                : 'Persona eliminada';
            message.success(msg)
            getCollaborators(currentNode?.id, user_filters, user_page, user_page_size);
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
            getCollaborators(currentNode?.id, user_filters, user_page, user_page_size);
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
            getCollaborators(currentNode?.id, user_filters, user_page, user_page_size);
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
            message.success('Contraseña actualizada')
        } catch (e) {
            console.log(e)
            message.error('Contraseña no actualizada')
        }
    }

    const actionResignation = async (item) => {
        try {
            let response = await WebApiPayroll.downloadRenegationCart(item?.id);
            let name = 'Carta de renuncia.pdf';
            downloadBLOB({ data: response.data, name })
        } catch (e) {
            console.log(e)
            actionError(e)
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

    const actionAssign = async (values) => {
        let persons = itemsSelected?.map(item => item.id);
        try {
            let body = { ...values, persons, node: currentNode?.id };
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

    const actionReportCompetences = async (item) => {
        const key = 'updatable';
        message.loading({ content: 'Obteniendo información...', key })
        try {
            let body = {
                node_id: currentNode?.id,
                user_id: item?.id,
                calculation_type: generalConfig?.calculation_type
            }
            let response = await WebApiAssessment.getReportCompetences(body);
            setTimeout(() => {
                message.success({ content: 'Información obtenida', key })
                setItemPerson(item)
                setItemReport(response.data)
            }, 1000)
            setTimeout(() => {
                setOpenReport(true)
            }, 2000)
        } catch (e) {
            console.log(e)
            let error = e?.response?.data?.message;
            let msg = error ? error : 'Información no obtenida';
            setTimeout(() => {
                message.error({ content: msg, key })
            }, 2000)
        }
    }

    const actionTermContract = async (item) => {
        try {
            let response = await WebApiPayroll.downloadFixedTermContract(item.id)
            let name = 'Contrato por tiempo determinado.pdf';
            downloadBLOB({ data: response.data, name });
        } catch (e) {
            console.log(e)
            actionError(e)
        }
    }

    const actionIndeterminateContract = async (item) => {
        try {
            let response = await WebApiPayroll.downloadIndefiniteTermContract(item.id)
            let name = 'Contrato por tiempo indeterminado.pdf';
            downloadBLOB({ data: response.data, name });
        } catch (e) {
            console.log(e)
            actionError(e)
        }
    }

    const actionContractForWork = async (item) => {
        try {
            let response = await WebApiPayroll.downloadContractForWork(item.id);
            let name = 'Contrato individual de trabajo por obra.pdf';
            downloadBLOB({ data: response.data, name });
        } catch (e) {
            console.log(e)
            actionError(e)
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

    const showAsssign = (item) => {
        setItemsSelected([item])
        setOpenAssign(true)
    }

    const closeAssign = () => {
        setItemsKeys([])
        setItemsSelected([])
        setOpenAssign(false)
    }

    const closeReport = () => {
        setItemPerson({})
        setItemReport([])
        setOpenReport(false)
    }

    const showStore = (item) => {
        setItemsSelected([item])
        setOpenStore(true)
    }

    const closeStore = () => {
        setItemsSelected([])
        setItemsKeys([])
        setOpenStore(false)
    }

    const showManyStore = () => {
        if (itemsSelected?.length > 1) {
            setOpenStore(true)
            return;
        }
        setOpenStore(false)
        message.error('Selecciona al menos dos colaboradores')
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

    const showManyAssign = () => {
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
                        onClick={() => showManyAssign()}
                    >
                        Asignar evaluaciones
                    </Menu.Item>
                </>
            )}
            <Menu.Item
                key="4"
                icon={<UsergroupAddOutlined />}
                onClick={() => showManySupervisor(1)}
            >
                Asignar jefe inmediato
            </Menu.Item>
            <Menu.Item
                key="5"
                icon={<UsergroupAddOutlined />}
                onClick={() => showManySupervisor(2)}
            >
                Asignar jefe suplente
            </Menu.Item>
            <Menu.Divider />
            {applications?.iuss?.active && (
                <Menu.Item
                    key="6"
                    icon={<SendOutlined />}
                    onClick={() => showManyStore()}
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
                    Asignar jefe suplente
                </Menu.Item>
            )}
            {currentUser?.is_admin && (
                <Menu.Item
                    key="5"
                    icon={<KeyOutlined />}
                    onClick={() => showPassword(item)}
                >
                    Restablecer contraseña
                </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item
                key="13"
                icon={<DownloadOutlined />}
                onClick={() => actionResignation(item)}
            >
                Descargar carta de renuncia
            </Menu.Item>
            <Menu.Item
                key="16"
                icon={<DownloadOutlined />}
                onClick={() => actionContractForWork(item)}
            >
                Descargar contrato por obra
            </Menu.Item>
            <Menu.SubMenu
                title='Descargar contrato'
                icon={<DownloadOutlined />}
            >
                <Menu.Item
                    key="14"
                    onClick={() => actionTermContract(item)}
                >
                    Tiempo determinado
                </Menu.Item>
                <Menu.Item
                    key="15"
                    onClick={() => actionIndeterminateContract(item)}
                >
                    Tiempo indeterminado
                </Menu.Item>
            </Menu.SubMenu>
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
                    <Menu.Item
                        key='12'
                        icon={<EyeOutlined />}
                        onClick={() => actionReportCompetences(item)}
                    >
                        Ver reporte competencias
                    </Menu.Item>
                    {permissions.person?.create && (
                        <Menu.Item
                            key="8"
                            icon={<BsHandIndex />}
                            onClick={() => showAsssign(item)}
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
                    onClick={() => showStore(item)}
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

    const onChangePage = ({ current, pageSize }) => {
        let filters = { ...router.query, page: current, size: pageSize };
        router.replace({
            pathname: '/home/persons/',
            query: filters
        }, undefined, { shallow: true })
    }

    const columns = [
        {
            title: 'Foto',
            show: true,
            render: (item) => (
                <Avatar size='small' src={getPhoto(item, '/images/profile-sq.jpg')} />
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
                    onChange={(e) => actionStatus(e, item)}
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
                    onChange={(e) => actionIntranet(e, item)}
                />
            )
        },
        {
            title: () => permissions.person?.delete ? (
                <Dropdown placement='bottomRight' overlay={<MenuTable />}>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            ) : <></>,
            render: (item) => (permissions.person?.edit || permissions.person?.delete) ? (
                <Dropdown
                    placement='bottomRight'
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
    ];

    const modalTitle = {
        delete: itemsSelected?.length > 1
            ? '¿Estás seguro eliminar estas personas?'
            : '¿Estás seguro de eliminar esta persona?',
        sync_ynl: itemsSelected?.length > 1
            ? '¿Sincronizar a estas peronas con YNL?'
            : '¿Sincronizar a esta persona con YNL?'

    }

    const modalText = {
        delete: 'Eliminar',
        sync_ynl: 'Sincronizar'
    }

    const modalAction = {
        delete: actionDelete,
        sync_ynl: actionSendYNL
    }

    return (
        <>
            <Table
                rowKey='id'
                size='small'
                dataSource={list_collaborators?.results}
                columns={columns.filter(col => col.show)}
                loading={load_collaborators}
                rowSelection={rowSelection}
                onChange={onChangePage}
                className='ant-table-colla'
                pagination={{
                    total: list_collaborators?.count,
                    pageSize: user_page_size,
                    current: user_page,
                    showSizeChanger: true
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
                title={(itemsSelected?.length > 1 || itemsSelected?.length <= 0)
                    ? 'Asignar evaluaciones'
                    : `Asignar evaluaciones a ${getFullName(itemsSelected?.at(-1))}`
                }
                visible={openAssign}
                close={closeAssign}
                actionForm={actionAssign}
            />
            <ModalCompetences
                visible={openReport}
                close={closeReport}
                itemReport={itemReport}
                itemPerson={itemPerson}
            />
            <ModalSendUI
                visible={openStore}
                close={closeStore}
                itemsSelected={itemsSelected}
            />
        </>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        generalConfig: state.userStore.general_config,
        permissions: state.userStore.permissions,
        list_collaborators: state.userStore.list_collaborators,
        load_collaborators: state.userStore.load_collaborators,
        user_page: state.userStore.user_page,
        user_filters: state.userStore.user_filters,
        user_page_size: state.userStore.user_page_size,
        applications: state.userStore.applications,
        currentUser: state.userStore.user,
    }
}

export default connect(
    mapState, {
    getCollaborators
}
)(TablePeople)