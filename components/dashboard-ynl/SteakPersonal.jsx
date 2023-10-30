import React,{useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { Row,Col,Card, Typography, Image, Spin } from "antd";
import {  Whatshot , LocalFireDepartment} from "@material-ui/icons";
import { FaFire } from "react-icons/fa";
const {Text} = Typography;

const SteakPersonal = () => {
    const reportPerson = useSelector(state => state.ynlStore.reportPerson)
    console.log('el reporte personal',reportPerson)
    return(
        <Card
            className='card-dashboard'
            title="Días de racha"
            style={{
                width: '100%',
                display:'flex',
                flexDirection:'column',
                
            }}> 

            <Row justify="center" style={{display:'flex',alignItems:'center',}}>
                <FaFire size={45} color='orange'/>
                
                <Text style={{fontSize:30, fontWeight:700}}>{reportPerson?.data && reportPerson?.data[0]?.streaks != null ? reportPerson?.data[0]?.streaks?.totalDays : '0'} días </Text>
            </Row>

            </Card>
    )
}

export default SteakPersonal;