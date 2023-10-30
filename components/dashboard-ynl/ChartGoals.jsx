import React,{useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { Row,Col,Card, Typography, Image } from "antd";
import ChartBarGoals from "../dashboards-cards/ChartBarGoals";
const {Text} = Typography;

const ChartGoals = () => {

    const dataChart = useSelector(state => state.ynlStore.valuesChart)
    const loader = useSelector(state => state.ynlStore.loadChart)
    console.log('dataChart',dataChart)

    return(
        <Card
            className='card-dashboard'
            title="Gráfica de objetivos"
            style={{
                width: '100%',
            }}>

            {dataChart.length > 0 ? 
            <div style={{display:'flex', flexDirection:'column'}}>
                <Row style={{justifyContent:'space-evenly'}}>
                    {dataChart.map((item,index) => (
                        <Col style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <Image src={item.icon.url} style={{width:25, height:30, }}/>
                            <Text className='lbl'>{item.name}</Text>
                            <Text>{item?.goals_completed}/{item?.goals}</Text>
                        </Col>
                    ))}
                </Row>
            <ChartBarGoals dataChart={dataChart}/>
            </div>
            : (
                <Row justify="center">
                    <Text>No hay datos disponibles</Text>
                </Row>
            )}

        </Card>
    )
}

export default ChartGoals;