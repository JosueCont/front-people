import React, { useRef } from 'react';
import { Form, Input, Button, message, Tooltip } from 'antd';
import { ruleRequired } from '../../utils/rules';
import { getFileExtension } from '../../utils/functions';
import {
    ToTopOutlined,
    EyeOutlined,
    DeleteOutlined,
    DownloadOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { redirectTo } from '../../utils/constant';
import { downloadCustomFile } from '../../utils/functions';

const FileUpload = ({
    isRequired = false,
    dependencies = [],
    urlPreview = '',
    tooltip = '',
    setFile,
    maxSizeFile = 10,
    setNameFile = () => { },
    typeFile = [],
    label = '',
    keyName = 'name_file',
    disabled = false,
    download = false,
    revertColor = false,
    hideOptions = false,
    sizeInput = 'default',
    style = {}
}) => {

    const inputFile = useRef(null);

    const openFile = () => {
        inputFile.current.value = null;
        inputFile.current.click();
    }

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
        let size = files[0].size / 1024 / 1024;
        if (size > maxSizeFile) {
            message.error(`Archivo pesado: ${size.toFixed(2)}mb`);
            return;
        }
        setFile([files[0]]);
        setNameFile(files[0].name)
    }

    const resetImg = () => {
        setFile([]);
        setNameFile(null)
    }

    return (
        <Form.Item style={style}>
            <div className='custom-label-form'>
                <label className={isRequired ? 'custom-required' : ''}>
                    {label} {tooltip && (<Tooltip title={tooltip}><QuestionCircleOutlined /></Tooltip>)}
                </label>
                {!hideOptions && (
                    <div className={`label-options ${revertColor ? 'revert' : 'default'}`}>
                        {urlPreview ? (
                            <Tooltip title={download ? 'Descargar' : 'Visualizar'}>
                                {download ?
                                    <DownloadOutlined onClick={() => downloadCustomFile({
                                        url: urlPreview,
                                        name: urlPreview?.split('/')?.at(-1)
                                    })}
                                    /> : <EyeOutlined onClick={() => redirectTo(urlPreview, true)} />}
                            </Tooltip>
                        ) : setFile && (
                            <Tooltip title={!disabled ? 'Eliminar' : ''}>
                                <DeleteOutlined
                                    disabled={disabled}
                                    onClick={() => !disabled ? resetImg() : {}}
                                />
                            </Tooltip>
                        )}
                        {setFile && (
                            <Tooltip title={!disabled ? 'Subir archivo' : ''}>
                                <ToTopOutlined
                                    disabled={disabled}
                                    onClick={() => !disabled ? openFile() : {}}
                                />
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>
            <Form.Item
                noStyle
                name={keyName}
                dependencies={dependencies}
                rules={[isRequired ? ruleRequired : {}]}
            >
                <Input
                    readOnly
                    size={sizeInput}
                    disabled={disabled}
                    placeholder='Ningún archivo seleccionado'
                />
            </Form.Item>
            <input
                type='file'
                style={{ display: 'none' }}
                accept={typeFile.reduce((acc, item) => `${acc}.${item}, `, '')}
                ref={inputFile}
                onChange={onChangeFile}
            />
        </Form.Item>
    )
}

export default FileUpload