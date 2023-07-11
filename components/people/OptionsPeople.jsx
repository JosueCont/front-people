import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import {
    Button,
    Dropdown,
    Menu,
    Tooltip,
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
import WebApiPeople from '../../api/WebApiPeople';
import WebApiPayroll from '../../api/WebApiPayroll';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import { setDataUpload } from '../../redux/UserDuck';
import { useRouter } from 'next/router';
import { downloadBLOB } from '../../utils/functions';
import ModalImport from './modals/ModalImport';
import ModalConfronts from './modals/ModalConfronts';
import ModalAddPersonCFI from '../modal/ModalAddPersonCFI';

const OptionsPeople = () => {

    const {
        user,
        permissions,
        current_node,
        general_config
    } = useSelector(state => state.userStore);

    const {
        cat_patronal_registration
    } = useSelector(state => state?.catalogStore);

    const router = useRouter();
    const dispatch = useDispatch();

    const [openImport, setOpenImport] = useState(false);
    const [openConfront, setOpenConfront] = useState(false);
    const [openCIF, setOpenCIF] = useState(false);

    const actionError = (e) => {
        let error = e.response?.data?.message;
        let msg = error ? error : 'Error al descargar el archivo';
        message.error(msg)
    }

    const actionDownloadPeople = async () => {
        try {
            let body = { ...router.query, node: current_node?.id };
            let response = await WebApiPeople.downloadPeople(body);
            downloadBLOB({ data: response.data, name: 'Personas.xlsx' });
        } catch (e) {
            console.log(e)
            actionError(e)
        }
    }

    const actionDownloadTemplate = async () => {
        try {
            let response = await WebApiPeople.downloadTemplate(current_node?.id, `&type=1`);
            downloadBLOB({ data: response.data, name: 'Plantilla personas.xlsx' })
        } catch (e) {
            console.log(e)
            actionError(e)
        }
    }

    const createDataImport = (values = {}) => {
        let data = new FormData();
        let imss = values?.types_imss ? [3] : [];
        let timbrado = values?.types_stamp ? [2] : [];
        data.append('types', [1, ...imss, ...timbrado, 0])
        data.append('excel_person_file', values?.file);
        data.append('node_id', current_node?.id);
        data.append('saved_by', user?.id);
        return data;
    }

    const actionImport = async (values) => {
        try {
            let body = createDataImport(values);
            dispatch(setDataUpload(body))
            setTimeout(() => {
                router.push('/bulk_upload/preview');
            }, 1000)
        } catch (e) {
            console.log(e)
            message.error({ content: 'Archivo no cargado', key })
        }
    }

    const actionConfronts = async (values = {}) => {
        try {
            let id = values?.patronal
                ? values?.patronal
                : cat_patronal_registration?.at(-1)?.id;
            let body = { node_id: current_node?.id, patronal_registration_id: id };
            let response = await WebApiPayroll.downloadConfronts(body);
            downloadBLOB({ data: response.data, name: 'Confronta.xlsx' })
        } catch (e) {
            console.log(e)
            message.error('No se encontró el documento de emisión')
        }
    }

    const actionDownloadVacaction = async () => {
        try {
            let body = { ...router.query, node: current_node?.id };
            let response = await WebApiPeople.downloadVacation(body);
            downloadBLOB({ data: response.data, name: 'Reporte vacaciones.xlsx' });
        } catch (e) {
            console.log(e)
            actionError(e)
        }
    }

    const handleConfronts = () => {
        if (cat_patronal_registration?.length == 1) {
            actionConfronts();
            return;
        }
        setOpenConfront(true)
    }

    const MenuOptions = () => {
        return (
            <Menu>
                {permissions?.person?.export_csv_person && (
                    <Menu.Item
                        key='1'
                        icon={<DownloadOutlined />}
                        onClick={() => actionDownloadPeople()}
                    >
                        Descargar personas
                    </Menu.Item>
                )}
                {permissions?.person?.import_csv_person && (
                    <Menu.Item
                        key='2'
                        icon={<UploadOutlined />}
                        onClick={() => setOpenImport(true)}
                    >
                        Importar personas
                    </Menu.Item>
                )}
                <Menu.Item
                    key='3'
                    icon={<DownloadOutlined />}
                    onClick={() => actionDownloadTemplate()}
                >
                    Descargar plantilla
                </Menu.Item>
                {general_config?.nomina_enabled && (
                    <Menu.Item
                        key='5'
                        icon={<DownloadOutlined />}
                        onClick={() => handleConfronts()}
                    >
                        Generar confronta
                    </Menu.Item>
                )}
                <Menu.Item
                    key='7'
                    icon={<UserAddOutlined />}
                    onClick={() => setOpenCIF(true)}
                >
                    Agregar persona usando CIF
                </Menu.Item>
                <Menu.Item
                    key='8'
                    icon={<DownloadOutlined />}
                    onClick={() => actionDownloadVacaction()}
                >
                    Descargar reporte vacaciones
                </Menu.Item>
            </Menu>
        )
    }

    return (
        <>
            <Tooltip title='Opciones adicionales'>
                <Dropdown overlay={<MenuOptions />}>
                    <Button>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            </Tooltip>
            <ModalImport
                visible={openImport}
                close={() => setOpenImport(false)}
                actionForm={actionImport}
            />
            <ModalConfronts
                visible={openConfront}
                close={() => setOpenConfront(false)}
                actionForm={actionConfronts}
            />
            <ModalAddPersonCFI
                visible={openCIF}
                setVisible={setOpenCIF}
                node_id={current_node?.id}
            />
        </>
    )
}

export default OptionsPeople