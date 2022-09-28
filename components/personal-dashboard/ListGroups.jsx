import React, { useState, useEffect } from 'react';
import { Avatar, List, Card, Row, Col, Modal } from 'antd';
import { CloseOutlined, PeopleOutlineOutlined, EyeOutlined} from "@material-ui/icons";  

const ListGroups = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const data = [
        {
            title: 'Mi familia',
        },
        {
            title: 'Mis amigos',
        },
        {
            title: 'Mi trabajo',
        },
        {
            title: 'Videojuegos',
        },
        {
            title: 'Mi familia',
        },
        {
            title: 'Mis amigos',
        },
        {
            title: 'Mi trabajo',
        },
        {
            title: 'Videojuegos',
        },
    ];
    const dataMembers = [
        {
            title: 'Gabriel Braga',
        },
        {
            title: 'Irvin Albornoz',
        },
        {
            title: 'Abraham Ciau',
        },
        {
            title: 'Alberto Noh',
        },
        {
            title: 'Luis López',
        },
        {
            title: 'Gaspar Dzul',
        },
    ];
    
    const showModalMembers = (index) =>{
        setIsOpenModal(true);
        // console.log("abriendo modal", index);
    } 
    const handleOk = () => {
        setIsOpenModal(false);
    };
    
    const handleCancel = () => {
        setIsOpenModal(false);
    }; 
  return (
    <>
        <Card  
            className='card-dashboard'
            title="Mis grupos"
            style={{
                width: '100%',
            }}>
            <Col span={24} className='content-feeling-scroll scroll-bar'>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) =>(
                        <List.Item 
                            key={item}
                            actions={[<PeopleOutlineOutlined onClick={()=> showModalMembers(index)}/>]}
                        >
                            <List.Item.Meta
                            avatar={<Avatar src="/images/LogoYnl.png" />}
                            title={<h1>{item.title}</h1>}
                            />
                        </List.Item>
                    )}
                />
            </Col>   
        </Card>
        <Modal title="Miembros del grupo" visible={isOpenModal} onOk={handleOk} onCancel={handleCancel}>
            <Col span={24} className='content-feeling-scroll scroll-bar'>
                <List
                    itemLayout="horizontal"
                    dataSource={dataMembers}
                    renderItem={(item, index) =>(
                        <List.Item 
                            key={item}
                            actions={[<PeopleOutlineOutlined/>]}
                        >
                            <List.Item.Meta
                            avatar={<Avatar src="/images/LogoYnl.png" />}
                            title={<span>{item.title}</span>}
                            />
                        </List.Item>
                    )}
                />
            </Col>
        </Modal> 
    </>
  )
}

export default ListGroups