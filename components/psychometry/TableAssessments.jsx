import React, {useState, useEffect} from 'react';
import {
  Row,
  Col,
  Progress,
  Card,
  Table,
  Input,
  Tooltip,
  message,
  Tag
} from 'antd';
import moment from "moment";
import { connect } from 'react-redux';
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
  BsFillCheckCircleFill,
  BsHandIndex
} from "react-icons/bs";
import AssignAssessments from '../person/assignments/AssignAssessments';
import {urlKuizBaseFront, typeHttp} from '../../config/config'

let tenant = "demo";

if (process.browser) {
  let splitDomain = window.location.hostname.split(".");
  if (splitDomain.length > 0 && !splitDomain[0].includes('localhost') ) {
    tenant = splitDomain[0];
  }
}

// Set url Kuiz Base Front with Tenant
const urlKuizBaseFrontWithTenant = `${typeHttp}://${tenant}.${urlKuizBaseFront}`

const TableAssessments = ({
  user_assessments,
  loading,
  user_profile,
  currentNode,
  getAssessments,
  ...props
}) => {

  moment.locale('es-mx');
  const [generalPercent, setGeneralPercent] = useState(0);
  const [loadResults, setLoadResults] = useState({});
  const [lisAssessments, setListAssessments] = useState([]);
  const [nameAssessment, setNameAssessment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const styleBtn = {
    width:'125px',
    textAlign: 'center',
    fontSize: '14px',
    borderRadius: '50px'
  }

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
      let isArray = true
      if (Array.isArray(item.apply)) {
        isArray = true
      } else {
        isArray = false
      }
      if(isArray){
        if(item?.apply[0]){
          progress = progress + item.apply[0].progress;
        }
      }else{
        if(item?.apply){
          progress = progress + item.apply.progress;
        }
      }
    })
    let total = percent * progress;
    setGeneralPercent(total.toFixed(2))
  }

  const validateGetResults = (item) =>{
    setLoadResults({...loadResults, [item.code]: true})
    let codes = [
      '7_KHOR_EST_SOC',
      '4_KHOR_PERF_MOT',
      '16_KHOR_INT_EMO',
      '48_KHOR_INV_VAL_ORG',
      '5_KHOR_DOM_CER'
    ]
    if(codes.includes(item.code)){
      getResults(item)
    }else{
      tokenToResults(item)
    }
  }

  const getFieldResults = (item, resp) =>{
    if(item.code == '7_KHOR_EST_SOC'){
      let { resultados } = resp.data;
      return resultados ? resultados : '';
    }else if(item.code == '4_KHOR_PERF_MOT'){
      let { summary_results } = resp.data;
      return summary_results ? summary_results : '';
    }else if(item.code == '16_KHOR_INT_EMO'){
      let { results_string } = resp.data;
      return results_string ? results_string.split('.')[0] : '';
    }else if(item.code == '48_KHOR_INV_VAL_ORG'){
      let { resultado } = resp.data;
      return resultado ? resultado : '';
    }else if(item.code == '5_KHOR_DOM_CER'){
      let { dominant_factor, factors } = resp.data;
      return dominant_factor && factors ? {
        interpretation: dominant_factor,
        results: { factors: factors}
      } : '';
    }
  }

  const convertResults = ({results}) =>{
    if(results){
      if(typeof(results) == 'string'){
        let obj = JSON.parse(results);
        return obj.assessment_results
          ? obj.assessment_results
          : '';
      }else{
        return results.assessment_results
          ? results.assessment_results
          : '';
      }
    }else{
      return '';
    }
  }

  const getFieldDate = ({apply}, isObj) =>{
    let endDate = apply.end_date ? apply.end_date : apply.apply_date;
    let formatDate = 'DD/MM/YYYY';
    let formatTime = 'hh:mm a';
    let objDate = {
      date: moment(endDate).format(formatDate),
      time: moment(endDate).format(formatTime)
    }
    let stringDate = moment(endDate).format(`${formatDate} ${formatTime}`);
    return isObj ? objDate : stringDate;
  }

  const getResults = async (item) => {
    let isArray = true
    if (Array.isArray(item.apply)) {
      isArray = true
    } else {
      isArray = false
    }
    try {
      let data = {
        apply_id: isArray ? item.apply[0].id : item.apply.id
      };
      let response = await WebApiAssessment.getAssessmentResults(data);
      tokenToResults(item, response);
    } catch (e) {
      message.error('Resultados no encontrados');
      setLoadResults({...loadResults, [item.code]: false});
      console.log(e)
    }
  }

  const tokenToResults = (item, resp) =>{
    let isArray = true
    if (Array.isArray(item.apply)) {
      isArray = true
    } else {
      isArray = false
    }
    let string_results = resp
      ? getFieldResults(item, resp)
      : convertResults(isArray ? item.apply[0] : item.apply);

    if (string_results){
      const body = {
        assessment: item.id,
        user_id: user_profile.id,
        firstname: user_profile.first_name,
        lastname: `${user_profile.flast_name} ${user_profile.mlast_name ? user_profile.mlast_name : ''}`,
        user_photo_url: user_profile.photo,
        company_id: user_profile.node,
        url: getCurrentURL(),
        assessment_date: getFieldDate(item, true),
        assessment_results: string_results,
        assessment_xtras: { stage: 2 },
        profile_results: null,
        apply_id: isArray ? item.apply[0].id : item.apply.id,
      }
      const token = jwtEncode(body, 'secret', 'HS256');
      const url = `${urlKuizBaseFrontWithTenant}/?token=${token}`;
      // const url = `http://humand.localhost:3002/?token=${token}`;
      popupWindow(url)
    }else{
      message.error('Resultados no encontrados');
    }
    setLoadResults({...loadResults, [item.code]: false});
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

  const onFinishAssigned = async (values) =>{
    try {
      const body = {
        ...values,
        persons: [`${user_profile.id}`],
        node: currentNode?.id
      };
      await WebApiAssessment.assignAssessments(body);
      getAssessments(user_profile.id)
      message.success("Evaluaciones asignadas");
    } catch (e) {
      message.error("Evaluaciones no asignadas");
      console.log()
    } 
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
              item.apply?.progress >= 100 ||
              item.apply?.status == 2
            ) ? (
              <span>{getFieldDate(item, false)}</span>
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
        let isArray = true
        if (Array.isArray(item.apply)) {
          isArray = true
        } else {
          isArray = false
        }
        return(
          <Progress percent={ isArray == true ? item?.apply[0]?.progress : item.apply?.progress} size={'small'}/>
        )
      }
    },
    {
      title: 'ACCIONES',
      width: 150,
      render: (item)=>{
        let isArray = true
        if (Array.isArray(item.apply)) {
          isArray = true
        } else {
          isArray = false
        }
        return(
          <>
            {(
              isArray == true ?
              item?.apply[0]?.status == 2 :
              item?.apply?.status == 2
            ) ? (
              <CustomBtn
                size={'small'}
                bg={'#ed6432'}
                wd={'125px'}
                icon={<BsFillCheckCircleFill/>}
                loading={loadResults[item.code]}
                onClick={()=>validateGetResults(item)}
              >
                  Ver resultados
              </CustomBtn>
            ):(
              <Tag 
                color={'#814cf2'}
                style={styleBtn}
              >
                <span>Pendiente</span>
              </Tag>
            )}
          </>
        )
      }
    }
  ]

  return (
    <>
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
            <Tooltip title={'Asignar evaluaciones'}>
              <CustomBtn
                wd={'50px'}
                icon={<BsHandIndex/>}
                onClick={()=> setShowModal(true)}
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
      <AssignAssessments
        title={"Asignar evaluaciones"}
        visible={showModal}
        close={()=> setShowModal(false)}
        actionForm={onFinishAssigned}
        listAssigned={user_assessments}
      />
    </>
  )
}

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node
  }
};

export default connect(mapState)(TableAssessments);