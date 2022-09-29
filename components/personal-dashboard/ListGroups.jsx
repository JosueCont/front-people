import React, { useState, useEffect } from 'react';
import { Avatar, List, Card, Row, Col, Modal, Progress,Space } from 'antd';
import { CloseOutlined, PeopleOutlineOutlined} from "@material-ui/icons";
import { EyeOutlined,FundViewOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux'

const ListGroups = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currentMembers, setCurrentMembers] = useState([]);
    const reportPerson = useSelector((state) => state.ynlStore.reportPerson)

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
                    dataSource={reportPerson?.data && (reportPerson?.data[0]?.groups?reportPerson?.data[0]?.groups:[])}
                    renderItem={(item, index) =>(
                        <List.Item 
                            key={item}
                            actions={[<PeopleOutlineOutlined style={{cursor:'pointer'}} onClick={()=> {
                                setCurrentMembers(reportPerson?.data && (reportPerson?.data[0]?.groups[index]?.members?reportPerson?.data[0]?.groups[index]?.members:[]))
                                showModalMembers(index)
                            }}/>]}
                        >
                            <List.Item.Meta
                            avatar={<Avatar src="/images/LogoYnl.png" />}
                            title={<h1>{item.name}</h1>}
                            />
                        </List.Item>
                    )}
                />
            </Col>   
        </Card>
        <Modal title={`Miembros del grupo (${currentMembers && currentMembers.length})`} visible={isOpenModal} onOk={handleOk} onCancel={handleCancel}>
            <Col span={24} className='content-feeling-scroll scroll-bar'>
                <List
                    itemLayout="horizontal"
                    dataSource={currentMembers}
                    renderItem={(item, index) =>(
                        <List.Item 
                            key={item}
                            actions={[<EyeOutlined style={{cursor:'pointer',fontSize:20}} />]}
                        >
                            <List.Item.Meta
                            avatar={<Avatar  src="/images/LogoYnl.png" />}
                            title={<><span>{item?.fullName}</span>
                                <Progress
                                    strokeColor={item?.value<50? {
                                        '0%': '#c10f0f',
                                        '40%': '#c10f0f',
                                    } : {
                                        '0%': '#50c10f',
                                        '60%': '#50c10f',
                                    }}
                                    percent={Math.round(item?.value)} />
                            </>}
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