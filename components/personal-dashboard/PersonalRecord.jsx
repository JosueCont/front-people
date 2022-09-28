import {React, useEffect, useState} from 'react'
import { Row, Col, Card, List, Avatar} from 'antd'

const PersonalRecord = () => {
    let colors = [
        "#1a85ff",
        "#ff457d",
        "#2fdaff",
        "#ffc700",
        "#ff5e00",
        "#ff1111",
        "#9c4fff"
    ]
    const data = [
        {
          id:0,  
          feeling: 'Abierto',
          label: 'Abierto',
          description: '.......'
        },
        {
          id:1,  
          feeling: 'Inspirado',
          label: 'Inspirado',
          description: '.......'
        },
        {
          id:2,  
          feeling: 'En paz',
          label: 'En paz',
          description: '.......'
        },
        {
          id:3,  
          feeling: 'Contento',
          label: 'Contento',
          description: '.......'
        },
        {
          id:4,  
          feeling: 'Confundido',
          label: 'Confundido',
          description: '.......'
        },
        {
          id:5,  
          feeling: 'Molesto',
          label: 'Molesto',
          description: '.......'
        },
        {
          id:6,  
          feeling: 'Deprimido',
          label: 'Deprimido',
          description: '.......'
        },
      ];
  return (
    <>
        <Card  
            className='card-dashboard'
            title="Mi historial"
            style={{
                width: '100%',
            }}>
            <Col span={24} className='content-feeling-scroll scroll-bar'>
              <List
                  dataSource={data}
                  renderItem={(item) => (
                      <div className='item-feeling' style={{backgroundColor: colors[item.id], }}>
                          <Row>
                              <Col span={8} className="aligned-to-center">
                                {/* <Avatar src="/images/LogoYnl.png" /> */}
                              </Col>
                              <Col span={16}>
                                  <h2 style={{color:"white", textAlign:"left", marginBottom:"0px"}}> {item.feeling} </h2>
                                  <h3 style={{color:"white", textAlign:"left", marginBottom:"0px"}}>{item.label}</h3>
                                  <p style={{color:"white", textAlign:"left", marginBottom:"0px"}}>{item.description}</p>
                              </Col>
                          </Row>
                      </div> 
                  )}
              />
            </Col>
                
        </Card>
    </>
  )
}

export default PersonalRecord