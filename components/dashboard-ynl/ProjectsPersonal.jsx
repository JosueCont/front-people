import React,{useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { Row,Col,Card, Typography, Image, Spin } from "antd";
import moment from "moment";
const {Text} = Typography;

const ProjectsPersonal = () => {
    const reportPerson = useSelector(state => state.ynlStore.reportPerson)
    console.log('el reporte personal',reportPerson)
    return(
        <Card
            className='card-dashboard'
            title="Proyectos"
            style={{
                width: '100%',
                display:'flex',
                flexDirection:'column',
                
            }}> 
                <div className="container-widget">
                    {reportPerson?.data && reportPerson?.data[0]?.projects.length > 0 ? 
                       reportPerson?.data[0]?.projects.map((item,index) => (
                        <Row style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                            <Col>
                                <Text strong>{index + 1}</Text>
                                <Image 
                                    style={{width:50, height:50, borderRadius:25, marginLeft:10}}
                                    src={item.image.url}
                                    preview={false}/>
                            </Col>
                            <Text>{item.name}</Text>
                            <Text>{moment(item.createdAt).format('DD-MM-YYYY')}</Text>

                        </Row>
                       )) : (
                        <Row justify="center">
                            <Text>No hay datos disponibles</Text>
                        </Row>
                       ) }
                </div>
            

            </Card>
    )
}

export default ProjectsPersonal;