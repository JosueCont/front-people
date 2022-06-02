import React, {useState, useEffect} from 'react';
import {
  Row,
  Col,
  Progress,
  Card,
  Table,
  Input,
  Tooltip
} from 'antd';
import moment from "moment";
import jwtEncode from "jwt-encode";
import { ClearOutlined } from "@ant-design/icons";
import { popupWindow, getCurrentURL } from '../../utils/constant';
import { valueToFilter } from '../../utils/functions';
import {
  ContentTitle,
  ContentEnd,
  ContentStart,
  ProgressPurple,
  CustomBtn,
} from "./Styled";
import WebApiAssessment from '../../api/WebApiAssessment';
import {
  BsPlayCircleFill,
  BsFillCheckCircleFill
} from "react-icons/bs";

const TableAssessments = ({
  user_assessments,
  loading,
  user_profile,
  ...props}) => {

  moment.locale('es-mx');
  const [generalPercent, setGeneralPercent] = useState(0);
  const [loadResults, setLoadResults] = useState({});
  const [lisAssessments, setListAssessments] = useState([]);
  const [nameAssessment, setNameAssessment] = useState('');

  useEffect(()=>{
    if(user_assessments.length > 0){
      calculatePercent()
      setListAssessments(user_assessments)
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

  const validateGetResults = (item) =>{
    setLoadResults({...loadResults, [item.code]: true})
    if(
      item.code == '7_KHOR_EST_SOC' ||
      item.code == '4_KHOR_PERF_MOT' ||
      item.code == '16_KHOR_INT_EMO' ||
      item.code == '48_KHOR_INV_VAL_ORG' ||
      item.code == '5_KHOR_DOM_CER'
    ){
      getResults(item)
    }else{
      tokenToResults(item, item.apply)
    }
  }

  const getFieldResults = (item, resp) =>{
    if(item.code == '7_KHOR_EST_SOC'){
      return resp.data.resultados;
    }else if(item.code == '4_KHOR_PERF_MOT'){
      return resp.data.summary_results;
    }else if(item.code == '16_KHOR_INT_EMO'){
      let result = resp.data.results_string.split('.');
      // let result = data.results_string.replace('.','');
      return result[0];
    }else if(item.code == '48_KHOR_INV_VAL_ORG'){
      return resp.data.resultado;
    }else if(item.code == '5_KHOR_DOM_CER'){
      return {
        interpretation: resp.data.dominant_factor,
        results: { factors: resp.data.factors}
      }
    }else{
      if(typeof(resp.results) == 'string'){
        let obj = JSON.parse(resp.results);
        return obj.assessment_results;
      }else{
        return resp.results?.assessment_results;
      }
    }
  }

  const getFieldDate = (item) =>{
    let endDate = item.apply?.end_date;
    let applyDate = item.apply?.apply_date;
    let formatDate = 'DD/MM/YYYY hh:mm a';
    return endDate ?
      moment(endDate).format(formatDate) :
      moment(applyDate).format(formatDate);
  }

  const getResults = async (item) => {
    try {
      let data = {
        user_id: user_profile.id,
        assessment_code: item.code
      }
      let response = await WebApiAssessment.getAssessmentResults(data);
      tokenToResults(item, response)
    } catch (e) {
      setLoadResults({...loadResults, [item.code]: false})
      console.log(e)
    }
  }

  const tokenToResults = (item, resp) =>{
    const body = {
      assessment: item.id,
      user_id: user_profile.id,
      firstname: user_profile.first_name,
      lastname: `${user_profile.flast_name} ${user_profile.mlast_name ? user_profile.mlast_name : ''}`,
      user_photo_url: user_profile.photo,
      company_id: user_profile.node,
      url: getCurrentURL(),
      assessment_date: getFieldDate(item),
      assessment_results: getFieldResults(item,resp),
      assessment_xtras: { stage: 2 },
      profile_results: null
    }
    const token = jwtEncode(body, 'secret', 'HS256');
    const url = `https://humand.kuiz.hiumanlab.com/?token=${token}`;
    // const url = `http://humand.localhost:3002/?token=${token}`;
    setLoadResults({...loadResults, [item.code]: false})
    popupWindow(url)
  }

  const onFilter = ({target}) => {
    setNameAssessment(target.value)
    if((target.value).trim()){
      let results = user_assessments.filter((item)=> valueToFilter(item.name).includes(valueToFilter(target.value)));
      setListAssessments(results)
    }else{
      setListAssessments(user_assessments)
    }
  }

  const onReset = () =>{
    setNameAssessment('');
    setListAssessments(user_assessments);
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
            {(
              item.apply?.progress == 100 ||
              item.apply?.status == 2
            ) ? (
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
        return(
          <>
            {(
              item.apply?.progress == 100 ||
              item.apply?.status == 2
            ) ? (
              <CustomBtn
                size={'small'}
                bg={'#ed6432'}
                wd={'150px'}
                icon={<BsFillCheckCircleFill/>}
                loading={loadResults[item.code]}
                onClick={()=>validateGetResults(item)}
              >
                  Ver resultados
              </CustomBtn>
            ):(
              <CustomBtn
                size={'small'}
                bg={'#814cf2'}
                wd={'150px'}
                icon={<BsPlayCircleFill/>}
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
      <Col
        xs={24}
        md={12}
        lg={12}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}
      >
         <Input
            placeholder={'Buscar por nombre'}
            style={{borderRadius: '12px'}}
            value={nameAssessment}
            onChange={onFilter}
          />
          <Tooltip title={'Borrar filtros'}>
            <CustomBtn
              wd={'50px'}
              icon={<ClearOutlined/>}
              onClick={()=> onReset()}
            />
          </Tooltip>
      </Col>
      <Col xs={24} md={12} lg={12}>
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
          dataSource={lisAssessments}
          pagination={{
            pageSize: 10,
            total: lisAssessments?.length,
            hideOnSinglePage: true
          }}
          scroll={{x: 600}}
        />
      </Col>
    </Row>
  )
}

export default TableAssessments;