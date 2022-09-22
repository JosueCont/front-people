import {React, useEffect, useState} from 'react'
import { Row,Col,} from 'antd'

export const DashboardPerPeople = () => {
  return (
    <>
        <Row gutter={[16,24]} className='container-dashboard'>
            <Col xs={24} sm={24} md={10}  className='item-dashboard'>
                <h1>Aqui iría foto perfil</h1>
            </Col>
            <Col xs={24} sm={24} md={14}  className='item-dashboard'>
                <h1>Aqui iría historial</h1>
            </Col>
            <Col xs={24} sm={24} md={10} className='item-dashboard'>
                <h1>Aqui gráfica pie</h1>
            </Col>
            <Col xs={24} sm={24} md={14}  className='item-dashboard'>
                <h1>Aqui iría calendario</h1>
            </Col>
        </Row>     
    </>    
  )
}