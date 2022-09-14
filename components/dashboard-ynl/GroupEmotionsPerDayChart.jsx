import {React, useEffect, useState} from 'react'
import {Row,
    Col,
    Card,
    Table,
    Tag,
    Space} from 'antd'
import { blueGrey } from '@material-ui/core/colors';
import { connect } from 'react-redux';

const GroupEmotionsPerDayChart = ({ynlStore,...props}) => {
    const columns = [
        {
          title: 'Fecha',
          dataIndex: 'init',
          key: 'init',
          width:120,
          
        },
        {
          title: 'Estado de ánimo',
          dataIndex: 'emotions',
          key: 'emotions',
          render:(_, { emotions }) => (
            <>
              <Row>
                {Object.entries(emotions).map(([key, val])=>{
                  if (val == 1) {
                    return (
                      <Col>
                        <div className='indicator-inspired'></div>
                      </Col>
                    )
                  }else if(val == 2){
                    return (
                      <Col>
                        <div className='indicator-glad'></div>
                      </Col>
                    )
                  }else if(val == 3){
                    return (
                      <Col>
                        <div className='indicator-open'></div>
                      </Col>
                    )
                  }else if(val == 4){
                    return (
                      <Col>
                        <div className='indicator-depressed'></div>
                      </Col>
                    )
                  }else if(val == 5){
                    return (
                      <Col>
                        <div className='indicator-peace'></div>
                      </Col>
                    )
                  }
                  else if(val == 6){
                    return (
                      <Col>
                        <div className='indicator-confused'></div>
                      </Col>
                    )
                  }
                  else if(val == 7){
                    return (
                      <Col>
                        <div className='indicator-upset'></div>
                      </Col>
                    )
                  }
                })}
              </Row>
            </>
          ),
        },
      ];
      const data = [
        {
          key:1,
          fecha: '01/sep/2022',
          emociones: [1,2,3,4,5,6,7]
        },
        {
          key:2,
          fecha: '02/sep/2022',
          emociones: [1,1,5,6,7,7]
        },
        {
          key:3,
          fecha: '03/sep/2022',
          emociones: [1,1,2,3,4,5,5,5,5,6,7,7]
        },
        {
            key:4,
            fecha: '04/sep/2022',
            emociones: [1,1,2,2,3,3,4,4,5,6,7,7]
        },        
        {
            key:5,
            fecha: '05/sep/2022',
            emociones: [1,4,2,1,4,5,1,5,5,3,7,3]
          },
      ];

  return (
    <>
        <Card  
            className='card-dashboard'
            title="Emociones grupales por día"
            style={{
                width: '100%',
            }}>
            <Row>
                <Col className='aligned-to-start'>
                  <div className='indicator-inspired'></div>
                  <div><p>Inspirado</p></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-glad'></div>
                  <div><p>Contento</p></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-open'></div>
                  <div><p>Abierto</p></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-depressed'></div>
                  <div><p>Deprimido</p></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-peace'></div>
                  <div><p>En paz</p></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-confused'></div>
                  <div><p>Confundido</p></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-upset'></div>
                  <div><p>Molesto</p></div>
                </Col> 
            </Row>
            <Table columns={columns} dataSource={ynlStore} pagination={false} size={'100%'} />
        </Card>
    </>
  )
}
const mapState = (state) => {
  return {
    ynlStore: state.ynlStore.dailyEmotions,
  };
};

export default connect(mapState)(GroupEmotionsPerDayChart);