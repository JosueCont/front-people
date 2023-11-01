import {React, useEffect, useState} from 'react'
import {Card, Badge, Col, Row} from 'antd'
import moment from 'moment/moment';
import Calendar from './Calendar'
import { Global, css } from '@emotion/core';

const FeelingCalendar = () => {
    const [value, setValue] = useState(moment('2017-01-25'));
    const [selectedValue, setSelectedValue] = useState(moment('2017-01-25'));
    const getListData = (value) => {
        let listData;
      
        switch (value.date()) {  
          case 8:
            listData = [
              {
                type: 'warning',
              },
            ];
            break;
      
          case 10:
            listData = [
              {
                type: 'success',
              }, 
            ];
            break;
      
          case 15:
            listData = [
              {
                type: 'warning',
              },
            ];
            break;
      
          default:
        }
      
        return listData || [];
    };
    const getMonthData = (value) => {
        if (value.month() === 8) {
          return 1394;
        }
    };
    const monthCellRender = (value) => {
        const num = getMonthData(value);
        return num ? (
          <div className="notes-month">
            <section>{num}</section>
            <span>Backlog number</span>
          </div>
        ) : null;
    };
    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
        <ul className="events">
            {listData.map((item) => (
            <li key={item.content}>
                <Badge status={item.type} text={item.content} />
            </li>
            ))}
        </ul>
        );
    };
    const onSelect = (newValue) => {
        setValue(newValue);
        setSelectedValue(newValue);
    };

    const onPanelChange = (newValue) => {
        setValue(newValue);
    };
  return (
    <>
        <Card  
            className='card-dashboard'
            title="Última emoción registrada por día"
            style={{
                width: '100%',
            }}>
            <Row style={{marginBottom:40}} align={'center'}>
                <Col className='aligned-to-start'>
                    <div className='indicator-inspired'></div>
                    <div><span>Asco</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-glad'></div>
                    <div><span>Alegría</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-open'></div>
                    <div><span>Sorpresa</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-depressed'></div>
                    <div><span>Tristeza</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-peace'></div>
                    <div><span>Amor</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-confused'></div>
                    <div><span>Miedo</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-upset'></div>
                    <div><span>Irá</span></div>
                </Col>
            </Row>
            <Calendar  />    
        </Card>
    </>
  )
}

export default FeelingCalendar