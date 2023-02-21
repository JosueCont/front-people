import {React, useEffect, useState} from 'react'
import { Table, Button, Tooltip, Empty, Modal, message, Col, Input, Radio, Space, Select, Row, DatePicker, List} from 'antd'
import { DeleteOutlined, RedoOutlined, RetweetOutlined, 
  EyeOutlined, FileDoneOutlined, FileSyncOutlined, 
  PercentageOutlined, PlusSquareOutlined, MinusSquareOutlined, SolutionOutlined, MinusCircleOutlined, TeamOutlined, UnorderedListOutlined, ArrowLeftOutlined  } from '@ant-design/icons';
import WebApiAssessment from '../../../api/WebApiAssessment';
import { useRouter } from 'next/router';
import moment from 'moment/moment';
import { useSelector } from 'react-redux'
import { popupWindow, getCurrentURL } from '../../../utils/constant';
import jwtEncode from "jwt-encode";
import { valueToFilter } from '../../../utils/functions';
import CardGeneric from '../../dashboards-cards/CardGeneric';
import locale from 'antd/lib/date-picker/locale/es_ES';
import {urlKuizBaseFront, typeHttp} from '../../../config/config'

let tenant = "demo";

if (process.browser) {
  let splitDomain = window.location.hostname.split(".");
  if (splitDomain.length > 0) {
    tenant = splitDomain[0];
  }
}

