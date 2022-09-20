import {React, useEffect, useState} from 'react'
import {Row,
    Col,
    Card,
    Table,
    Tag,
    Space,
    Tooltip} from 'antd'
import { blueGrey } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import { values } from 'lodash';
import moment from 'moment/moment';

const GroupEmotionsPerDayChart = ({ynlStore,...props}) => {
    let colors = [
      "#1a85ff",
      "#ff457d",
      "#2fdaff",
      "#ffc700",
      "#ff5e00",
      "#ff1111",
      "#9c4fff"
    ]
    const getEmotionsNum = (item) =>{
      let check = [];
      for (let i = 0; i < item.total; i++) {
        check.push(item.id);
      }
      return (
        item.total > 0 &&
        check.map(() => (
          <div
            className={"indicator-emotion"}
            style={{ background: colors[item.feeling_id-1] }}
          />
        ))
      );
    }

    const columns = [  
      {
        title: 'Fecha',
        dataIndex: 'end',
        key: 'end',
        width:120,
        render: ( init ) => (
            <div>
              <p style={{marginBottom:0, textAlign:"center", textTransform:"capitalize"}}>{moment(init).format("dddd")}</p> 
              <p style={{marginBottom:0, textAlign:"center"}}>{moment(init).format("DD/MMM/YYYY")}</p>
            </div>
        )
      },
      {
        title: "Estados de ánimo",
        render: ({ emotions }) => (
          <Row>
            <Col style={{display:"flex"}}>
              {
                emotions.map((item) => {
                  return getEmotionsNum(item); 
                })
              }
            </Col>
          </Row>
        )
      }
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
            <Table columns={columns} dataSource={ynlStore} pagination={true} size={'100%'} />
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