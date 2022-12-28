import React, { useState, useEffect } from 'react';
import MyModal from './MyModal';
import { Row, Col, List, Button } from 'antd';

const DeleteItems = ({
    title = '', //string
    visible = false, //boolean
    keyTitle = '', //string
    keyDescription = '', //string
    close = () => {}, //function,
    itemsToDelete = [], //array
    actionDelete = ()=> {},//function
    textCancel = 'Cancelar', //string
    textDelete = 'Eliminar', //string
    viewAsList = false, //boolean,
    timeLoad = 2000
}) =>{

    const [loading, setLoading] = useState(false);

    const onFinish = () =>{
        setLoading(true)
        setTimeout(()=>{
            actionDelete()
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
        >
            <Row>
                <Col span={24} className='elements_delete scroll-bar'>
                    <List
                        size={'small'}
                        itemLayout={'horizontal'}
                        dataSource={itemsToDelete}
                        renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    title={getTitle(item)}
                                    description={getDescription(item)}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
                <Col
                    span={24}
                    style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button onClick={()=> close()}>
                        {textCancel}
                    </Button>
                    {!viewAsList && (
                        <Button
                            loading={loading}
                            onClick={()=> onFinish()}
                        >
                            {textDelete}
                        </Button>
                    )}
                </Col>
            </Row>
        </MyModal>
    )
}

export default DeleteItems;