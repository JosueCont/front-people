import {React, useEffect, useState} from 'react'
import { Tabs, Table, Button, Tooltip, Empty, Modal, message, Col, Input, Radio, Space, Select  } from 'antd'
import { DeleteOutlined, RedoOutlined, RetweetOutlined, EyeOutlined } from '@ant-design/icons';
import WebApiAssessment from '../../../api/WebApiAssessment';
import { useRouter } from 'next/router';
import moment from 'moment/moment';
import { useSelector } from 'react-redux'
import { popupWindow, getCurrentURL } from '../../../utils/constant';
import jwtEncode from "jwt-encode";
import { domainKuiz } from '../../../api/axiosApi';
import { valueToFilter } from '../../../utils/functions';

const TableAssessments = ({
  user_profile,
  ...props
}) => {
  const infoPerson = useSelector((state) => state?.userStore?.people_company)
  const router = useRouter();
  moment.locale("es-mx");
  const [dataAssessments, setDataAssessments] = useState([]);
  const [idUser, setIdUser] = useState({});
  const [dataUser, setDataUser] = useState({});
  const [loadResults, setLoadResults] = useState({});
  const [numberAssessments, setNumberAssessments] = useState(0);
  const [typeFilter, setTypeFilter] = useState(1);
  const [nameAssessment, setNameAssessment] = useState("");
  const [statusAssessment, setStatusAssessment] = useState(4);
  const [fullAssessments, setfullAssessments] = useState([]);

  useEffect(()=>{
    if(router.query.id){
      let info = infoPerson.filter(item => item.value === router.query.id);
      setDataUser(info?.at(-1));
      let data = { person: router.query.id }
      // let data = {person: "a042f8935bc742f7a3404ebd7f09656d"}
      setIdUser(data);
      getUserListAssessments(data)
    }
  },[router])

  const getUserListAssessments = async (data) =>{
    try {
      let response = await WebApiAssessment.getUserListAssessments(data);
      let dataOriginal = response.data.map((item)=>{
        return [item.id,item]
      })
      var dataMap = new Map(dataOriginal);
      let dataToTable = [...dataMap.values()];
      setDataAssessments(dataToTable);
      setfullAssessments(dataToTable);
      console.log("assessments",dataToTable)
      setNumberAssessments(dataToTable.length)
      // setDataAssessments(dataExample);
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  };

  const modalDelete = (data) =>{
    let dataApply = { apply_id: data }
    Modal.confirm({
      title: "¿Está seguro de eliminar esta evaluación?",
      content: "Si lo elimina no podrá recuperarlo",
      cancelText: "Cancelar",
      okText: "Sí, eliminar",
      onOk: () => {deleteApply(dataApply)}
    });
  }

  const deleteApply = async (data) => {
    try {
      let response = await WebApiAssessment.deleteAssessmentUser(data);
      message.success("La asignación se elimino correctamente");
      getUserListAssessments(idUser);
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  }

  const modalReset = (data) =>{
    let dataApply = { apply_id: data}
    Modal.confirm({
      title: "¿Está seguro de reiniciar esta evaluación?",
      content: "",
      cancelText: "Cancelar",
      okText: "Sí, reiniciar",
      onOk: () => {resetApply(dataApply)}
    });
  }

  const restartApply = async (data) => {
    try {
      let response = await WebApiAssessment.restartAssessmentUser(data);
      getUserListAssessments(idUser);
      message.success("La asignación se reasigno correctamente");
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  }

  const modalRestart = (data) =>{
    console.log("data evaluación",data)
    let dataApply = { assessment: data.id, user_id: idUser.person}
    console.log("datos a enviar", dataApply)
    Modal.confirm({
      title: "¿Está seguro de reasignar esta evaluación?",
      content: "",
      cancelText: "Cancelar",
      okText: "Sí, reasignar",
      onOk: () => {restartApply(dataApply)}
    });
  }

  const resetApply = async (data) =>{
    try {
      let response = await WebApiAssessment.resetAssessmentUser(data);
      message.success("La asignación se reinicio correctamente");
      getUserListAssessments(idUser);
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  }

  const validateGetResults = (item, record) =>{
    setLoadResults({...loadResults, [item.code]: true})
    let codes = [
      '7_KHOR_EST_SOC',
      '4_KHOR_PERF_MOT',
      '16_KHOR_INT_EMO',
      '48_KHOR_INV_VAL_ORG',
      '5_KHOR_DOM_CER'
    ]
    if(codes.includes(item.code)){
      getResults(item, record)
    }else{
      tokenToResults(item, record)
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

  const getResults = async (item, record) => {
    try {
      let data = {
        apply_id: record.id,
      };
      let response = await WebApiAssessment.getAssessmentResults(data);
      tokenToResults(item, record, response);
    } catch (e) {
      message.error('Resultados no encontrados');
      setLoadResults({...loadResults, [item.code]: false});
      console.log(e)
    }
  }

  const convertResults = (results) =>{
    if(results){
      if(typeof(results) == 'string'){
        let obj = JSON.parse(results);
        return obj.variable_results
          ? obj.variable_results
          : '';
      }else{
        return results.variable_results
          ? results.variable_results
          : '';
      }
    }else{
      return '';
    }
  }

  const getFieldDate = (apply, isObj) =>{
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

  const tokenToResults = (item, record, response) =>{
    let string_results = response
      ? getFieldResults(item, response)
      : convertResults(record);

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
        apply_id: record.id
      }
      const token = jwtEncode(body, 'secret', 'HS256');
      const url = `${domainKuiz}/?token=${token}`;
      // const url = `http://humand.localhost:3002/?token=${token}`;
      popupWindow(url)
    }else{
      message.error('Resultados no encontrados');
    }
    setLoadResults({...loadResults, [item.code]: false});
  }

  const columnsAssessments = [
    {
        title: 'Evaluación',
        render: (record) => {
          return <>
              <span>{record.name} ({record.applys.length})</span>
              {/* <DeleteOutlined style={{color:"red", cursor:"pointer"}} /> */}
            </> ;
        }
    },
    {
      title: 'Fecha inicio evaluación',
      // dataIndex: "apply_date",
      // render: record => record != null ? <span>{moment.parseZone(record).format('LL')}</span> : <span></span>
      render: (record) => {
        return record?.applys[0]?.apply_date != null ? <span>{moment.parseZone(record?.applys[0]?.apply_date).format('LL')}</span> : <span></span>;
      }
    },
    {
      title: 'Fecha fin evaluación',
      // dataIndex: "end_date",
      // render: record => record != null ? <span>{moment.parseZone(record).format('LL')}</span> : <span></span>
      render: (record) => {
        return record?.applys[0]?.end_date != null ? <span>{moment.parseZone(record?.applys[0]?.end_date).format('LL')}</span> : <span></span>;
      }
    },
    {
      title: 'Estatus',
      render: (record) => {
        if(record?.applys[0]?.status == 0){
          return(
            <span>Pendiente</span>
          )
        }else if(record?.applys[0]?.status == 1) {
          return(
            <span>Iniciada</span>
          )
        }else if(record?.applys[0]?.status ==2) {
          return(
            <span>Finalizada</span>
          )
        }
      }
    },
    {
      title: 'Progreso',
      render: record => <span>{record?.applys[0]?.progress}%</span>,
    },
    {
      title: 'Acciones',
      render: (record) => {
        let isEmpty = record.applys.filter(item => item.status == 0)
        return (
          <>
            <div style={{display:"flex", justifyContent:"left", alignItems:"center"}}>
              { isEmpty.length === 0 &&
                <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalRestart(record)}>
                  <Tooltip title="Reasignar evaluación">
                  <RetweetOutlined />
                  </Tooltip>
                </Button>
              }
              { record?.applys[0]?.status === 1 &&
                <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalReset(record?.applys[0]?.id)}>
                  <Tooltip title="Reiniciar evaluación">
                    <RedoOutlined />
                  </Tooltip>
                </Button>
              }
              { record?.applys[0]?.status === 2 &&
                <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> validateGetResults(record,record?.applys[0])}>
                  <Tooltip title="Ver resultados">
                    <EyeOutlined />
                  </Tooltip>
                </Button>
              }
              { record?.applys.length > 0 &&
                <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalDelete(record?.applys[0]?.id)}>
                  <Tooltip title="Eliminar evaluación">
                    <DeleteOutlined/>
                  </Tooltip>
                </Button>
              }
            </div>
          </>
        )
      }
    },    
  ];

  const onChange = (e) =>{
    if(e.target.value == 1){
      setTypeFilter(1)
    }else{
      setTypeFilter(2)
    }
  }

  const onFilterName = ({target}) =>{
    setNameAssessment(target.value);
    console.log("valores:",target.value)
    if((target.value).trim()){
      let results = fullAssessments.filter((item)=> valueToFilter(item.name_es).includes(valueToFilter(target.value)));
      setDataAssessments(results)
    }else{
      setDataAssessments(fullAssessments)
    }
  }

  const onFilterStatus = (status) => {
    setStatusAssessment(status);
    if(status != 4){
      let results = fullAssessments.filter(item => item?.applys[0]?.status == status)
      setDataAssessments(results)
    }else{
      setDataAssessments(fullAssessments)
    }
  }
  
  const expandedRowRender = (item) => {
    const columnsHistory = [
      {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
      },
      {
          title: 'Fecha inicio evaluación',
          dataIndex: "apply_date",
          render: record => record != null ? <span>{moment.parseZone(record).format('LL')}</span> : <span></span>
      },
      {
          title: 'Fecha fin evaluación',
          dataIndex: "end_date",
          render: record => record != null ? <span>{moment.parseZone(record).format('LL')}</span> : <span></span>
      },
      {
        title: 'Estatus',
        dataIndex: "status",
        render: (record) => {
          if(record == 0){
            return(
              <span>Pendiente</span>
            )
          }else if(record == 1) {
            return(
              <span>Iniciada</span>
            )
          }else if(record ==2) {
            return(
              <span>Finalizada</span>
            )
          }
        }
      },
      {
        title: 'Progreso',
        dataIndex: "progress",
        render: record => <span>{record}%</span>,
      },
      {
        title: 'Acciones',
        render: (record) => {
          if(record.status == 0){
            return(
              <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalDelete(record.id)}>
                <Tooltip title="Eliminar evaluación">
                  <DeleteOutlined />
                </Tooltip>
              </Button>
            )
          }else if(record.status == 1) {
            return(
              <>
                <div style={{display:"flex", justifyContent:"left", alignItems:"center"}}>
                  <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalReset(record.id)}>
                    <Tooltip title="Reiniciar evaluación">
                      <RedoOutlined />
                    </Tooltip>
                  </Button>
                  <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalDelete(record.id)}>
                    <Tooltip title="Eliminar evaluación">
                      <DeleteOutlined/>
                    </Tooltip>
                  </Button>
                </div>
              </>
            )
          }else if(record.status ==2) {
            return(
              <>
                <div style={{display:"flex", justifyContent:"left", alignItems:"center"}}>
                  <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> validateGetResults(item,record)}>
                    <Tooltip title="Ver resultados">
                      <EyeOutlined />
                    </Tooltip>
                  </Button>
                  <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalDelete(record.id)}>
                    <Tooltip title="Eliminar evaluación">
                      <DeleteOutlined/>
                    </Tooltip>
                  </Button>
                </div>
              </>
            )
          }
        }
      },
    ];
    return <Table columns={columnsHistory}
              dataSource={item.applys}
              pagination={false}
              style={{marginTop:"8px", marginBottom:"8px"}}
              locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin historial de esta evaluación" />}}
            />;
  };
    
  return (
    <>
        <div style={{padding:"16px", backgroundColor:"white", borderRadius:"15px"}}>
            <h2>Asignaciones de {user_profile.first_name} {user_profile.flast_name} ({numberAssessments})</h2>
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
              <Radio.Group defaultValue={1} onChange={onChange}>
                  <Space direction="horizontal">
                      <Radio value={1}>Evaluación</Radio>
                      <Radio value={2}>Estatus</Radio>
                  </Space>
              </Radio.Group>
              { typeFilter == 1 &&
                <Input
                  placeholder={'Buscar por nombre'}
                  value={nameAssessment}
                  onChange={onFilterName}
                />
              }
              { typeFilter == 2 &&
                <Select defaultValue={4} value={statusAssessment} onChange={onFilterStatus}>
                  <Option value={4}>Todos</Option>
                  <Option value={0}>Pendiente</Option>
                  <Option value={1}>Iniciada</Option>
                  <Option value={2}>Finalizada</Option>
                </Select>
              }
            </Col>
            <Table
              rowKey={record => record.id}
              columns={columnsAssessments}
              expandable={{
              expandedRowRender,
              defaultExpandedRowKeys: ["id"],
              }}
              dataSource={dataAssessments}
              size="small"
              style={{marginTop:"16px"}}
              locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin asignaciones" />}}
            />
        </div>
    </>
  )
}

export default TableAssessments