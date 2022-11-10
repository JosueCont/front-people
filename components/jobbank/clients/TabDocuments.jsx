import React, { useRef } from 'react';
import {
    Row,
    Col,
    Button,
    Tooltip,
    Empty,
    message
} from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    ReloadOutlined,
    SelectOutlined
} from '@ant-design/icons';
import { valueToFilter } from '../../../utils/functions';
import { redirectTo } from '../../../utils/constant';

const TabDocuments = ({
    newDocs,
    prevDocs,
    setNewDocs,
    setPrevDocs,
    showPrevDocs = true
}) => {

    const inputFile = useRef(null);

    const setFileSelected = ({target : { files }}) =>{
        if(Object.keys(files).length <= 0) return false;
        let nameFile = valueToFilter(files[0].name);
        const existNew = (item) => valueToFilter(item.name) == nameFile;
        const existPrev = (item) => valueToFilter(item.document.split('/').at(-1)) == nameFile;
        let existNew_ = newDocs.some(existNew);
        let existPrev_ = prevDocs.some(existPrev);
        if(existNew_ || existPrev_) return message.error('Archivo existente');
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

    return (
        <Row gutter={[24,8]} className='tab-documents'>
            <Col span={24} className='content-list-files'>
                <div className='head-list-files'>
                    <p style={{marginBottom: 0}}>Nuevos archivos ({newDocs.length})</p>
                    <Button
                        size={'small'}
                        icon={<UploadOutlined />}
                        onClick={()=> openFile()}
                    />
                    <input
                        type={'file'}
                        style={{display: 'none'}}
                        ref={inputFile}
                        onChange={setFileSelected}
                    />
                </div>
                <div className='body-list-files scroll-bar'>
                    {newDocs.length > 0 ? newDocs.map((item, idx) => (
                        <div
                            key={`item_${idx}`}
                            className='item-list-files'
                            style={{color: '#28a745'}}
                        >
                            <p>{item.name}</p>
                            <DeleteOutlined
                                onClick={()=> deleteNewDocs(idx)}
                            />
                        </div>
                    )) : (
                        <Empty
                            description='Ningún archivo nuevo'
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            style={{margin: 0}}
                        />
                    )}
                </div>
            </Col>
            {showPrevDocs && (
                <Col span={24} className='content-list-files'>
                    <div className='head-list-files'>
                        <p style={{marginBottom: 0}}>Archivos existentes ({prevDocs.length})</p>
                    </div>
                    <div className='body-list-files scroll-bar'>
                        {prevDocs.length > 0 ? prevDocs.map((item, idx) => (
                            <div
                                key={`item_${item.id}`}
                                className='item-list-files'
                                style={{color: item.is_deleted ? '#dc3545': 'black'}}
                            >
                                <p>{item.name}</p>
                                <div className='item-list-options'>
                                    <Tooltip title='Visualizar'>
                                        <SelectOutlined onClick={()=> redirectTo(item.document, true)}/>
                                    </Tooltip>
                                    {item.is_deleted ? (
                                        <Tooltip title='Restaurar'>
                                            <ReloadOutlined onClick={()=> deletePrevDocs(item, false)}/>
                                        </Tooltip>
                                    ): (
                                        <Tooltip placement='Eliminar'>
                                            <DeleteOutlined onClick={()=> deletePrevDocs(item, true)}/>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <Empty
                                description='Ningún archivo existente'
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                style={{margin: 0}}
                            />
                        )}
                    </div>
                </Col>
            )}
        </Row>
    )
}

export default TabDocuments;