import React, { useState, useEffect } from 'react';
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
    disableList = false //boolean
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

    const getTitle = (item) =>{
        if(!keyTitle.trim()) return null;
        let access_title = keyTitle?.replaceAll(' ','')?.split(',');
        return access_title.reduce((acc, current) =>{
            if(!acc) return null;
            return acc[current] ?? null;
        }, item)
    }

    const getDescription = (item) =>{
        if(!keyDescription.trim()) return null;
        let access_description = keyDescription?.replaceAll(' ','')?.split(',');
        return access_description.reduce((acc, current) =>{
            if(!acc) return null;
            return acc[current] ?? null;
        }, item)
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
                    
                    {
                        !disableList && 

                        <div className='items-to-list scroll-bar'>
                            {itemsToList.length > 0 && itemsToList.map((item, idx) => (
                                <div key={idx}>
                                    <p>{getTitle(item)}</p>
                                    <p>{getDescription(item)}</p>
                                </div>
                            ))}
                        </div>
                    }

                    
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