import React from 'react';
import {
    Button,
    Dropdown,
    Menu
} from 'antd';
import {
    EllipsisOutlined,
    DownloadOutlined,
    UploadOutlined
} from '@ant-design/icons';

const OptionsCatalogs = () => {

    const Options = () => (
        <Menu>
            {/* <Menu.Item
                key='3'
                icon={<DownloadOutlined />}
            >
                Ver versión anterior
            </Menu.Item> */}
            <Menu.Item
                key='1'
                icon={<DownloadOutlined />}
            >
                Decargar todos los catálogos
            </Menu.Item>
            <Menu.Item
                key='2'
                icon={<UploadOutlined />}
            >
                Carga masiva de catálogos
            </Menu.Item>
        </Menu>
    )

    return (
        <Dropdown
            placement='bottomLeft'
            overlay={<Options />}
        >
            <Button>
                <EllipsisOutlined />
            </Button>
        </Dropdown>
    )
}

export default OptionsCatalogs