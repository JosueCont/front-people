import {React, useEffect, useState} from 'react'
import {Row,
    Col,
    Card,
    Table,
    Tag,
    Space,
    Tooltip,
    Empty} from 'antd'
import { blueGrey } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import { set, values } from 'lodash';
import moment from 'moment/moment';

const GroupEmotionsPerDayChart = ({ynlStore,...props}) => {
    let colors = [
      "#d38919",
      "#9fab51",
      "#e4057c",
      "#e7b51c",
      "#73368c",
      "#a92418",
      "#2995cc"
    ]
    const getEmotionsNum = (item) =>{
      return (
        item.total > 0 &&
        <Tooltip title={item.emotions[0].feeling_name + ": "+ item.total}>
          <div className='aligned-to-center' style={{marginLeft:"5px"}}>
            <div
              className={"indicator-emotion"}
              style={{ background: colors[item.feeling_id-1] }}
            />
            <p style={{marginBottom:0,}}><b>{item.total}</b></p>
          </div>
        </Tooltip> 
      );
    }

    const columns = [  
      {
        title: 'Fecha',
        dataIndex: 'end',
        key: 'end',
        width: 120,
        render: ( init ) => (
            <div>
              <p style={{marginBottom:0, textAlign:"center", textTransform:"capitalize"}}>{moment(init).format("dddd")}</p>
              <p style={{marginBottom:0, textAlign:"center"}}>{moment(init).format("DD/MM/YYYY")}</p>
            </div>
        )
      },
      {
        title: "Estados de ánimo",
        render: ({ emotions }) => {
          //Verificamos si hay emociones registradas
          let totals = []
          emotions.map((item)=>{totals.push(item.total)})
          let sum = totals.reduce((a, b) => a + b, 0);
          //Enseñamos texto
          if(sum == 0){
            return(
              <Row>
                <Col style={{display:"flex"}}>
                  <p style={{marginBottom:"0px"}}><b>No se registraron emociones</b></p>
                </Col>
              </Row>
            )
          //Enseñamos emociones
          }else{
            return(
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
        }
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
                  <div className='indicator-depressed'></div>
                  <div><span>Tristeza</span></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-upset'></div>
                  <div><span>Irá</span></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-confused'></div>
                  <div><span>Miedo</span></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-glad'></div>
                  <div><span>Alegría</span></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-peace'></div>
                  <div><span>Amor</span></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-inspired'></div>
                  <div><span>Asco</span></div>
                </Col>
                <Col className='aligned-to-start'>
                  <div className='indicator-open'></div>
                  <div><span>Sorpresa</span></div>
                </Col> 
            </Row>
            <Table columns={columns}
              dataSource={ynlStore.sort((a, b) => new Date(a.end) - new Date(b.end) )} 
              pagination={{
                pageSize: 5,
                total: ynlStore.length,
                position: ['bottomCenter'],
                hideOnSinglePage: true,
                showSizeChanger:false
               }}
              locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No se registraron emociones" />}}
              size="small" />
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