import React,{useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { Row,Col,Card, Typography, Image } from "antd";
import ChartBarGoals from "../dashboards-cards/ChartBarGoals";
const {Text} = Typography;

const ChartGoalsPersonal = () => {

    const reportPerson = useSelector(state => state.ynlStore.reportPerson)

    return(
        <Card
            className='card-dashboard'
            title="Gráfica de objetivos"
            style={{
                width: '100%',
            }}>

            { reportPerson?.data && reportPerson?.data[0]?.goals?.length > 0 ? 
            <div style={{display:'flex', flexDirection:'column'}}>
                <Row style={{justifyContent:'space-evenly'}}>
                    { reportPerson?.data[0]?.goals.map((item,index) => (
                        <Col style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <Image src={item.icon.url} style={{width:25, height:30, }} preview={false}/>
                            <Text className='lbl'>{item.name}</Text>
                            <Text>{item?.goals_completed}/{item?.goals}</Text>
                        </Col>
                    ))}
                </Row>
           {reportPerson?.data && reportPerson?.data[0]?.goals?.length && <ChartBarGoals dataChart={reportPerson?.data[0]?.goals}/>}
            </div>
            : (
                <Row justify="center">
                    <Text>No hay datos disponibles</Text>
                </Row>
            )}

        </Card>
    )
}

export default ChartGoalsPersonal;