import React, { useState } from 'react';
import MyModal from './MyModal';
import { Row, Col, List, Button } from 'antd';

const ListItems = ({
    title = '', //string
    visible = false, //boolean
    keyTitle = '', //string
    keyDescription = '', //string
    close = () => {}, //function,
    itemsToList = [], //array
    actionConfirm = ()=> {},//function
    textCancel = 'Cancelar', //string
    textConfirm = 'Eliminar', //string
    useWithAction = true, //boolean,
    timeLoad = 2000, //integer
}) =>{

    const [loading, setLoading] = useState(false);

    const onFinish = () =>{
        setLoading(true)
        setTimeout(()=>{
            actionConfirm()
            setLoading(false)
            close()
        }, timeLoad)
    }

    const cleanKey = (key = '') =>{
        let withoutSpace = key.includes(' ') ? key?.replace(/\s/g,'') : key;
        return withoutSpace.includes(',') ? withoutSpace.split(',') : [withoutSpace];
    }

    const getValue = (keys = [], item) =>{
        return keys.reduce((acc, current) =>{
            let value = item[current] ?? '';
            return `${acc} ${value}`;
        }, '')
    }

    const accessValue = (key = '', item) =>{
        let keysArray = cleanKey(key);
        return keysArray.reduce((acc, current) =>{
            if(!acc) return null;
            return acc[current] ?? null;
        }, item)
    }

    const getTitle = (item) =>{
        if(Array.isArray(keyTitle)){
            if(keyTitle.length <=0) return null;
            return getValue(keyTitle, item);
        }
        if(!keyTitle.trim()) return null;
        return accessValue(keyTitle, item);
    }

    const getDescription = (item) =>{
        if(Array.isArray(keyDescription)){
            if(keyDescription.length <=0) return null;
            return getValue(keyDescription, item);
        }
        if(!keyDescription.trim()) return null;
        return accessValue(keyDescription, item)
    }

    return(
        <MyModal
            title={title}
            visible={visible}
            close={close}
            widthModal={400}
            closable={!loading}
        >
            <Row gutter={[0,16]}>
                <Col span={24}>
                    <div className='items-to-list scroll-bar'>
                        {itemsToList.length > 0 && itemsToList.map((item, idx) => (
                            <div key={idx}>
                                <p>{getTitle(item)}</p>
                                <p>{getDescription(item)}</p>
                            </div>
                        ))}
                    </div>
                </Col>
                <Col span={24} className='content-end' style={{gap: 8}}>
                    <Button disabled={loading} onClick={()=> close()}>
                        {textCancel}
                    </Button>
                    {useWithAction && (
                        <Button loading={loading} onClick={()=> onFinish()}>
                            {textConfirm}
                        </Button>
                    )}
                </Col>
            </Row>
        </MyModal>
    )
}

export default ListItems;