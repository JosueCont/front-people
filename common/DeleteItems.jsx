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
    viewAsList = false, //boolean
}) =>{

    const [loading, setLoading] = useState(false);

    const onFinish = () =>{
        setLoading(true)
        setTimeout(()=>{
            actionDelete()
            setLoading(false)
            close()
        },2000)
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
                                    title={item[keyTitle]}
                                    description={item[keyDescription]}
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