import {React, useEffect, useState} from 'react'
import { Row,Col,Card} from 'antd'

export const DashboardPerPeople = () => {
  return (
    <>
        <Row gutter={[16,24]} className='container-dashboard'>
            <Col xs={24} sm={24} md={8}  className='item-dashboard'>
                <Card  
                    className='card-dashboard'
                    title="Información del perfil"
                    style={{
                        width: '100%',
                    }}>
                        
                </Card>
            </Col>
            <Col xs={24} sm={24} md={16}  className='item-dashboard'>
                <Card  
                    className='card-dashboard'
                    title="Registros por emoción"
                    style={{
                        width: '100%',
                    }}>
                        
                </Card>
            </Col>
            <Col xs={24} sm={24} md={8} className='item-dashboard'>
                <Card  
                    className='card-dashboard'
                    title="Mi historial"
                    style={{
                        width: '100%',
                    }}>
                        
                </Card>
            </Col>
            <Col xs={24} sm={24} md={16}  className='item-dashboard'>
                <Card  
                    className='card-dashboard'
                    title="Emoción registrada por día"
                    style={{
                        width: '100%',
                    }}>
                        
                </Card>
            </Col>
        </Row>     
    </>    
  )
}