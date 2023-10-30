import React,{useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { Row,Col,Card, Typography, Image, Spin } from "antd";

const {Text} = Typography;

const GoalsList = () => {
    const goals = useSelector(state => state.ynlStore.goalsList)
    const loader = useSelector(state => state.ynlStore.loadReportGoals)
    console.log('goals list',goals)
    

    const getName = (firstname, lastname) => {
        let first = firstname != null ? firstname?.split(' ')[0] : 'Sin'
        let last = lastname != null ? lastname?.split(' ')[0] : 'nombre'
        return `${first} ${last}`;
    }

    return(
        <>
            <Card
                className='card-dashboard'
                title="Top objetivos"
                style={{
                    width: '100%',
                    display:'flex',
                    flexDirection:'column',
                    
                }}>
                    {loader ? (
                        <Col style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
                            <Spin />
                        </Col>
                    ) : (
                        <div className="containerStreaks">
                            {goals.length > 0 ? 
                            goals.map((item,index) => (
                                <Row style={{marginBottom:10, alignItems:'center', display:'flex', flex:1,justifyContent:'space-between', }}>
                                    <Col>
                                        <Text strong>{index + 1}</Text>
                                        <Image 
                                            style={{width:50, height:50, borderRadius:25, marginLeft:10}}
                                            src={item?.values[0]?.user?.avatar?.url ? item?.user?.avatar?.url : '/images/profile-sq.jpg'}
                                            preview={false}/>
                                    </Col>
                                    <Text>{getName(item.values[0]?.user?.firstName,item.values[0]?.user?.lastName)}</Text>
                                    <Text>{item.count}</Text>
                                </Row>
                            )):(
                                <Row justify="center">
                                    <Text>No hay datos disponibles</Text>
                                </Row>
                            )}
                        </div>

                    )}

                </Card>
        </>
    )
}

export default GoalsList;