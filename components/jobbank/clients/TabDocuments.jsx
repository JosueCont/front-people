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
    setPrevDocs
}) => {

    const inputFile = useRef(null);

    const setFileSelected = ({target : { files }}) =>{
        if(Object.keys(files).length <= 0) return false;
        let nameFile = valueToFilter(files[0].name);
        const existNew = (item) => valueToFilter(item.name) == nameFile;
        const existPrev = (item) => valueToFilter(item.document.split('/').at(-1)) == nameFile;
        let _existNew = newDocs.some(existNew);
        let _existPrev = prevDocs.some(existPrev);
        if(_existNew || _existPrev) return message.error('Archivo existente');
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
           <Col span={24} className={'head-list-files'}>
                <p style={{marginBottom: 0}}>Archvios seleccionados ({newDocs.length+prevDocs.length})</p>
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
            </Col>
            <Col span={24} style={{padding: 0}}>
                {(prevDocs.length > 0 || newDocs.length > 0 ) ? (
                    <div className='body-list-files scroll-bar'>
                        {prevDocs.length > 0 && prevDocs.map((item, idx) => (
                            <div
                                key={`item_${item.id}`}
                                className='item-list-files'
                                style={{color: item.is_deleted ? '#dc3545': 'black'}}
                            >
                                <p>{item.name}</p>
                                <div className='item-list-options'>
                                    <SelectOutlined onClick={()=> redirectTo(item.document, true)}/>
                                    {item.is_deleted ? (
                                        <ReloadOutlined onClick={()=> deletePrevDocs(item, false)}
                                        />
                                    ): (
                                        <DeleteOutlined onClick={()=> deletePrevDocs(item, true)}/>
                                    )}
                                </div>
                            </div>
                        ))}
                        {newDocs.length > 0 && newDocs.map((item, idx) => (
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
                        ))}
                    </div>
                ): (
                    <Empty
                        description={'Ningún archivo seleccionado'}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{transition: 'all 1s'}}
                    />
                )}
            </Col>
        </Row>
    )
}

export default TabDocuments;