// Set url Kuiz Base Front with Tenant
const urlKuizBaseFrontWithTenant = `${typeHttp}://${tenant}.${urlKuizBaseFront}`

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
  const [assessmentsComplete, setAssessmentsComplete] = useState(0);
  const [assessmentsToAnswer, setAssessmentsToAnswer] = useState(0);
  const [assessmentsProgress, setAssessmentsProgress] = useState(0);
  const [nameGroups, setNameGroups] = useState([]);
  const [openModalGroups, setOpenModalGroups] = useState(false);
  const options = [
    {
      value: 1,
      label: 'Filtrar por evaluación',
    },
    {
      value: 2,
      label: 'Filtrar por estatus',
    },
    {
      value: 3,
      label: 'Filtrar por fecha fin de evaluación',
    },
  ]

  useEffect(()=>{
    if(router.query.id){
      let info = infoPerson.filter(item => item.value === router.query.id);
      setDataUser(info?.at(-1));
      let data = { person: router.query.id }
      setIdUser(data);
      getUserListAssessments(data)
    }
  },[router])

  const getUserListAssessments = async (data) =>{
    try {
      let response = await WebApiAssessment.getUserListAssessments(data);
      response.data.sort((a, b) => {
        if (a.name_es > b.name_es) { return 1; } if (a.name_es < b.name_es) { return -1;} return 0;
      });
      let filterGroupal = response.data.reduce((prev, current, index, array) =>{
        let isDuplicated = prev.some(item => item.id === current.id);
        let is_personal = array.some(item => item.id === current.id && item.origin === "personal");
        if(isDuplicated){
          return prev.map(record =>{
            if(record.id == current.id){
              let currentRecord = record?.group?.name ?? "";
              let currentList = record["list_groups"]??[];
              let validationGroups = current.origin == "group";
              let list_groups = validationGroups ? [...currentList, current.group.name, currentRecord] : currentList;
              return{...record, is_duplicated: true, is_personal, list_groups};
            }
            return record;
          })
        }
        return [...prev, current];
      },[])
      setDataAssessments(filterGroupal);
      setfullAssessments(filterGroupal);
      calculateIndicatorsCards(filterGroupal)
      calculateProgressCard(filterGroupal)
      setNumberAssessments(filterGroupal.length)
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  };

  const modalDelete = (data) =>{
    let dataApply = { apply_id: data }
    Modal.confirm({
      title: "¿Está seguro de eliminar esta evaluación?",
      content: "Si la elimina no podrá recuperarla",
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
    let dataApply = { assessment: data.id, user_id: idUser.person}
    Modal.confirm({
      title: "¿Volver a contestar esta evaluación?",
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

  const modalDeleteAssessment = (data) =>{
    let dataApply = { assessment: data.id, user_id: idUser.person}
    Modal.confirm({
      title: "¿Está seguro de retirar esta evaluación?",
      content: "",
      cancelText: "Cancelar",
      okText: "Sí, retirar",
      onOk: () => {deleteAssessment(dataApply)}
    });
  }

  const deleteAssessment = async (data) =>{
    try {
      let response = await WebApiAssessment.deleteAssessmentPersonal(data);
      message.success("La asignación fue retirada correctamente");
      getUserListAssessments(idUser);
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  }

  const modalGroups = (data) =>{
    let unicNames = data.reduce( (accArr, valor) => {
      if (accArr.indexOf(valor) < 0) {
        accArr.push(valor);
      }
      return accArr;
    }, []);
    setNameGroups(unicNames);
    setOpenModalGroups(true);
  }

  const handleOk = () => {
    setOpenModalGroups(false);
  };

  const handleCancel = () => {
    setOpenModalGroups(false);
  };

  //INICIA APARTADO PARA VER RESULTADOS
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
      if(typeof(results.results) == 'string'){
        let new_string_results = results.results.replace(/'/g, '"');
        let obj = JSON.parse(new_string_results);
        return obj.assessment_results
          ? obj.assessment_results
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
      const url = `${urlKuizBaseFrontWithTenant}/?token=${token}`;
      // const url = `http://humand.localhost:3002/?token=${token}`;
      popupWindow(url)
    }else{
      message.error('Resultados no encontrados');
    }
    setLoadResults({...loadResults, [item.code]: false});
  }
  //TERMINA APARTADO PARA VER RESULTADOS

  const columnsAssessments = [
    {
        title: 'Evaluación',
        render: (record) => {
          return record?.is_personal ? 
          <>
              <span>{record.name} ({record.applys.length})</span>
              <Tooltip title="Asignada de manera individual"><SolutionOutlined style={{color:"#F99543", marginLeft:"8px"}} /></Tooltip> 
          </> 
            : <span>{record.name} ({record.applys.length})</span>;
        }
    },
    {
      title: 'Grupo de evaluaciones',
      render: (record) => {
        return record?.group ? 
        <>
          <span>{record.group.name}</span>
          { record?.list_groups?.length >=2 &&
            <Tooltip title="Ver grupos de evaluaciones">
              <UnorderedListOutlined style={{color:"#F99543", marginLeft:"8px"}} onClick={()=> modalGroups(record.list_groups)} />
            </Tooltip> 
          }
        </>
        : <><span></span></>;
      }
  },
    {
      title: 'Fecha inicio evaluación',
      render: (record) => {
        return record?.applys[0]?.apply_date != null ? <span>{moment.parseZone(record?.applys[0]?.apply_date).format('LL')}</span> : <span></span>;
      }
    },
    {
      title: 'Fecha fin evaluación',
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
      render: (record) => {
        return record?.applys[0]?.progress ? <span>{record?.applys[0]?.progress}%</span> : <span></span>;
      }
    },
    {
      title: 'Acciones',
      render: (record) => {
        let isEmpty = record.applys.filter(item => item.status == 0)
        let applysFinalized = record.applys.filter(item => item.status == 2)
        return (
          <>
            <div style={{display:"flex", justifyContent:"left", alignItems:"center"}}>
              { isEmpty.length === 0 && record?.applys[0]?.status != 1 &&
                <Tooltip title="Contestar evaluación de nuevo">
                  <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalRestart(record)}>
                    <RetweetOutlined />
                  </Button>
                </Tooltip>
              }
              { record?.applys[0]?.status === 1 &&
                <Tooltip title="Reiniciar evaluación">
                  <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalReset(record?.applys[0]?.id)}>
                    <RedoOutlined />
                  </Button>
                </Tooltip>
              }
              { record?.applys[0]?.status === 2 &&
                <Tooltip title="Ver resultados">
                  <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> validateGetResults(record,record?.applys[0])}>
                    <EyeOutlined />
                  </Button>
                </Tooltip>
              }
              { record?.applys[0]?.status != 2 && record?.applys.length > 0 &&
                <Tooltip  title={record?.applys[0]?.status == 0 ? "Eliminar evaluación pendiente" : record?.applys[0]?.status == 1 ? "Eliminar evaluación en curso" : ""}>
                  <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalDelete(record?.applys[0]?.id)}>
                    <DeleteOutlined/>
                  </Button>
                </Tooltip>
              }
              { applysFinalized.length == 0 && record?.is_personal &&
                <Tooltip title="Quitar asignación">
                  <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalDeleteAssessment(record)}>
                    <MinusCircleOutlined />
                  </Button>
                </Tooltip>
              }
              { applysFinalized.length == 0 && record.origin === "personal" &&
                <Tooltip title="Quitar asignación">
                  <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalDeleteAssessment(record)}>
                    <MinusCircleOutlined />
                  </Button>
                </Tooltip>
              }
            </div>
          </>
        )
      }
    },    
  ];

  const onChange = (e) =>{
    if(e == 1){
      setTypeFilter(1)
    }else if(e == 2){
      setTypeFilter(2)
    }else if(e == 3){
      setTypeFilter(3)
    }
  }

  const onFilterName = ({target}) =>{
    setNameAssessment(target.value);
    if((target.value).trim()){
      let results = fullAssessments.filter(item => item.name.toLowerCase().includes(target.value.toLowerCase()) || item?.group?.name.toLowerCase().includes(target.value.toLowerCase()))
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

  const onFilterDates = (date) => {
    if(date){
      let dateFilter = moment(date._d).format('L');  
      if(dateFilter){
        let applysWithData = fullAssessments.filter(item => item.applys.length > 0);
        let results = applysWithData.filter(item =>  moment(item?.applys[0]?.end_date).format('L') == dateFilter  )
        setDataAssessments(results)
      }else{
        setDataAssessments(fullAssessments)
      }
    }else{
      setDataAssessments(fullAssessments)
    }
  }

  const calculateIndicatorsCards = (assessments) =>{
    let toAnswer = 0;
    let completed = 0;
    assessments.map((item)=> {
      if (item?.applys[0]){
        if(
          item?.applys[0]?.progress == 100 ||
          item?.applys[0]?.status == 2 
        ){
          completed = completed + 1;
        }else{
          toAnswer = toAnswer + 1;
        }
      }else{
        toAnswer = toAnswer + 1;
      }
    })
    setAssessmentsComplete(completed)
    setAssessmentsToAnswer(toAnswer)
  }

  const calculateProgressCard = (assessments) =>{
    if(assessments.length > 0){
      let progress = 0;
      let percent = 100 / (assessments.length * 100);
      assessments.map((item)=> {
        if(item?.applys[0]){
          progress = progress + item?.applys[0]?.progress;
        }
      })
      let total = percent * progress;
      setAssessmentsProgress(`${total.toFixed(0)}%`)
    }else{
      setAssessmentsProgress(`0%`)
    }
  }
  
  const getNewFilters = () =>{
    let newFilters = {...router.query};
    if(newFilters.id) delete newFilters.id;
    return newFilters;
  }
  
  const actionBack = () =>{
    let filters = getNewFilters();
    router.push({
        pathname: '/home/persons',
        query: filters
    })
  }
  
  const expandedRowRender = (item) => {
    const columnsHistory = [
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
        render: record => record ? <span>{record}%</span> : <span></span>,
      },
      {
        title: 'Acciones',
        render: (record) => {
          return (
            <>
              <div style={{display:"flex", justifyContent:"left", alignItems:"center"}}>
                { record.status === 1 &&
                  <Tooltip title="Reiniciar evaluación">
                    <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalReset(record.id)}>
                      <RedoOutlined />
                    </Button>
                  </Tooltip>
                }
                { record.status === 2 &&
                  <Tooltip title="Ver resultados">
                    <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> validateGetResults(item,record)}>
                      <EyeOutlined />
                    </Button>
                  </Tooltip>
                }
                { record.status != 2 && record.status == 0 &&
                  <Tooltip title={record.status == 0 ? "Eliminar evaluación pendiente" : record.status == 1 ? "Eliminar evaluación en curso" : ""}>
                    <Button style={{marginLeft:"8px", marginRigth:"8px"}} onClick={()=> modalDelete(record.id)}>
                        <DeleteOutlined />
                    </Button>
                  </Tooltip>
                }
              </div>
            </>
          )
        }

      },
    ];
    return <Table columns={columnsHistory}
              dataSource={item.applys.slice(1)}
              pagination={false}
              style={{marginTop:"8px", marginBottom:"8px"}}
              locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin historial de esta evaluación" />}}
            />;
  };
    
  return (
    <>
        <div style={{padding:"16px", backgroundColor:"white", borderRadius:"15px"}}>
            <Row>
              <Col span={12}>
                <h2>Asignaciones de {user_profile.first_name} {user_profile.flast_name} ({numberAssessments})</h2>
              </Col>
              <Col span={12} style={{display:"flex", justifyContent:"flex-end"}}>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={()=> actionBack()}
                >
                  Regresar
                </Button>
              </Col>
            </Row>
            <Row gutter={[16,16]} style={{marginBottom:"16px"}}>
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
                <Select
                    style={{width:"100%"}}
                    onChange={onChange}
                    options={options}
                    defaultValue={1}
                />
                { typeFilter == 1 &&
                  <Input
                    placeholder={'Buscar por evaluación o grupo'}
                    value={nameAssessment}
                    onChange={onFilterName}
                    style={{width:"100%"}}
                  />
                }
                { typeFilter == 2 &&
                  <Select style={{width:"100%"}} defaultValue={4} value={statusAssessment} onChange={onFilterStatus}>
                    <Option value={4}>Todos</Option>
                    <Option value={0}>Pendiente</Option>
                    <Option value={1}>Iniciada</Option>
                    <Option value={2}>Finalizada</Option>
                  </Select>
                }
                { typeFilter == 3 &&
                  <DatePicker locale={locale} style={{width:"100%"}} onChange={onFilterDates} defaultValue={moment()} format={'DD/MM/YYYY'} />
                }
              </Col>
              <Col
                xs={24}
                md={12}
                lg={12}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent:"end"
                }}
              >
                <Row gutter={[16,16]}>
                  <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                    <Tooltip title="Evaluaciones completadas">
                      <div>
                        <CardGeneric
                          title={assessmentsComplete}
                          icon={<FileDoneOutlined />}
                          color={'#121212'}
                          numcard={''}
                        />
                      </div>
                    </Tooltip>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                    <Tooltip title="Evaluaciones por contestar">
                        <div>
                          <CardGeneric
                            title={assessmentsToAnswer}
                            icon={<FileSyncOutlined />}
                            color={'#121212'}
                            numcard={''}
                          />
                        </div>
                    </Tooltip>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                    <Tooltip title="Porcentaje de avance">
                      <div>
                        <CardGeneric
                          title={assessmentsProgress}
                          icon={<PercentageOutlined />}
                          color={'#121212'}
                          numcard={''}
                        />
                      </div>
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
            </Row>
        </div>
        <Table
          rowKey={record => record.id}
          columns={columnsAssessments}
          expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["id"],
          showExpandColumn: true,
          expandIcon: ({ expanded, onExpand, record }) =>
          record.applys.length >= 2 ? (
            expanded ? <MinusSquareOutlined onClick={e => onExpand(record, e)} /> : 
            <PlusSquareOutlined onClick={e => onExpand(record, e)} />
          ) : (
            null
          )
          }}
          dataSource={dataAssessments}
          size="small"
          style={{marginTop:"16px"}}
          locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin asignaciones" />}}
        />
        <Modal title={"Grupos asignados"} footer={[]} visible={openModalGroups} onOk={handleOk} onCancel={handleCancel}>
            <Col span={24} className='content-feeling-scroll scroll-bar'>
            <List
              size="small"
              dataSource={nameGroups}
              renderItem={(item) => <><div style={{display:"flex", alignItems:"center", justifyContent:"flex-start"}}><TeamOutlined /><List.Item>{item}</List.Item></div></>}
            />
            </Col>
        </Modal>
    </>
  )
}

export default TableAssessments