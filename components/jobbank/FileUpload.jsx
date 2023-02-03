import React, { useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import { ruleRequired } from '../../utils/rules';
import { getFileExtension } from '../../utils/functions';
import {
    ToTopOutlined,
    EyeOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { redirectTo } from '../../utils/constant';

const FileUpload = ({
    isRequired = false,
    dependencies = [],
    urlPreview = '',
    tooltip = '',
    setFile,
    maxSizeFile = 10,
    setNameFile = ()=>{},
    typeFile = [],
    label = '',
    keyName = 'name_file',
    disabled = false
}) => {

    const inputFile = useRef(null);

    const openFile = () =>{
        inputFile.current.value = null;
        inputFile.current.click();
    }

    const onChangeFile = ({target : { files }}) =>{
        if(Object.keys(files).length <= 0){
            let msg = 'No se pudo cargar el archivo, intente de nuevo';
            message.error(msg)
            return;
        }
        let extension = getFileExtension(files[0].name);
        if(!typeFile.includes(extension.toLowerCase())){
            let msg = 'El archivo seleccionado no es válido';
            message.error(msg);
            return;
        }
        let size = files[0].size / 1024 / 1024;
        if(size > maxSizeFile){
            message.error(`Archivo pesado: ${size.toFixed(2)}mb`);
            return;
        }
        setFile([files[0]]);
        setNameFile(files[0].name)
    }

    const resetImg = () =>{
        setFile([]);
        setNameFile(null)
    }

    return (
        <Form.Item
            label={label}
            tooltip={tooltip}
            required={isRequired}
        >
            <Input.Group compact>
                <Form.Item
                    noStyle
                    name={keyName}
                    dependencies={dependencies}
                    rules={[isRequired ? ruleRequired : {}]}
                >
                    <Input
                        readOnly
                        disabled={disabled}
                        placeholder='Ningún archivo seleccionado'
                        style={{
                            width: 'calc(100% - 64px)',
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10
                        }}
                    />
                </Form.Item>
                {urlPreview ? (
                    <Button
                        className='custom-btn'
                        onClick={()=> redirectTo(urlPreview, true)}
                        icon={<EyeOutlined />}
                    />
                ): (
                    <Button
                        className='custom-btn'
                        onClick={()=> resetImg()}
                        icon={<DeleteOutlined />}
                        disabled={disabled}
                    />
                )}
                <Button
                    icon={<ToTopOutlined />}
                    onClick={()=> openFile()}
                    disabled={disabled}
                    style={{
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10
                    }}
                />
                <input
                    type='file'
                    style={{display: 'none'}}
                    accept={typeFile.reduce((acc, item) => `${acc}.${item}, `,'')}
                    ref={inputFile}
                    onChange={onChangeFile}
                />
            </Input.Group>
        </Form.Item>
    )
}

export default FileUpload