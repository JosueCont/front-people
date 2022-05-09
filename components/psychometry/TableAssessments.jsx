import React, {useState, useEffect} from 'react';
import {Row, Col, Progress, Card, Table } from 'antd';
import moment from "moment";
import jwtEncode from "jwt-encode";
import { popupWindow, getCurrentURL } from '../../utils/constant';
import {
  ContentTitle,
  ContentEnd,
  ContentStart,
  ProgressPurple,
  CustomBtn,
} from "./Styled";
import WebApiAssessment from '../../api/WebApiAssessment';

const TableAssessments = ({user_assessments, loading, user_profile,...props}) => {

  const [generalPercent, setGeneralPercent] = useState(0);
  const [loadResults, setLoadResults] = useState({});

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

  const getFieldResults = (item, data) =>{
    if(item.code == '7_KHOR_EST_SOC'){
      return data.resultados;
    }else if(item.code == '4_KHOR_PERF_MOT'){
      return data.summary_results;
    }else if(item.code == '16_KHOR_INT_EMO'){
      let result = data.results_string.split('.');
      // let result = data.results_string.replace('.','');
      return result[0];
    }
  }

  const getFieldDate = (item) =>{
    let endDate = item.apply?.end_date;
    let applyDate = item.apply?.apply_date;
    return endDate ?
      moment(endDate).format('LLL') :
      moment(applyDate).format('LLL');
  }

  const getResults = async (item) => {
    setLoadResults({...loadResults, [item.code]: true})
    try {
      let data = {
        user_id: user_profile.id,
        assessment_code: item.code
      }
      let response = await WebApiAssessment.getAssessmentResults(data);
      tokenToResults(item, response.data)
    } catch (e) {
      setLoadResults({...loadResults, [item.code]: false})
      console.log(e)
    }
  }

  const tokenToResults = (item, data) =>{
    const body = {
      assessment: item.id,
      user_id: user_profile.id,
      firstname: user_profile.first_name,
      lastname: `${user_profile.flast_name} ${user_profile.mlast_name ? user_profile.mlast_name : ''}`,
      user_photo_url: user_profile.photo,
      company_id: user_profile.node,
      url: getCurrentURL(),
      assessment_date: getFieldDate(item),
      assessment_results: getFieldResults(item,data),
      assessment_xtras: { stage: 2 }
    }
    const token = jwtEncode(body, 'secret', 'HS256');
    const url = `https://humand.kuiz.hiumanlab.com/?token=${token}`;
    setLoadResults({...loadResults, [item.code]: false})
    popupWindow(url, 'Resultados')
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
              <span>{getFieldDate(item)}</span>
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
        let show = (item.code == '5_KHOR_DOM_CER' || item.code == '48_KHOR_INV_VAL_ORG') ? true : false;
        return !show && (
          <>
            {item.apply?.progress == 100 ? (
              <CustomBtn
                size={'small'}
                bg={'#ed6432'}
                wd={'150px'}
                loading={loadResults[item.code]}
                onClick={()=>getResults(item)}
              >
                  Ver resultados
              </CustomBtn>
            ):(
              <CustomBtn
                size={'small'}
                bg={'#814cf2'}
                wd={'150px'}
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
    <Row gutter={[24,24]} align={'middle'}>
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
  )
}

export default TableAssessments;