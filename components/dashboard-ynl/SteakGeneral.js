import React,{useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { Row,Col,Card, Typography, Image, Spin } from "antd";

const {Text} = Typography;

const StreakGeneral = () => {

    const streaks = useSelector(state => state.ynlStore.streaksList)
    const loader = useSelector(state => state.ynlStore.loadReportStreak)
    console.log('streaks',streaks)

    useEffect(() => {
        setData()
    },[streaks])

    const setData = () => {

    }

    const getName = (firstname, lastname) => {
        let first = firstname != null ? firstname?.split(' ')[0] : 'Sin'
        let last = lastname != null ? lastname?.split(' ')[0] : 'nombre'
        return `${first} ${last}`;

    }


    return(
        <>
            <Card
                className='card-dashboard'
                title="Top días de racha"
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
                            {streaks.length > 0 ? 
                                streaks.map((item,index) => (
                                    <Row style={{marginBottom:10, alignItems:'center', display:'flex', flex:1,justifyContent:'space-between', }}>
                                        <Col style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
                                        <div style={{ width:20, }}>
                                            <Text strong >{index + 1}</Text>

                                        </div>

                                            <Image
                                                style={{width:50, height:50, borderRadius:25, marginLeft:0}}
                                                src={item?.user?.avatar?.url ? item?.user?.avatar?.url : '/images/profile-sq.jpg'}
                                                preview={false}
                                            />
                                        </Col>
                                        <Text style={{display:'flex',textAlign:'start'}}>{getName(item?.user?.firstName, item?.user?.lastName)}</Text>
                                        <Text>{item?.totalDays}</Text>
                                        
                                    </Row>
                                )) 
                            : (
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

export default StreakGeneral;