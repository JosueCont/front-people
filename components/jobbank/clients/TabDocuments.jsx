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
    DeleteOutlined
} from '@ant-design/icons';

const TabDocuments = ({
    listDocs,
    setListDocs
}) => {

    const inputFile = useRef(null);

    const setFileSelected = ({target : { files }}) =>{
        if(Object.keys(files).length <= 0) return false;
        let exist = listDocs.some(item => item.name == files[0].name);
        if(exist) return message.error('Archivo existente');
        let newList = [...listDocs, files[0]];
        setListDocs(newList)
    }

    const deleteItem = (idx) =>{
        let newList = [...listDocs];
        newList.splice(idx, 1);
        setListDocs(newList)
    }

    const openFile = () =>{
        inputFile.current.value = null;
        inputFile.current.click();
    }

    return (
        <Row gutter={[24,8]} className='tab-documents'>
           <Col span={24} className={'head-list-files'}>
                <p style={{marginBottom: 0}}>Archvios seleccionados ({listDocs.length})</p>
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
                {listDocs.length > 0 ? (
                    <div className={'body-list-files scroll-bar'}>
                        {listDocs.map((item, idx) => (
                            <div key={`item_${idx}`} className={'item-list-files'}>
                                <p>{item.name}</p>
                                <DeleteOutlined
                                    onClick={()=> deleteItem(idx)}
                                    style={{marginRight: '5px'}}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty
                        description={'Ningún archivo seleccionado'}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{transition: 'all 1s'}}
                    />
                    // <div className={'placeholder-list-files'} >
                    //     <p>Ningún archivo seleccionado</p>
                    // </div>
                )}
                
            </Col>
        </Row>
    )
}

export default TabDocuments;