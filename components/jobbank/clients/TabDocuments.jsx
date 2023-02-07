import React, { useRef, useState } from 'react';
import {
    Row,
    Col,
    Button,
    Tooltip,
    Empty,
    message,
    Image
} from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    ReloadOutlined,
    SelectOutlined,
    QuestionCircleOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import {
    valueToFilter,
    popupPDF,
    downloadCustomFile,
    getFileExtension
} from '../../../utils/functions';
import { redirectTo } from '../../../utils/constant';

const TabDocuments = ({
    newDocs,
    prevDocs,
    setNewDocs,
    setPrevDocs,
    showPrevDocs = true
}) => {

    const inputFile = useRef(null);
    const [visible, setVisible] = useState(false);
    const [imgURL, setImgURL] = useState('');

    const setFileSelected = ({target : { files }}) =>{
        if(Object.keys(files).length <= 0) return false;
        let size = files[0].size / 1024 / 1024;
        if(size > 10){
            message.error(`Archivo pesado: ${size.toFixed(2)}mb`);
            return;
        }
        let nameFile = valueToFilter(files[0].name);
        const existNew = (item) => valueToFilter(item.name) == nameFile;
        const existPrev = (item) => valueToFilter(item.document.split('/').at(-1)) == nameFile;
        let existNew_ = newDocs.some(existNew);
        let existPrev_ = prevDocs.some(existPrev);
        if(existNew_ || existPrev_){
            message.error('Archivo existente');
            return;
        }
        let newList = [...newDocs, files[0]];
        setNewDocs(newList)
    }

    const deletePrevDocs = (item, is_deleted) =>{
        let newList = prevDocs.map(record =>{
            if(record.id == item.id) return {...record, is_deleted};
            return record;
        })
        setPrevDocs(newList);
    }

    const deleteNewDocs = (idx) =>{
        let newList = [...newDocs];
        newList.splice(idx, 1);
        setNewDocs(newList)
    }

    const openFile = () =>{
        inputFile.current.value = null;
        inputFile.current.click();
    }

    const getFile = (item) => item.document?.split('/')?.at(-1);
    const getType = (item) =>{
        let file = getFile(item);
        return getFileExtension(file).toLocaleLowerCase();
    }

    const previewFile = (item) =>{
        let type = getType(item);
        if(type == 'pdf'){
            popupPDF({url: item.document})
            return;
        }
        if(['png','jpg','jpeg'].includes(type)){
            setVisible(true)
            setImgURL(item.document)
            return;
        }
        redirectTo(item.document)
    }

    const previewImg = {
        visible,
        src: imgURL,
        onVisibleChange: (value) => {
            setVisible(value);
            setImgURL('')
        }
    }

    return (
        <>
            <div className='content-list-files'>
                <div className='head-list-files'>
                    <p style={{marginBottom: 0}}>Archivos cargados ({newDocs.length + prevDocs.length})</p>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <Tooltip title='Tamaño de archivo permitido, menor o igual a 10mb.'>
                            <QuestionCircleOutlined style={{color: 'rgba(0,0,0,0.4)', fontSize: '16px'}}/>
                        </Tooltip>
                        <Button
                            size='small'
                            icon={<UploadOutlined />}
                            onClick={()=> openFile()}
                        />
                    </div>
                    <input
                        type='file'
                        style={{display: 'none'}}
                        ref={inputFile}
                        onChange={setFileSelected}
                    />
                </div>
                {(prevDocs.length > 0 || newDocs.length > 0 ) ? (
                    <div className='body-list-files scroll-bar'>
                        {prevDocs.length > 0 && prevDocs.map((item, idx) => (
                            <div
                                key={`prev_${item.id}`}
                                className='item-list-files'
                                style={{color: item.is_deleted ? '#dc3545': 'black'}}
                            >
                                <p>{item.name}</p>
                                <div className='item-list-options'>
                                    {['png','jpg','jpeg','pdf'].includes(getType(item)) && (
                                        <Tooltip title='Visualizar'>
                                            <SelectOutlined onClick={()=> previewFile(item)}/>
                                        </Tooltip>
                                    )}
                                    <Tooltip title='Descargar'>
                                        <DownloadOutlined onClick={()=> downloadCustomFile({
                                            url: item.document,
                                            name: getFile(item)
                                        })}/>
                                    </Tooltip>
                                    {item.is_deleted ? (
                                        <Tooltip title='Restaurar'>
                                            <ReloadOutlined onClick={()=> deletePrevDocs(item, false)}/>
                                        </Tooltip>
                                    ): (
                                        <Tooltip title='Eliminar'>
                                            <DeleteOutlined onClick={()=> deletePrevDocs(item, true)}/>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        ))}
                        {newDocs.length > 0 && newDocs.map((item, idx) => (
                            <div
                                key={`new_${idx}`}
                                className='item-list-files'
                                style={{color: '#28a745'}}
                            >
                                <p>{item.name}</p>
                                <DeleteOutlined onClick={()=> deleteNewDocs(idx)}/>
                            </div>
                        ))}
                    </div>
                ): (
                    <Empty
                        description='Ningún archivo seleccionado'
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                )}
            </div>
            <Image
                rootClassName='preview-img-jb'
                style={{display: 'none'}}
                preview={previewImg}
            />
        </>
    )
}

export default TabDocuments;