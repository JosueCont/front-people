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
            title="Emoción registrada por día"
            style={{
                width: '100%',
            }}>
            <Row style={{marginBottom:40}} align={'center'}>
                <Col className='aligned-to-start'>
                    <div className='indicator-inspired'></div>
                    <div><span>Inspirado</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-glad'></div>
                    <div><span>Contento</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-open'></div>
                    <div><span>Abierto</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-depressed'></div>
                    <div><span>Deprimido</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-peace'></div>
                    <div><span>En paz</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-confused'></div>
                    <div><span>Confundido</span></div>
                </Col>
                <Col className='aligned-to-start'>
                    <div className='indicator-upset'></div>
                    <div><span>Molesto</span></div>
                </Col>
            </Row>
            <Calendar  />    
        </Card>
    </>
  )
}

export default FeelingCalendar