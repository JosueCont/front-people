import React, { useState, useEffect } from 'react';
import { Avatar, List, Card, Row, Col, Modal, Progress,Space, Empty, Tooltip } from 'antd';
import { CloseOutlined, PeopleOutlineOutlined} from "@material-ui/icons";
import { EyeOutlined,FundViewOutlined, PlusOutlined,MinusOutlined, SmileOutlined, FrownOutlined, UserOutlined, PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux'
import { useRouter } from "next/router";

const ListGroups = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currentMembers, setCurrentMembers] = useState([]);
    const [nameGruop, setNameGruop] = useState("");
    const reportPerson = useSelector((state) => state.ynlStore.reportPerson)
    const router = useRouter();

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

    const onDetail=(member)=>{
        let query = {user_id:member?.khonnect_id};
        if(!member?.khonnect_id){
            query = {user_id:member?.user_id};
        }
        const url ={ pathname:`/ynl/personal-dashboard`, query  }
        router.push(url,url,query)
        setIsOpenModal(false)
    }

  return (
    <>
        <Card  
            className='card-dashboard'
            title="Grupos del usuario"
            style={{
                width: '100%',
            }}>
            <Col span={24} className='content-feeling-scroll scroll-bar'>
                <List
                    itemLayout="horizontal"
                    locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="El usuario no es parte de un grupo" />}}
                    dataSource={reportPerson?.data && (reportPerson?.data[0]?.groups?reportPerson?.data[0]?.groups:[])}
                    renderItem={(item, index) =>(
                        <List.Item 
                            key={item}
                            actions={[<Tooltip title="Ver miembros del grupo"><PeopleOutlineOutlined style={{cursor:'pointer'}} onClick={()=> {
                                setCurrentMembers(reportPerson?.data && (reportPerson?.data[0]?.groups[index]?.members?reportPerson?.data[0]?.groups[index]?.members:[]))
                                showModalMembers(index)
                                setNameGruop(item.name)
                            }}/></Tooltip>]}
                        >
                            <List.Item.Meta
                            avatar={<Avatar src="/images/LogoYnl.png" />}
                            title={<><h1>{item.name} {item?.is_happy ? <SmileOutlined style={{color:'green'}} /> :<FrownOutlined style={{color:'red'}}/>}  </h1> </>}
                            />
                        </List.Item>
                    )}
                />
            </Col>   
        </Card>
        <Modal title={`Grupo: ${nameGruop}(${currentMembers && currentMembers.length})`} footer={[]} visible={isOpenModal} onOk={handleOk} onCancel={handleCancel}>
            <Col span={24} className='content-feeling-scroll scroll-bar'>
                <List
                    itemLayout="horizontal"
                    dataSource={currentMembers}
                    renderItem={(item, index) =>(
                        <List.Item 
                            key={index}
                            actions={[<EyeOutlined onClick={()=> onDetail(item) } style={{cursor:'pointer',fontSize:20,marginTop:20}} />]}
                        >
                            <List.Item.Meta
                            avatar={item?.is_happy ? <SmileOutlined style={{color:'green', fontSize:40}} /> :<FrownOutlined style={{color:'red',fontSize:40}}/>}
                            title={<><span>{(item?.fullName && item.fullName!=='null null') &&  item.fullName}</span>
                                <br/>
                                <small>{item.username}</small>
                                <Progress
                                    strokeColor={!item?.is_happy? {
                                        '0%': '#c10f0f',
                                        '40%': '#c10f0f',
                                    } : {
                                        '0%': '#50c10f',
                                        '60%': '#50c10f',
                                    }}
                                    percent={Math.round(item?.value)} />
                                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                                    <MinusCircleOutlined style={{fontSize:"20px"}} />
                                    <PlusCircleOutlined style={{fontSize:"20px", paddingRight:"36px"}}/>
                                </div>

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