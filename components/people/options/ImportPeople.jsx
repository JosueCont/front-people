import React, { useState, useRef } from 'react';
import { Menu, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getFileExtension } from '../../../utils/functions';

const ImportPeople = () => {

    const {
        general_config
    } = useSelector(state => state.userStore);
    const inputFile = useRef();
    const [openModal, setOpenModal] = useState(false);
    const typeFile = ['xlsx']

    const onChangeFile = ({ target: { files } }) => {
        if (Object.keys(files).length <= 0) {
            let msg = 'No se pudo cargar el archivo, intente de nuevo';
            message.error(msg)
            return;
        }
        let extension = getFileExtension(files[0].name);
        if (typeFile?.length > 0 && !typeFile.includes(extension.toLowerCase())) {
            let msg = 'El archivo seleccionado no es válido';
            message.error(msg);
            return;
        }
        setFile([files[0]]);
        setNameFile(files[0].name)
    }

    const handleOption = () => {
        if (!general_config?.nomina_enabled) {
            inputFile.current.value = null;
            inputFile.current.click();
            return;
        }
        setOpenModal(true)
    }

    return (
        <>
            <Menu.Item
                key='2'
                icon={<UploadOutlined />}
                onClick={() => handleOption()}
            >
                Importar personas
            </Menu.Item>
            <input
                type='file'
                style={{ display: 'none' }}
                accept={typeFile}
                ref={inputFile}
                onChange={onChangeFile}
            />
        </>
    )
}

export default ImportPeople