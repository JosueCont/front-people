import React, { useState, useEffect } from 'react';
import MyModal from '../../../common/MyModal';
import { Row, Col, List, Button } from 'antd';

const DeleteVacancies = ({
    visible = false, //boolean
    close = () => {}, //function,
    itemsToDelete = [], //array
    actionDelete = ()=> {},//function
}) =>{

    const [loading, setLoading] = useState(false);

    const onFinish = () =>{
        setLoading(true)
        setTimeout(()=>{
            actionDelete()
            setLoading(false)
        },2000)
    }

    return(
        <MyModal
            title={itemsToDelete.length > 1
                ? '¿Estás seguro de eliminar estas vacantes?'
                : '¿Estás seguro de eliminar esta vacante?'
            }
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
                                    title={item.job_position}
                                    description={item.description}
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
                        No
                    </Button>
                    <Button
                        loading={loading}
                        onClick={()=> onFinish()}
                    >
                        Sí
                    </Button>
                </Col>
            </Row>
        </MyModal>
    )
}

export default DeleteVacancies;