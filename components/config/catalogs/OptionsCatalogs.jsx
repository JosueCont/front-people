import React, { useState } from 'react';
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
import { useSelector } from 'react-redux';
import WebApiPeople from '../../../api/WebApiPeople';
import { downloadBLOB } from '../../../utils/functions';
import ModalCatalogs from './ModalCatalogs';

const OptionsCatalogs = () => {

    const {
        current_node
    } = useSelector(state => state.userStore)
    const [openModal, setOpenModal] = useState(false);

    const downloadCatalogs = async () => {
        try {
            if (!current_node) return;
            let response = await WebApiPeople.downloadCatalogs(current_node?.id);
            downloadBLOB({ data: response.data, name: 'Catalogos.xlsx' })
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.message;
            let msg = error ? error : 'Error al descargar el archivo';
            message.error(msg)
        }
    }

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
                onClick={() => downloadCatalogs()}
            >
                Decargar todos los catálogos
            </Menu.Item>
            <Menu.Item
                key='2'
                icon={<UploadOutlined />}
                onClick={()=> setOpenModal(true)}
            >
                Carga masiva de catálogos
            </Menu.Item>
        </Menu>
    )

    return (
        <>
            <Dropdown
                placement='bottomLeft'
                overlay={<Options />}
            >
                <Button>
                    <EllipsisOutlined />
                </Button>
            </Dropdown>
            <ModalCatalogs
                visible={openModal}
                close={()=> setOpenModal(false)}
            />
        </>
    )
}

export default OptionsCatalogs