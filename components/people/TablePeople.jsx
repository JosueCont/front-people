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
import {ruleRequired} from '../../utils/rules'
import { departureMotive } from "../../utils/constant";
import {
    Table,
    Avatar,
    Switch,
    Select,
    Menu,
    Dropdown,
    Button,
    message,
    Form,
    Col,
    DatePicker,
    Row,
    Spin
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
    UsergroupAddOutlined,
    UserDeleteOutlined,
    UserAddOutlined,
    UploadOutlined
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
import locale from 'antd/lib/date-picker/locale/es_ES';

import ModalSupervisor from './modals/ModalSupervisor';
import ModalPassword from './modals/ModalPassword';
import PersonsGroup from '../person/groups/PersonsGroup';
import ModalCompetences from '../person/ModalCompetences';
import ModalSendUI from './modals/ModalSendUI';

import AssignAssessments from '../person/assignments/AssignAssessmentsCopy';
import GenericModal from '../modal/genericModal';
import moment from 'moment';

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

    const [form] = Form.useForm()
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

    const [loading, setLoading] = useState(false)

    const [openModalMovImss, setOpenModalMovImss] = useState(false)
    const [movType, setMovType] = useState(null)
    const [minDataValid, setMinDataValid] = useState(null)

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

    const personMovImms = (item, type) => {
        /* Validamos si es alta */
        if(type === 'up'){
            /* Validamos si tiene movimientos de imss y si el ultimo movimiento fue baja */
            if(item.imss_movements.length > 0 && item.imss_movements[0].movement_type === 3){
                setMinDataValid(item.imss_movements[0].date)
            }
        }else if(type === 'down'){
            /* Validamos si es baja y si tiene movimientos del imss(El ultimo, debe ser alta o reingreso) */
            if(item.imss_movements.length > 0 && item.imss_movements[0].movement_type === 1){
                setMinDataValid(item.imss_movements[0].date)
            }else{
                /* Si no tiene movimientos de alta/reingreso, entonces obtenemos el "date_of_admission" de la persona  */
                setMinDataValid(item.date_of_admission)
            }
        }


        setItemPerson(item)
        setOpenModalMovImss(true)
        setMovType(type)
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

    const rfcsFileDownload = async () => {
        try {
            const data = {
                node_id: currentNode?.id,
                persons_id: itemsKeys
            }
            let res = await WebApiPeople.rfcsFileDownload(data)
            if(res.status === 200){
                const blob = new Blob([res.data]);
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = 'RFCS.txt';
                link.click();
                message.success("Archivo generado con éxito")
            }else{
                message.error("Ocurrio un error al intentar generar el archivo")
            }
        } catch (error) {
            message.error("Ocurrio un error al intentar generar el archivo")
        }
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
            {/* <Menu.Divider /> */}
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
            <Menu.Item
                    key='8'
                    icon={<UploadOutlined />}
                    onClick={() => rfcsFileDownload()}
                >
                    Descargar rfcs para validar
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
            {
                item.is_low ?
                <Menu.Item
                    key="12"
                    icon={<UserAddOutlined />}
                    onClick={() => personMovImms(item, 'up')}
                >
                    Generar reingreso
                </Menu.Item>: 
                <Menu.Item
                    key="12"
                    icon={<UserDeleteOutlined />}
                    onClick={() => personMovImms(item, 'down')}
                >
                    Generar baja del colaborador
                </Menu.Item>
            }
            <Menu.Divider />
            {currentNode?.resignation_letter && (
                <Menu.Item
                    key="13"
                    icon={<DownloadOutlined />}
                    onClick={() => actionResignation(item)}
                >
                    Descargar carta de renuncia
                </Menu.Item>
            )}
                

            {(currentNode?.contract_for_work
                || currentNode?.fixed_term_contract
                || currentNode?.indefinite_term_contract
            ) && (
                <>
                    <Menu.SubMenu
                        title='Descargar contrato'
                        icon={<DownloadOutlined />}
                    >
                        {currentNode?.contract_for_work && item?.contract_type?.code === '02' && (
                            <Menu.Item
                                key="16"
                                icon={<DownloadOutlined />}
                                onClick={() => actionContractForWork(item)}
                            >
                                Por obra
                            </Menu.Item>
                        )}
                        {currentNode?.fixed_term_contract && item?.contract_type?.code === '03' && (
                            <Menu.Item
                                key="14"
                                onClick={() => actionTermContract(item)}
                            >
                                Tiempo determinado
                            </Menu.Item>
                        )}
                        {currentNode?.indefinite_term_contract && item?.contract_type?.code === '01' && (
                            <Menu.Item
                                key="15"
                                onClick={() => actionIndeterminateContract(item)}
                            >
                                Tiempo indeterminado
                            </Menu.Item>
                        )}
                    </Menu.SubMenu>
                    <Menu.Divider />
                </>
            )}
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

    const PersonField = ({item, field}) => {
        return (permissions.person?.edit || permissions.person?.delete) ? (
            <a onClick={() => router.push({
                pathname: `/home/persons/${item.id}`,
                query: router.query
            })}>
                {item[field]}
            </a>
        ) : item[field];
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
            render: item => <PersonField item={item} field='code'/>,
            show: true,
        },
        {
            title: 'Apellido paterno',
            render: item => <PersonField item={item} field='flast_name'/>,
            show: true
        },
        {
            title: 'Apellido materno',
            render: item => <PersonField item={item} field='mlast_name'/>,
            show: true
        },
        {
            title: 'Nombres',
            render: item => <PersonField item={item} field='first_name'/>,
            show: true,
        },
        {
            title: 'Jefe inmediato',
            dataIndex: 'immediate_supervisor',
            show: true,
            render: (item) => item ? getFullName(item) : <></>
        },
        // {
        //     title: 'Jefe suplente',
        //     dataIndex: 'substitute_immediate_supervisor',
        //     show: true,
        //     render: (item) => item ? getFullName(item) : <></>
        // },
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
        // {
        //     title: 'Intranet',
        //     show: generalConfig?.intranet_enabled,
        //     render: (item) => (
        //         <Select
        //             size='small'
        //             style={{ width: 90 }}
        //             defaultValue={item.intranet_access}
        //             value={item.intranet_access}
        //             placeholder='Acceso'
        //             options={intranetAccess}
        //             onChange={(e) => actionIntranet(e, item)}
        //         />
        //     )
        // },
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

    useEffect(() => {
      console.log('minDataValid',minDataValid)
    }, [minDataValid])

    const disabledDates = (current) => {
        let valid_start = true
        if(minDataValid){
            valid_start = current < moment(minDataValid)?.startOf("day");
        }
        return valid_start;
    }
    

    const submitMovImss = async (values) => {
        values['person_id'] = itemPerson.id
        values['departure_date'] = moment(values.departure_date).format("YYYY-MM-DD")
        values['mov_type'] = movType
        if(movType === 'up'){
            values['departure_motive'] = null
        }

        try {
            setLoading(true)
            let resp = await WebApiPeople.PersonUpDown(values)
            if(resp.status === 200){
                if(movType === 'up'){
                    message.success("Se genero el reingreso de la persona")
                }else{
                    message.success("Se ha solicitado la baja del colaborador")
                }
                
                form.resetFields()
                setOpenModalMovImss(false)
                getCollaborators(currentNode?.id, user_filters, user_page, user_page_size);
                setMinDataValid(null)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log('error', error)
        } 
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
            <GenericModal 
                setVisible={setOpenModalMovImss} 
                visible={openModalMovImss} 
                title={ movType === "up" ? "Generar reingreso" : "Generar baja del colaborador"}
                actionButton={
                    () => form.submit()
                }
                titleActionButton="Generar"
            >
                <Form form={form} onFinish={submitMovImss} layout='vertical'>
                    <Spin spinning={loading}>
                    <Row justify='center' >
                        <Col span={12} >
                            <Form.Item label={movType === "up" ? "Fecha de reingreso" : "Fecha de baja"} name={'departure_date'} rules={[ruleRequired]} >
                                <DatePicker locale={locale} style={{width:'80%'}} format={'DD-MM-YYYY'} disabledDate={disabledDates} />
                            </Form.Item>
                        </Col>
                        {
                            movType == "down" && 
                            <Col span={12} >
                                <Form.Item label="Motivo" name={'departure_motive'} rules={[ruleRequired]} >
                                <Select
                                    placeholder="Seleccione una opción"
                                    style={{ width: "80%" }}
                                    options={departureMotive}
                                />
                                </Form.Item>
                            </Col>
                        }
                    </Row>
                    </Spin>
                </Form>
            </GenericModal>
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