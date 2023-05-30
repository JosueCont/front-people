import React from 'react';
import {
    Button,
    Dropdown,
    Menu,
    Tooltip
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

const OptionsCollaborator = () => {

    const MenuOptions = () => (
        <Menu>
            <Menu.Item
                key='1'
                icon={<DownloadOutlined/>}
            >
                Descargar personas
            </Menu.Item>
            <Menu.Item
                key='2'
                icon={<UploadOutlined/>}
            >
                Importar personas
            </Menu.Item>
            <Menu.Item
                key='3'
                icon={<DownloadOutlined/>}
            >
                Importar personas
            </Menu.Item>
            <Menu.Item
                key='4'
                icon={<DownloadOutlined/>}
            >
                Descargar plantilla
            </Menu.Item>
            <Menu.Item
                key='5'
                icon={<DownloadOutlined/>}
            >
                Generar confronta
            </Menu.Item>
            <Menu.Item
                key='6'
                icon={<DownloadOutlined/>}
            >
                Actualizar salario
            </Menu.Item>
            <Menu.Item
                key='7'
                icon={<UserAddOutlined/>}
            >
                Agregar personas usando CIF
            </Menu.Item>
            <Menu.Item
                key='8'
                icon={<DownloadOutlined/>}
            >
                Descargar reporte vacaciones
            </Menu.Item>
        </Menu>
    )

    return (
        <Tooltip title='Opciones adicionales'>
            <Dropdown overlay={<MenuOptions/>}>
                <Button>
                    <EllipsisOutlined/>
                </Button>
            </Dropdown>
        </Tooltip>
    )
}

export default OptionsCollaborator