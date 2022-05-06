import React, {useState, useEffect} from 'react';
import {Row, Col, Progress, Card, Table } from 'antd';
import moment from "moment";
import {
  ContentTitle,
  ContentEnd,
  ContentStart,
  ProgressPurple,
  CustomBtn,
} from "./Styled";

const TableAssessments = ({user_assessments, loading, ...props}) => {

  const [generalPercent, setGeneralPercent] = useState(0);

  useEffect(()=>{
    if(user_assessments.length > 0){
      calculatePercent()
    }
  },[user_assessments])

  const calculatePercent = () => {
    let progress = 0;
    let percent = 100 / (user_assessments.length * 100);
    user_assessments.map((item)=> {
        if (item.apply){
            progress = progress + item.apply.progress;
        }
    })
    let total = percent * progress;
    setGeneralPercent(total.toFixed(2))
  }

  const columns = [
    {
      title: 'NOMBRE',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'FECHA',
      render: (item) =>{
        return(
          <>
            {item.apply?.progress == 100 ? (
              // <Moment format='LLL' date={item.apply?.end_date} locale={'es-mx'}/>
              <span>{moment(item.apply?.end_date).format('LLL').toString()}</span>
            ):(
              <span>Pendiente</span>
            )}
          </>
        )
      }
    },
    {
      title: 'AVANCE',
      render: (item)=>{
        return(
          <Progress percent={item.apply?.progress} size={'small'}/>
        )
      }
    },
    {
      title: 'ACCIONES',
      width: 150,
      render: (item)=>{
        return(
          <>
            {item.apply?.progress == 100 ? (
              <CustomBtn
                size={'small'}
                bg={'#ed6432'}
                wd={'150px'}
              >
                  Ver resultados
              </CustomBtn>
            ):(
              <CustomBtn
                size={'small'}
                bg={'#814cf2'}
                wd={'150px'}
                // onClick={()=>startAssessment(item)}
              >
                <span>Pendiente</span>
              </CustomBtn>
            )}
          </>
        )
      }
    }
  ]

  return (
    // <Card bordered={false} style={{borderRadius: '12px'}}>
      <Row gutter={[24,24]} align={'middle'}>
        {/* <Col span={24}>
          <ContentTitle>
            <p>Psicometría</p>
            <p>Evaluaciones individuales o grupales</p>
          </ContentTitle>
        </Col> */}
        <Col span={24}>
          <ProgressPurple percent={generalPercent}/>
        </Col>
        <Col span={24}>
          <Table
            className={'custom-tbl-assessment'}
            // size={'small'}
            rowKey={'id'}
            showHeader={false}
            columns={columns}
            loading={loading}
            dataSource={user_assessments}
            pagination={{
                pageSize: 10,
                total: user_assessments?.length
            }}
          />
        </Col>
      </Row>
    // </Card>
  )
}

export default TableAssessments;