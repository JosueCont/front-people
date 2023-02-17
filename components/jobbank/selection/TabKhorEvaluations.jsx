import React, {
  useState,
  useEffect,
  useMemo
} from 'react'
import { 
  Row, 
  Col , 
  Form, 
  Input, 
  Select, 
  Button, 
  Table, 
  message, 
  Dropdown,
  Tooltip,
  Modal,
  List,
  Menu } 
  from 'antd'
import { 
  SearchOutlined, 
  EllipsisOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UnorderedListOutlined,
  TeamOutlined,
  EyeOutlined
} from '@ant-design/icons';
import ModalAsignament from './ModalAsignment';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import WebApiJobBank from '../../../api/WebApiJobBank';
import WebApiAssessment from '../../../api/WebApiAssessment';
import { optionsStatusAsignament, optionsSourceType } from "../../../utils/constant";
import ListItems from '../../../common/ListItems';
import { valueToFilter } from '../../../utils/functions';
import { popupWindow } from '../../../utils/constant';
import { domainKuiz } from '../../../api/axiosApi';
import jwtEncode from "jwt-encode";
import { getCurrentURL } from '../../../utils/constant';
import WebApiPeople from '../../../api/WebApiPeople';
import { useRouter } from 'next/router';
import moment from 'moment';

const TabKhorEvaluations = ({
    loading,
    setLoading,
    assesments,
    processSelection,
    asignaments,
    getAssesmets,
    currentNodeId,
    personAssignament
}) => {

    const router = useRouter();
    const [ searchAsignaments, setSearchAsignaments ] = useState([])
    const [loadResults, setLoadResults] = useState({});
    const [userProfile, setUserProfile] = useState({});

    useEffect(() => {
        if(personAssignament.lenght <= 0) return
        setSearchAsignaments(personAssignament)
    },[personAssignament])

    useEffect(() => {
        if(!router.query.user_person) return
        getPerson(router.query?.user_person)
      },[router.query?.user_person])

    const onFilter = ({ target: { value } }) =>{
        if(value.trim()){
            const filter_ = item => valueToFilter(item.name).includes(valueToFilter(value));
            let results = personAssignament.filter(filter_);
            setSearchAsignaments(results)
            return;
        }
        setSearchAsignaments(personAssignament)
    }

    const getPerson = async (id) =>{
        try {
            let response = await WebApiPeople.getPerson(id);
            setUserProfile(response.data)
        } catch (e) {
            console.log(e)
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

    const validateGetResults = (item, record) =>{
        console.log('el item-------->', item)
        console.log('el record----->', record)
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
          console.log('de los 5---->')
        }else{
          tokenToResults(item, record)
          console.log('no de los 5----->')
        }
      }

    const getResults = async (item, record) => {
        try {
            let data = { apply_id: record.id };
            let response = await WebApiAssessment.getAssessmentResults(data);
            tokenToResults(item, record, response);
        } catch (e) {
            message.error('Resultados no encontrados');
            setLoadResults({...loadResults, [item.code]: false});
            console.log(e)
        }
    }

    const tokenToResults = (item, record, response) =>{
        let string_results = response
          ? getFieldResults(item, response)
          : convertResults(record);
    
        if (string_results){
          const body = {
            assessment: item.id,
            user_id: userProfile.id,
            firstname: userProfile.first_name,
            lastname: `${userProfile.flast_name} ${userProfile.mlast_name ? userProfile.mlast_name : ''}`,
            user_photo_url: userProfile.photo,
            company_id: userProfile.node,
            url: getCurrentURL(),
            assessment_date: getFieldDate(item, true),
            assessment_results: string_results,
            assessment_xtras: { stage: 2 },
            profile_results: null,
            apply_id: record.id
          }
          const token = jwtEncode(body, 'secret', 'HS256');
          const url = `${domainKuiz}/?token=${token}`;
          popupWindow(url)
        }else{
          message.error('Resultados no encontrados');
        }
        setLoadResults({...loadResults, [item.code]: false});
    }

    const columns = [
        {
            title: 'Evaluación',
            dataIndex: 'name'
        },
        {
            title: 'Grupo de evaluaciones',
            dataIndex: ['group', 'name'],
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
                return record?.applys[0] ? <span>{record.applys[0].progress}%</span> : <span></span>;
              }
        },
        {
            title: 'Acciones',
            render: (record) =>{
                return record?.applys[0]?.status == 2 ?(
                    <Tooltip title='Ver resultados'>
                        <Button
                            size='small'
                            loading={loadResults[record?.code]}
                            onClick={()=> validateGetResults(record, record?.applys[0])}
                        >
                            <EyeOutlined/>
                        </Button>
                    </Tooltip>
                ) : <></>;
            }
        }
    ]

    return (
        <>
            <Row gutter={[0,24]} className='tab-client'>
                <Col span={24} style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Col span={12}>
                        <Input
                            placeholder='Buscar...'
                            suffix={<SearchOutlined />}
                            onChange={onFilter}
                        />
                    </Col>
                    {/* <Col span={12} style={{display: 'flex'}}>
                        <Button
                            onClick={ () => setOpenModal(true)}
                            style={{marginLeft: 'auto'}}
                        >
                            Agregar
                        </Button>
                    </Col> */}
                </Col>
                <Col span={24}>
                    <Table 
                        rowKey='id'
                        size='small'
                        className='table-custom'
                        columns={ columns }
                        dataSource = { searchAsignaments }
                        pagination = {{
                            hideOnSinglePage: true,
                            showSizeChanger: false
                        }}
                    />
                </Col>
            </Row>
        </>
    )
}

export default TabKhorEvaluations